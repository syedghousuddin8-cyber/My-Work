import { query } from '../config/database';
import { redisClient } from '../config/redis';
import { publishEvent } from '../config/kafka';
import { stripe, STRIPE_CONFIG } from '../config/stripe';
import { logger } from '@delivery/shared';
import Stripe from 'stripe';

export class PaymentService {
  // Create payment intent for order
  async createPaymentIntent(orderId: string, customerId: string, amount: number, vendorId: string) {
    try {
      // Get vendor's Stripe Connect account
      const vendorResult = await query(
        `SELECT stripe_account_id FROM vendors WHERE id = $1`,
        [vendorId]
      );

      if (vendorResult.rows.length === 0) {
        throw new Error('Vendor not found');
      }

      const { stripe_account_id } = vendorResult.rows[0];

      if (!stripe_account_id) {
        throw new Error('Vendor has not connected Stripe account');
      }

      // Calculate platform fee
      const platformFee = Math.round(amount * (STRIPE_CONFIG.platformFeePercent / 100));

      // Create payment intent with Stripe Connect
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: STRIPE_CONFIG.currency,
        customer: customerId,
        application_fee_amount: platformFee,
        transfer_data: {
          destination: stripe_account_id,
        },
        metadata: {
          orderId,
          vendorId,
          platformFee: platformFee.toString(),
        },
      });

      // Save payment record
      const paymentResult = await query(
        `INSERT INTO payments (
          order_id, customer_id, vendor_id, amount, platform_fee,
          stripe_payment_intent_id, status, payment_method
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          orderId,
          customerId,
          vendorId,
          amount,
          platformFee,
          paymentIntent.id,
          'pending',
          'card',
        ]
      );

      const payment = paymentResult.rows[0];

      // Cache payment intent
      await redisClient.setEx(
        `payment:intent:${paymentIntent.id}`,
        3600,
        JSON.stringify({ paymentId: payment.id, orderId })
      );

      logger.info(`Payment intent created: ${paymentIntent.id} for order ${orderId}`);

      return {
        paymentId: payment.id,
        clientSecret: paymentIntent.client_secret,
        amount: payment.amount,
        platformFee: payment.platform_fee,
      };
    } catch (error) {
      logger.error('Create payment intent error:', error);
      throw error;
    }
  }

  // Confirm payment (webhook handler)
  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      const result = await query(
        `UPDATE payments SET
          status = 'completed',
          paid_at = CURRENT_TIMESTAMP,
          stripe_charge_id = $2,
          updated_at = CURRENT_TIMESTAMP
         WHERE stripe_payment_intent_id = $1
         RETURNING *`,
        [paymentIntentId, paymentIntent.charges.data[0]?.id]
      );

      if (result.rows.length === 0) {
        throw new Error('Payment not found');
      }

      const payment = result.rows[0];

      // Publish event
      await publishEvent('payment.completed', {
        paymentId: payment.id,
        orderId: payment.order_id,
        customerId: payment.customer_id,
        vendorId: payment.vendor_id,
        amount: payment.amount,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Payment confirmed: ${payment.id} for order ${payment.order_id}`);

