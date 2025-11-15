import { Router } from 'express';
import { vendorController } from '../controllers/vendor.controller';
import { authenticate, requireVendor } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/search', vendorController.searchVendors.bind(vendorController));
router.get('/menu-items/search', vendorController.searchMenuItems.bind(vendorController));
router.get('/:vendorId', vendorController.getVendor.bind(vendorController));
router.get('/:vendorId/menu', vendorController.getMenu.bind(vendorController));
router.get('/:vendorId/popular-items', vendorController.getPopularItems.bind(vendorController));

// Protected vendor routes
router.post('/', authenticate, vendorController.createVendor.bind(vendorController));
router.put('/:vendorId', authenticate, requireVendor, vendorController.updateVendor.bind(vendorController));
router.post('/:vendorId/online-status', authenticate, requireVendor, vendorController.toggleOnlineStatus.bind(vendorController));
router.get('/:vendorId/analytics', authenticate, requireVendor, vendorController.getAnalytics.bind(vendorController));

// Menu management
router.post('/:vendorId/menu', authenticate, requireVendor, vendorController.createMenuItem.bind(vendorController));
router.put('/:vendorId/menu/:menuItemId', authenticate, requireVendor, vendorController.updateMenuItem.bind(vendorController));
router.post('/:vendorId/menu/:menuItemId/availability', authenticate, requireVendor, vendorController.toggleItemAvailability.bind(vendorController));
router.post('/:vendorId/menu/bulk-availability', authenticate, requireVendor, vendorController.bulkUpdateAvailability.bind(vendorController));
router.delete('/:vendorId/menu/:menuItemId', authenticate, requireVendor, vendorController.deleteMenuItem.bind(vendorController));

// Inventory management
router.get('/:vendorId/menu/:menuItemId/inventory', vendorController.getInventory.bind(vendorController));
router.post('/:vendorId/menu/:menuItemId/inventory', authenticate, requireVendor, vendorController.updateInventory.bind(vendorController));
router.get('/:vendorId/inventory/low-stock', authenticate, requireVendor, vendorController.getLowStockItems.bind(vendorController));
router.get('/:vendorId/inventory/out-of-stock', authenticate, requireVendor, vendorController.getOutOfStockItems.bind(vendorController));
router.post('/:vendorId/inventory/bulk-update', authenticate, requireVendor, vendorController.bulkUpdateInventory.bind(vendorController));

export default router;
