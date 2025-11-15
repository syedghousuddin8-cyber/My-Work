import { Request, Response } from 'express';
import { DriverService } from '../services/driver.service';
import { logger } from '@delivery/shared';
import { AuthRequest } from '../middleware/auth.middleware';

const driverService = new DriverService();

export class DriverController {
  // Register as driver
  async register(req: AuthRequest, res: Response) {
    try {
      const driver = await driverService.createDriver(req.user!.userId, req.body);
      res.status(201).json(driver);
    } catch (error) {
      logger.error('Driver registration error:', error);
      res.status(500).json({ error: 'Failed to register driver' });
    }
  }

  // Get driver profile
  async getDriver(req: Request, res: Response) {
    try {
      const driver = await driverService.getDriver(req.params.driverId);

      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      res.json(driver);
    } catch (error) {
      logger.error('Get driver error:', error);
      res.status(500).json({ error: 'Failed to get driver' });
    }
  }

  // Update driver profile
  async updateDriver(req: AuthRequest, res: Response) {
    try {
      const driver = await driverService.updateDriver(req.params.driverId, req.body);
      res.json(driver);
    } catch (error) {
      logger.error('Update driver error:', error);
      res.status(500).json({ error: 'Failed to update driver' });
    }
  }

  // Toggle online/offline status
  async toggleOnlineStatus(req: AuthRequest, res: Response) {
    try {
      const { isOnline, location } = req.body;

      if (isOnline && !location) {
        return res.status(400).json({ error: 'Location required when going online' });
      }

      const driver = await driverService.toggleOnlineStatus(req.params.driverId, isOnline, location);
      res.json(driver);
    } catch (error) {
      logger.error('Toggle status error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }

  // Find nearby drivers
  async findNearbyDrivers(req: Request, res: Response) {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = req.query.radius ? parseFloat(req.query.radius as string) : 5;
      const vehicleType = req.query.vehicleType as string;

      if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude required' });
      }

      const drivers = await driverService.findNearbyDrivers(
        { latitude: lat, longitude: lng },
        radius,
        vehicleType
      );

      res.json({ drivers, count: drivers.length });
    } catch (error) {
      logger.error('Find nearby drivers error:', error);
      res.status(500).json({ error: 'Failed to find drivers' });
    }
  }

  // Get driver earnings
  async getEarnings(req: AuthRequest, res: Response) {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

      const earnings = await driverService.getDriverEarnings(req.params.driverId, startDate, endDate);
      res.json(earnings);
    } catch (error) {
      logger.error('Get earnings error:', error);
      res.status(500).json({ error: 'Failed to get earnings' });
    }
  }

  // Get driver statistics
  async getStats(req: Request, res: Response) {
    try {
      const stats = await driverService.getDriverStats(req.params.driverId);
      res.json(stats);
    } catch (error) {
      logger.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  }

  // Update driver documents
  async updateDocuments(req: AuthRequest, res: Response) {
    try {
      const driver = await driverService.updateDocuments(req.params.driverId, req.body);
      res.json(driver);
    } catch (error) {
      logger.error('Update documents error:', error);
      res.status(500).json({ error: 'Failed to update documents' });
    }
  }

  // Approve driver (admin only)
  async approveDriver(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { isApproved } = req.body;
      const driver = await driverService.approveDriver(req.params.driverId, isApproved);
      res.json(driver);
    } catch (error) {
      logger.error('Approve driver error:', error);
      res.status(500).json({ error: 'Failed to approve driver' });
    }
  }

  // Record earnings (internal - called by order service)
  async recordEarnings(req: Request, res: Response) {
    try {
      const { orderId, earnings, tip } = req.body;
      await driverService.recordEarnings(req.params.driverId, orderId, earnings, tip);
      res.json({ success: true });
    } catch (error) {
      logger.error('Record earnings error:', error);
      res.status(500).json({ error: 'Failed to record earnings' });
    }
  }
}

export const driverController = new DriverController();
