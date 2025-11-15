import { Router } from 'express';
import { driverController } from '../controllers/driver.controller';
import { authenticate, requireDriver } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/nearby', driverController.findNearbyDrivers.bind(driverController));
router.get('/:driverId', driverController.getDriver.bind(driverController));
router.get('/:driverId/stats', driverController.getStats.bind(driverController));

// Protected driver routes
router.post('/register', authenticate, driverController.register.bind(driverController));
router.put('/:driverId', authenticate, requireDriver, driverController.updateDriver.bind(driverController));
router.post('/:driverId/online-status', authenticate, requireDriver, driverController.toggleOnlineStatus.bind(driverController));
router.get('/:driverId/earnings', authenticate, requireDriver, driverController.getEarnings.bind(driverController));
router.put('/:driverId/documents', authenticate, requireDriver, driverController.updateDocuments.bind(driverController));

// Admin routes
router.post('/:driverId/approve', authenticate, driverController.approveDriver.bind(driverController));

// Internal routes (service-to-service)
router.post('/:driverId/earnings', driverController.recordEarnings.bind(driverController));

export default router;
