import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateOrder } from '../middleware/validation.middleware';

const router = Router();
const orderController = new OrderController();

// All routes require authentication
router.use(authenticate);

// Create order
router.post('/', validateOrder, orderController.createOrder);

// Get order by ID
router.get('/:id', orderController.getOrder);

// Get user's orders
router.get('/user/:userId', orderController.getUserOrders);

// Get vendor's orders
router.get('/vendor/:vendorId', orderController.getVendorOrders);

// Get driver's orders
router.get('/driver/:driverId', orderController.getDriverOrders);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Cancel order
router.post('/:id/cancel', orderController.cancelOrder);

// Get order tracking
router.get('/:id/tracking', orderController.getOrderTracking);

export default router;
