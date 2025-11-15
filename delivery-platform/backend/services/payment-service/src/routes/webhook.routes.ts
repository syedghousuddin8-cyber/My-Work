import { Router } from 'express';
import express from 'express';
import { webhookController } from '../controllers/webhook.controller';

const router = Router();

// Stripe webhook (raw body required for signature verification)
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook.bind(webhookController)
);

export default router;
