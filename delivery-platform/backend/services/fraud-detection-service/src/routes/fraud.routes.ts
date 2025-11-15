import { Router, Request, Response } from 'express';
import fraudDetector from '../services/fraud-detector.service';
import Joi from 'joi';

const router = Router();

const transactionSchema = Joi.object({
  userId: Joi.string().required(),
  userType: Joi.string().valid('customer', 'vendor', 'driver').required(),
  orderId: Joi.string().optional(),
  amount: Joi.number().min(0).optional(),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  }).optional(),
  ipAddress: Joi.string().optional(),
  deviceId: Joi.string().optional(),
  timestamp: Joi.date().optional(),
});

/**
 * POST /api/v1/fraud/analyze
 * Analyze transaction for fraud
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { error, value } = transactionSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const riskScore = await fraudDetector.analyzeTransaction({
      ...value,
      timestamp: value.timestamp ? new Date(value.timestamp) : new Date(),
    });

    res.json({
      success: true,
      data: riskScore,
    });
  } catch (error: any) {
    console.error('Fraud analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze transaction',
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/fraud/statistics
 * Get fraud statistics
 */
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;

    const statistics = await fraudDetector.getFraudStatistics(days);

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error: any) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
});

/**
 * GET /health
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'fraud-detection-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
