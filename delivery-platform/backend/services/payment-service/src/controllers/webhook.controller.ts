import { Request, Response } from 'express';
import { stripe, STRIPE_CONFIG } from '../config/stripe';
import { PaymentService } from '../services/payment.service';
import { logger } from '@delivery/shared';
import Stripe from 'stripe';

const paymentService = new PaymentService();

export class WebhookController {
  async handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('No signature');
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_CONFIG.webhookSecret
      );
    } catch (err: any) {
      logger.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await paymentService.confirmPayment(paymentIntent.id);
          logger.info(`PaymentIntent succeeded: ${paymentIntent.id}`);
          break;

        case 'payment_intent.payment_failed':
          const failedIntent = event.data.object as Stripe.PaymentIntent;
          logger.error(`PaymentIntent failed: ${failedIntent.id}`, failedIntent.last_payment_error);
          break;

        case 'charge.refunded':
          const refund = event.data.object as Stripe.Charge;
          logger.info(`Charge refunded: ${refund.id}`);
          break;

        case 'account.updated':
          const account = event.data.object as Stripe.Account;
          logger.info(`Account updated: ${account.id}`, {
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
          });
          break;

        case 'payout.paid':
          const payout = event.data.object as Stripe.Payout;
          logger.info(`Payout paid: ${payout.id}`, {
            amount: payout.amount / 100,
            arrivalDate: payout.arrival_date,
          });
          break;

        case 'payout.failed':
          const failedPayout = event.data.object as Stripe.Payout;
          logger.error(`Payout failed: ${failedPayout.id}`, failedPayout.failure_message);
          break;

        default:
          logger.debug(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      logger.error('Webhook handler error:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  }
}

export const webhookController = new WebhookController();
