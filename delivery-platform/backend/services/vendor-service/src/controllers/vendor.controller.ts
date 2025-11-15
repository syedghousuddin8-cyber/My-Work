import { Request, Response } from 'express';
import { VendorService } from '../services/vendor.service';
import { MenuService } from '../services/menu.service';
import { InventoryService } from '../services/inventory.service';
import { logger } from '@delivery/shared';
import { AuthRequest } from '../middleware/auth.middleware';

const vendorService = new VendorService();
const menuService = new MenuService();
const inventoryService = new InventoryService();

export class VendorController {
  // Create vendor profile
  async createVendor(req: AuthRequest, res: Response) {
    try {
      const vendor = await vendorService.createVendor(req.user!.userId, req.body);
      res.status(201).json(vendor);
    } catch (error) {
      logger.error('Create vendor error:', error);
      res.status(500).json({ error: 'Failed to create vendor' });
    }
  }

  // Get vendor profile
  async getVendor(req: Request, res: Response) {
    try {
      const vendor = await vendorService.getVendor(req.params.vendorId);

      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      res.json(vendor);
    } catch (error) {
      logger.error('Get vendor error:', error);
      res.status(500).json({ error: 'Failed to get vendor' });
    }
  }

  // Update vendor profile
  async updateVendor(req: AuthRequest, res: Response) {
    try {
      const vendor = await vendorService.updateVendor(req.params.vendorId, req.body);
      res.json(vendor);
    } catch (error) {
      logger.error('Update vendor error:', error);
      res.status(500).json({ error: 'Failed to update vendor' });
    }
  }

  // Toggle online/offline status
  async toggleOnlineStatus(req: AuthRequest, res: Response) {
    try {
      const { isOnline } = req.body;
      const vendor = await vendorService.toggleOnlineStatus(req.params.vendorId, isOnline);
      res.json(vendor);
    } catch (error) {
      logger.error('Toggle status error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }

  // Search vendors
  async searchVendors(req: Request, res: Response) {
    try {
      const filters = {
        query: req.query.q as string,
        category: req.query.category as string,
        cuisines: req.query.cuisines ? (req.query.cuisines as string).split(',') : undefined,
        priceRange: req.query.priceRange as string,
        rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
        location: req.query.lat && req.query.lng ? {
          lat: parseFloat(req.query.lat as string),
          lng: parseFloat(req.query.lng as string),
        } : undefined,
        radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await vendorService.searchVendors(filters);
      res.json(result);
    } catch (error) {
      logger.error('Search vendors error:', error);
      res.status(500).json({ error: 'Failed to search vendors' });
    }
  }

  // Get vendor analytics
  async getAnalytics(req: AuthRequest, res: Response) {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

      const analytics = await vendorService.getVendorAnalytics(req.params.vendorId, startDate, endDate);
      res.json(analytics);
    } catch (error) {
      logger.error('Get analytics error:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  }

  // Create menu item
  async createMenuItem(req: AuthRequest, res: Response) {
    try {
      const menuItem = await menuService.createMenuItem(req.params.vendorId, req.body);
      res.status(201).json(menuItem);
    } catch (error) {
      logger.error('Create menu item error:', error);
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  }

  // Get vendor menu
  async getMenu(req: Request, res: Response) {
    try {
      const filters = {
        category: req.query.category as string,
        isAvailable: req.query.isAvailable === 'true',
        isVegetarian: req.query.isVegetarian === 'true',
        isVegan: req.query.isVegan === 'true',
      };

      const menu = await menuService.getVendorMenu(req.params.vendorId, filters);
      res.json(menu);
    } catch (error) {
      logger.error('Get menu error:', error);
      res.status(500).json({ error: 'Failed to get menu' });
    }
  }

  // Update menu item
  async updateMenuItem(req: AuthRequest, res: Response) {
    try {
      const menuItem = await menuService.updateMenuItem(req.params.menuItemId, req.body);
      res.json(menuItem);
    } catch (error) {
      logger.error('Update menu item error:', error);
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  }

  // Toggle menu item availability
  async toggleItemAvailability(req: AuthRequest, res: Response) {
    try {
      const { isAvailable } = req.body;
      const menuItem = await menuService.toggleAvailability(req.params.menuItemId, isAvailable);
      res.json(menuItem);
    } catch (error) {
      logger.error('Toggle availability error:', error);
      res.status(500).json({ error: 'Failed to toggle availability' });
    }
  }

  // Bulk update menu item availability
  async bulkUpdateAvailability(req: AuthRequest, res: Response) {
    try {
      const { menuItemIds, isAvailable } = req.body;
      const result = await menuService.bulkUpdateAvailability(req.params.vendorId, menuItemIds, isAvailable);
      res.json(result);
    } catch (error) {
      logger.error('Bulk update error:', error);
      res.status(500).json({ error: 'Failed to bulk update' });
    }
  }

  // Delete menu item
  async deleteMenuItem(req: AuthRequest, res: Response) {
    try {
      const result = await menuService.deleteMenuItem(req.params.menuItemId);
      res.json(result);
    } catch (error) {
      logger.error('Delete menu item error:', error);
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  }

  // Search menu items
  async searchMenuItems(req: Request, res: Response) {
    try {
      const searchQuery = req.query.q as string;
      const filters = {
        category: req.query.category as string,
        isVegetarian: req.query.isVegetarian === 'true',
        isVegan: req.query.isVegan === 'true',
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      };

      const result = await menuService.searchMenuItems(searchQuery, filters);
      res.json(result);
    } catch (error) {
      logger.error('Search menu items error:', error);
      res.status(500).json({ error: 'Failed to search menu items' });
    }
  }

  // Get popular items
  async getPopularItems(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const items = await menuService.getPopularItems(req.params.vendorId, limit);
      res.json(items);
    } catch (error) {
      logger.error('Get popular items error:', error);
      res.status(500).json({ error: 'Failed to get popular items' });
    }
  }

  // Update inventory
  async updateInventory(req: AuthRequest, res: Response) {
    try {
      const { quantity, operation } = req.body;
      const result = await inventoryService.updateInventory(req.params.menuItemId, quantity, operation);
      res.json(result);
    } catch (error) {
      logger.error('Update inventory error:', error);
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  }

  // Get inventory status
  async getInventory(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.getInventory(req.params.menuItemId);
      res.json(inventory);
    } catch (error) {
      logger.error('Get inventory error:', error);
      res.status(500).json({ error: 'Failed to get inventory' });
    }
  }

  // Get low stock items
  async getLowStockItems(req: AuthRequest, res: Response) {
    try {
      const items = await inventoryService.getLowStockItems(req.params.vendorId);
      res.json(items);
    } catch (error) {
      logger.error('Get low stock items error:', error);
      res.status(500).json({ error: 'Failed to get low stock items' });
    }
  }

  // Get out of stock items
  async getOutOfStockItems(req: AuthRequest, res: Response) {
    try {
      const items = await inventoryService.getOutOfStockItems(req.params.vendorId);
      res.json(items);
    } catch (error) {
      logger.error('Get out of stock items error:', error);
      res.status(500).json({ error: 'Failed to get out of stock items' });
    }
  }

  // Bulk update inventory
  async bulkUpdateInventory(req: AuthRequest, res: Response) {
    try {
      const { updates } = req.body;
      const results = await inventoryService.bulkUpdateInventory(updates);
      res.json(results);
    } catch (error) {
      logger.error('Bulk update inventory error:', error);
      res.status(500).json({ error: 'Failed to bulk update inventory' });
    }
  }
}

export const vendorController = new VendorController();
