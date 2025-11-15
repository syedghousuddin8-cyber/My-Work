import { Router, Request, Response } from 'express';
import routeOptimizer from '../services/route-optimizer.service';
import Joi from 'joi';

const router = Router();

// Validation schemas
const locationSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  address: Joi.string().required(),
  orderId: Joi.string().optional(),
});

const optimizeRouteSchema = Joi.object({
  driverId: Joi.string().required(),
  startLocation: locationSchema.required(),
  deliveryLocations: Joi.array().items(locationSchema).min(1).required(),
});

/**
 * POST /api/v1/routes/optimize
 * Optimize route for multiple deliveries
 */
router.post('/optimize', async (req: Request, res: Response) => {
  try {
    const { error, value } = optimizeRouteSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const optimizedRoute = await routeOptimizer.optimizeRoute(
      value.driverId,
      value.startLocation,
      value.deliveryLocations
    );

    res.json({
      success: true,
      data: optimizedRoute,
    });
  } catch (error: any) {
    console.error('Route optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize route',
      error: error.message,
    });
  }
});

/**
 * POST /api/v1/routes/reroute
 * Reroute based on current location and traffic
 */
router.post('/reroute', async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      currentRoute: Joi.object().required(),
      currentLocation: locationSchema.required(),
      currentStopIndex: Joi.number().min(0).required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const newRoute = await routeOptimizer.rerouteBasedOnTraffic(
      value.currentRoute,
      value.currentLocation,
      value.currentStopIndex
    );

    res.json({
      success: true,
      data: newRoute,
    });
  } catch (error: any) {
    console.error('Reroute error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reroute',
      error: error.message,
    });
  }
});

/**
 * POST /api/v1/routes/batch-optimize
 * Batch optimize routes for multiple drivers
 */
router.post('/batch-optimize', async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      deliveries: Joi.array().items(optimizeRouteSchema).min(1).required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const optimizedRoutes = await routeOptimizer.batchOptimizeRoutes(
      value.deliveries
    );

    res.json({
      success: true,
      data: optimizedRoutes,
    });
  } catch (error: any) {
    console.error('Batch optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to batch optimize routes',
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
    service: 'route-optimization-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