      return payment;
    } catch (error) {
      logger.error('Confirm payment error:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(paymentId: string, amount?: number, reason?: string) {
    try {
      const paymentResult = await query(
        `SELECT * FROM payments WHERE id = $1`,
        [paymentId]
      );

      if (paymentResult.rows.length === 0) {
        throw new Error('Payment not found');
      }

      const payment = paymentResult.rows[0];

      if (payment.status !== 'completed') {
        throw new Error('Cannot refund incomplete payment');
      }

      // Create refund in Stripe
      const refundAmount = amount ? Math.round(amount * 100) : undefined;
      const refund = await stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id,
        amount: refundAmount,
        reason: reason as Stripe.RefundCreateParams.Reason || 'requested_by_customer',
        metadata: {
          paymentId: payment.id,
          orderId: payment.order_id,
        },
      });

      // Update payment status
      await query(
        `UPDATE payments SET
          status = 'refunded',
          refund_amount = COALESCE(refund_amount, 0) + $2,
          stripe_refund_id = $3,
          refunded_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [paymentId, refund.amount / 100, refund.id]
      );

      // Publish event
      await publishEvent('payment.refunded', {
        paymentId,
        orderId: payment.order_id,
        refundAmount: refund.amount / 100,
        reason,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Refund processed: ${refund.id} for payment ${paymentId}`);

      return {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      };
    } catch (error) {
      logger.error('Process refund error:', error);
      throw error;
    }
  }

  // Create Stripe Connect account for vendor
  async createVendorConnectAccount(vendorId: string, email: string, businessInfo: any) {
    try {
      // Create Stripe Connect account
      const account = await stripe.accounts.create({
        type: 'express',
        country: businessInfo.country || 'US',
        email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'company',
        company: {
          name: businessInfo.businessName,
          tax_id: businessInfo.taxId,
          address: {
            line1: businessInfo.address,
            city: businessInfo.city,
            state: businessInfo.state,
            postal_code: businessInfo.zipCode,
            country: businessInfo.country || 'US',
          },
        },
        metadata: {
          vendorId,
        },
      });

      // Update vendor with Stripe account ID
      await query(
        `UPDATE vendors SET stripe_account_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [vendorId, account.id]
      );

      // Create account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.FRONTEND_URL}/vendor/settings/payments`,
        return_url: `${process.env.FRONTEND_URL}/vendor/settings/payments/success`,
        type: 'account_onboarding',
      });

      logger.info(`Stripe Connect account created for vendor ${vendorId}: ${account.id}`);

      return {
        accountId: account.id,
        onboardingUrl: accountLink.url,
      };
    } catch (error) {
      logger.error('Create Connect account error:', error);
      throw error;
    }
  }

  // Get vendor payout balance
  async getVendorBalance(vendorId: string) {
    try {
      const vendorResult = await query(
        `SELECT stripe_account_id FROM vendors WHERE id = $1`,
        [vendorId]
      );

      if (vendorResult.rows.length === 0 || !vendorResult.rows[0].stripe_account_id) {
        return { available: 0, pending: 0 };
      }

      const balance = await stripe.balance.retrieve({
        stripeAccount: vendorResult.rows[0].stripe_account_id,
      });

      return {
        available: balance.available.reduce((sum, b) => sum + b.amount, 0) / 100,
        pending: balance.pending.reduce((sum, b) => sum + b.amount, 0) / 100,
        currency: STRIPE_CONFIG.currency,
      };
    } catch (error) {
      logger.error('Get vendor balance error:', error);
      throw error;
    }
  }

  // Create instant payout for vendor
  async createInstantPayout(vendorId: string, amount: number) {
    try {
      const vendorResult = await query(
        `SELECT stripe_account_id FROM vendors WHERE id = $1`,
        [vendorId]
      );

      if (vendorResult.rows.length === 0 || !vendorResult.rows[0].stripe_account_id) {
        throw new Error('Vendor Stripe account not found');
      }

      const payout = await stripe.payouts.create(
        {
          amount: Math.round(amount * 100),
          currency: STRIPE_CONFIG.currency,
          method: 'instant',
          metadata: { vendorId },
        },
        {
          stripeAccount: vendorResult.rows[0].stripe_account_id,
        }
      );

      logger.info(`Instant payout created for vendor ${vendorId}: ${payout.id}`);

      return {
        payoutId: payout.id,
        amount: payout.amount / 100,
        status: payout.status,
        arrivalDate: payout.arrival_date,
      };
    } catch (error) {
      logger.error('Create instant payout error:', error);
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(filters: any) {
    const { customerId, vendorId, orderId, status, limit = 50, offset = 0 } = filters;

    let queryText = `SELECT * FROM payments WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (customerId) {
      queryText += ` AND customer_id = $${paramIndex}`;
      params.push(customerId);
      paramIndex++;
    }

    if (vendorId) {
      queryText += ` AND vendor_id = $${paramIndex}`;
      params.push(vendorId);
      paramIndex++;
    }

    if (orderId) {
      queryText += ` AND order_id = $${paramIndex}`;
      params.push(orderId);
      paramIndex++;
    }

    if (status) {
      queryText += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return {
      payments: result.rows,
      count: result.rows.length,
    };
  }

  // Save customer payment method
  async savePaymentMethod(customerId: string, paymentMethodId: string) {
    try {
      // Attach payment method to customer in Stripe
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Save to database
      const result = await query(
        `INSERT INTO customer_payment_methods (customer_id, stripe_payment_method_id, is_default)
         VALUES ($1, $2, true)
         ON CONFLICT (customer_id, stripe_payment_method_id)
         DO UPDATE SET is_default = true, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [customerId, paymentMethodId]
      );

      logger.info(`Payment method saved for customer ${customerId}`);

      return result.rows[0];
    } catch (error) {
      logger.error('Save payment method error:', error);
      throw error;
    }
  }

  // Get customer payment methods
  async getCustomerPaymentMethods(customerId: string) {
    const result = await query(
      `SELECT * FROM customer_payment_methods WHERE customer_id = $1 ORDER BY is_default DESC, created_at DESC`,
      [customerId]
    );

    return result.rows;
  }
}
