import { Router, Request, Response } from 'express';
import pricingService from '../services/pricing.service';
import Joi from 'joi';

const router = Router();

// Validation schema
const estimateSchema = Joi.object({
  vendorId: Joi.string().required(),
  customerId: Joi.string().required(),
  distance: Joi.number().min(0).max(100).required(),
  orderValue: Joi.number().min(0).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  scheduledTime: Joi.date().optional(),
});

/**
 * POST /api/v1/pricing/estimate
 * Get pricing estimate for an order
 */
router.post('/estimate', async (req: Request, res: Response) => {
  try {
    const { error, value } = estimateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const pricing = await pricingService.getEstimate({
      vendorId: value.vendorId,
      customerId: value.customerId,
      distance: value.distance,
      orderValue: value.orderValue,
      latitude: value.latitude,
      longitude: value.longitude,
      scheduledTime: value.scheduledTime ? new Date(value.scheduledTime) : undefined,
    });

    res.json({
      success: true,
      data: pricing,
    });
  } catch (error: any) {
    console.error('Pricing estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate pricing',
      error: error.message,
    });
  }
});

/**
 * POST /api/v1/pricing/calculate
 * Calculate and store pricing for an order
 */
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { error, value } = estimateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    const pricing = await pricingService.calculatePrice({
      vendorId: value.vendorId,
      customerId: value.customerId,
      distance: value.distance,
      orderValue: value.orderValue,
      latitude: value.latitude,
      longitude: value.longitude,
      scheduledTime: value.scheduledTime ? new Date(value.scheduledTime) : undefined,
    });

    // Store pricing in database
    await pricingService.storePricing(orderId, pricing);

    res.json({
      success: true,
      data: pricing,
    });
  } catch (error: any) {
    console.error('Pricing calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate and store pricing',
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/pricing/surge-areas
 * Get current surge pricing areas
 */
router.get('/surge-areas', async (req: Request, res: Response) => {
  try {
    const surgeAreas = await pricingService.getSurgeAreas();

    res.json({
      success: true,
      data: surgeAreas,
    });
  } catch (error: any) {
    console.error('Surge areas error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surge areas',
      error: error.message,
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'pricing-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
