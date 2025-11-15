import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { logger } from '@delivery/shared';
import { AuthRequest } from '../middleware/auth.middleware';

const paymentService = new PaymentService();

export class PaymentController {
  // Create payment intent
  async createPaymentIntent(req: AuthRequest, res: Response) {
    try {
      const { orderId, amount, vendorId } = req.body;

      if (!orderId || !amount || !vendorId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await paymentService.createPaymentIntent(
        orderId,
        req.user!.userId,
        amount,
        vendorId
      );

      res.status(201).json(result);
    } catch (error) {
      logger.error('Create payment intent error:', error);
      res.status(500).json({ error: error.message || 'Failed to create payment intent' });
    }
  }

  // Process refund
  async processRefund(req: AuthRequest, res: Response) {
    try {
      const { paymentId } = req.params;
      const { amount, reason } = req.body;

      const result = await paymentService.processRefund(paymentId, amount, reason);
      res.json(result);
    } catch (error) {
      logger.error('Process refund error:', error);
      res.status(500).json({ error: error.message || 'Failed to process refund' });
    }
  }

  // Create vendor Connect account
  async createConnectAccount(req: AuthRequest, res: Response) {
    try {
      const { vendorId } = req.params;
      const { email, businessInfo } = req.body;

      const result = await paymentService.createVendorConnectAccount(vendorId, email, businessInfo);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Create Connect account error:', error);
      res.status(500).json({ error: error.message || 'Failed to create Connect account' });
    }
  }

  // Get vendor balance
  async getVendorBalance(req: Request, res: Response) {
    try {
      const { vendorId } = req.params;
      const balance = await paymentService.getVendorBalance(vendorId);
      res.json(balance);
    } catch (error) {
      logger.error('Get vendor balance error:', error);
      res.status(500).json({ error: 'Failed to get balance' });
    }
  }

  // Create instant payout
  async createInstantPayout(req: AuthRequest, res: Response) {
    try {
      const { vendorId } = req.params;
      const { amount } = req.body;

      const result = await paymentService.createInstantPayout(vendorId, amount);
      res.json(result);
    } catch (error) {
      logger.error('Create instant payout error:', error);
      res.status(500).json({ error: error.message || 'Failed to create payout' });
    }
  }

  // Get payment history
  async getPaymentHistory(req: AuthRequest, res: Response) {
    try {
      const filters = {
        customerId: req.query.customerId as string,
        vendorId: req.query.vendorId as string,
        orderId: req.query.orderId as string,
        status: req.query.status as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await paymentService.getPaymentHistory(filters);
      res.json(result);
    } catch (error) {
      logger.error('Get payment history error:', error);
      res.status(500).json({ error: 'Failed to get payment history' });
    }
  }

  // Save payment method
  async savePaymentMethod(req: AuthRequest, res: Response) {
    try {
      const { paymentMethodId } = req.body;

      const result = await paymentService.savePaymentMethod(req.user!.userId, paymentMethodId);
      res.json(result);
    } catch (error) {
      logger.error('Save payment method error:', error);
      res.status(500).json({ error: 'Failed to save payment method' });
    }
  }

  // Get customer payment methods
  async getPaymentMethods(req: AuthRequest, res: Response) {
    try {
      const methods = await paymentService.getCustomerPaymentMethods(req.user!.userId);
      res.json(methods);
    } catch (error) {
      logger.error('Get payment methods error:', error);
      res.status(500).json({ error: 'Failed to get payment methods' });
    }
  }
}

export const paymentController = new PaymentController();
