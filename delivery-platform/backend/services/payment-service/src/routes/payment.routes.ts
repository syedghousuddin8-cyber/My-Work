import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Customer payment routes
router.post('/intents', authenticate, paymentController.createPaymentIntent.bind(paymentController));
router.post('/methods', authenticate, paymentController.savePaymentMethod.bind(paymentController));
router.get('/methods', authenticate, paymentController.getPaymentMethods.bind(paymentController));
router.get('/history', authenticate, paymentController.getPaymentHistory.bind(paymentController));

// Vendor payment routes
router.post('/vendors/:vendorId/connect', authenticate, paymentController.createConnectAccount.bind(paymentController));
router.get('/vendors/:vendorId/balance', authenticate, paymentController.getVendorBalance.bind(paymentController));
router.post('/vendors/:vendorId/payouts', authenticate, paymentController.createInstantPayout.bind(paymentController));

// Refund routes
router.post('/refunds/:paymentId', authenticate, paymentController.processRefund.bind(paymentController));

export default router;
