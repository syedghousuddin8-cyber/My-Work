import Stripe from 'stripe';
import { logger } from '@delivery/shared';

if (!process.env.STRIPE_SECRET_KEY) {
  logger.warn('STRIPE_SECRET_KEY not set, payment processing will not work');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const STRIPE_CONFIG = {
  platformFeePercent: parseFloat(process.env.PLATFORM_FEE_PERCENT || '10'),
  currency: process.env.CURRENCY || 'usd',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};
