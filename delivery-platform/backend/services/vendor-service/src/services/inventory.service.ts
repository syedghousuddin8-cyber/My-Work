import { query } from '../config/database';
import { redisClient } from '../config/redis';
import { publishEvent } from '../config/kafka';
import { logger } from '@delivery/shared';

export class InventoryService {
  // Update inventory for a menu item
  async updateInventory(menuItemId: string, quantity: number, operation: 'set' | 'increment' | 'decrement' = 'set') {
    const client = await query('BEGIN');

    try {
      // Get current inventory
      const currentResult = await query(
        `SELECT * FROM inventory WHERE menu_item_id = $1 FOR UPDATE`,
        [menuItemId]
      );

      let newQuantity = quantity;

      if (currentResult.rows.length > 0) {
        const current = currentResult.rows[0];

        if (operation === 'increment') {
          newQuantity = current.quantity + quantity;
        } else if (operation === 'decrement') {
          newQuantity = Math.max(0, current.quantity - quantity);
        }

        // Update existing inventory
        await query(
          `UPDATE inventory SET
            quantity = $2,
            last_restocked_at = CASE WHEN $3 = 'increment' THEN CURRENT_TIMESTAMP ELSE last_restocked_at END,
            updated_at = CURRENT_TIMESTAMP
           WHERE menu_item_id = $1`,
          [menuItemId, newQuantity, operation]
        );
      } else {
        // Create new inventory record
        await query(
          `INSERT INTO inventory (menu_item_id, quantity, low_stock_threshold)
           VALUES ($1, $2, 10)`,
          [menuItemId, newQuantity]
        );
      }

      // Get menu item details
      const menuItemResult = await query(
        `SELECT vendor_id, name FROM menu_items WHERE id = $1`,
        [menuItemId]
      );

      if (menuItemResult.rows.length === 0) {
        throw new Error('Menu item not found');
      }

      const { vendor_id, name } = menuItemResult.rows[0];

      // Auto-disable if out of stock
      if (newQuantity === 0) {
        await query(
          `UPDATE menu_items SET is_available = false WHERE id = $1`,
          [menuItemId]
        );

        await publishEvent('inventory.out_of_stock', {
          menuItemId,
          vendorId: vendor_id,
          itemName: name,
          timestamp: new Date().toISOString(),
        });
      }

      // Low stock alert
      const lowStockResult = await query(
        `SELECT low_stock_threshold FROM inventory WHERE menu_item_id = $1`,
        [menuItemId]
      );

      if (lowStockResult.rows.length > 0) {
        const threshold = lowStockResult.rows[0].low_stock_threshold;
        if (newQuantity > 0 && newQuantity <= threshold) {
          await publishEvent('inventory.low_stock', {
            menuItemId,
            vendorId: vendor_id,
            itemName: name,
            quantity: newQuantity,
            threshold,
            timestamp: new Date().toISOString(),
          });
        }
      }

      await query('COMMIT');

      // Update cache
      await redisClient.setEx(
        `inventory:${menuItemId}`,
        300,
        JSON.stringify({ quantity: newQuantity })
      );

      logger.info(`Inventory updated for ${menuItemId}: ${newQuantity}`);

      return { menuItemId, quantity: newQuantity };
    } catch (error) {
      await query('ROLLBACK');
      logger.error('Inventory update error:', error);
      throw error;
    }
  }

  // Get inventory status
  async getInventory(menuItemId: string) {
    // Check cache
    const cached = await redisClient.get(`inventory:${menuItemId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await query(
      `SELECT i.*, mi.name, mi.vendor_id
       FROM inventory i
       JOIN menu_items mi ON i.menu_item_id = mi.id
       WHERE i.menu_item_id = $1`,
      [menuItemId]
    );

    if (result.rows.length === 0) {
      return { quantity: null, unlimitedStock: true };
    }

    const inventory = result.rows[0];

    // Cache for 5 minutes
    await redisClient.setEx(
      `inventory:${menuItemId}`,
      300,
      JSON.stringify(inventory)
    );

    return inventory;
  }

  // Get all low stock items for a vendor
  async getLowStockItems(vendorId: string) {
    const result = await query(
      `SELECT i.*, mi.name, mi.category
       FROM inventory i
       JOIN menu_items mi ON i.menu_item_id = mi.id
       WHERE mi.vendor_id = $1
         AND i.quantity <= i.low_stock_threshold
         AND mi.is_deleted = false
       ORDER BY i.quantity ASC`,
      [vendorId]
    );

    return result.rows;
  }

  // Get all out of stock items for a vendor
  async getOutOfStockItems(vendorId: string) {
    const result = await query(
      `SELECT i.*, mi.name, mi.category
       FROM inventory i
       JOIN menu_items mi ON i.menu_item_id = mi.id
       WHERE mi.vendor_id = $1
         AND i.quantity = 0
         AND mi.is_deleted = false
       ORDER BY i.updated_at DESC`,
      [vendorId]
    );

    return result.rows;
  }

  // Bulk update inventory
  async bulkUpdateInventory(updates: Array<{ menuItemId: string; quantity: number }>) {
    const results = [];

    for (const update of updates) {
      try {
        const result = await this.updateInventory(update.menuItemId, update.quantity, 'set');
        results.push({ success: true, ...result });
      } catch (error) {
        results.push({ success: false, menuItemId: update.menuItemId, error: error.message });
      }
    }

    return results;
  }

  // Set low stock threshold
  async setLowStockThreshold(menuItemId: string, threshold: number) {
    await query(
      `INSERT INTO inventory (menu_item_id, quantity, low_stock_threshold)
       VALUES ($1, 999999, $2)
       ON CONFLICT (menu_item_id)
       DO UPDATE SET low_stock_threshold = $2, updated_at = CURRENT_TIMESTAMP`,
      [menuItemId, threshold]
    );

    // Invalidate cache
    await redisClient.del(`inventory:${menuItemId}`);

    return { menuItemId, threshold };
  }

  // Reserve inventory for order (called when order is placed)
  async reserveInventory(orderItems: Array<{ menuItemId: string; quantity: number }>) {
    const client = await query('BEGIN');

    try {
      const reservations = [];

      for (const item of orderItems) {
        const result = await query(
          `SELECT quantity FROM inventory WHERE menu_item_id = $1 FOR UPDATE`,
          [item.menuItemId]
        );

        if (result.rows.length > 0) {
          const available = result.rows[0].quantity;

          if (available < item.quantity) {
            throw new Error(`Insufficient inventory for item ${item.menuItemId}`);
          }

          // Decrement inventory
          await query(
            `UPDATE inventory SET quantity = quantity - $2 WHERE menu_item_id = $1`,
            [item.menuItemId, item.quantity]
          );

          reservations.push({ menuItemId: item.menuItemId, reserved: item.quantity });

          // Invalidate cache
          await redisClient.del(`inventory:${item.menuItemId}`);
        }
      }

      await query('COMMIT');

      logger.info('Inventory reserved for order', { reservations });

      return reservations;
    } catch (error) {
      await query('ROLLBACK');
      logger.error('Inventory reservation error:', error);
      throw error;
    }
  }

  // Release inventory (called when order is cancelled)
  async releaseInventory(orderItems: Array<{ menuItemId: string; quantity: number }>) {
    for (const item of orderItems) {
      await this.updateInventory(item.menuItemId, item.quantity, 'increment');
    }

    logger.info('Inventory released for cancelled order');
  }
}
