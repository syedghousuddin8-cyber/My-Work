import { query } from '../config/database';
import { redisClient } from '../config/redis';
import { publishEvent } from '../config/kafka';
import { esClient } from '../config/elasticsearch';
import { logger } from '@delivery/shared';

export class MenuService {
  // Create menu item
  async createMenuItem(vendorId: string, itemData: any) {
    const result = await query(
      `INSERT INTO menu_items (
        vendor_id, name, description, category, subcategory,
        price, compare_at_price, cost_price, image_urls,
        is_available, preparation_time, tags, allergens,
        is_vegetarian, is_vegan, is_gluten_free,
        spice_level, calories, protein, carbs, fat,
        customization_options, addon_groups
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *`,
      [
        vendorId,
        itemData.name,
        itemData.description,
        itemData.category,
        itemData.subcategory,
        itemData.price,
        itemData.compareAtPrice,
        itemData.costPrice,
        itemData.imageUrls || [],
        itemData.isAvailable !== false,
        itemData.preparationTime || 15,
        itemData.tags || [],
        itemData.allergens || [],
        itemData.isVegetarian || false,
        itemData.isVegan || false,
        itemData.isGlutenFree || false,
        itemData.spiceLevel || 'mild',
        itemData.calories,
        itemData.protein,
        itemData.carbs,
        itemData.fat,
        itemData.customizationOptions || [],
        itemData.addonGroups || [],
      ]
    );

    const menuItem = result.rows[0];

    // Index in Elasticsearch
    await this.indexMenuItem(menuItem);

    // Invalidate vendor menu cache
    await redisClient.del(`vendor:${vendorId}:menu`);

    // Publish event
    await publishEvent('menu_item.created', {
      vendorId,
      menuItemId: menuItem.id,
      name: menuItem.name,
      category: menuItem.category,
      timestamp: new Date().toISOString(),
    });

    logger.info(`Menu item created: ${menuItem.id}`);
    return menuItem;
  }

  // Get vendor menu
  async getVendorMenu(vendorId: string, filters?: any) {
    const cacheKey = `vendor:${vendorId}:menu:${JSON.stringify(filters || {})}`;

    // Check cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    let queryText = `
      SELECT * FROM menu_items
      WHERE vendor_id = $1 AND is_deleted = false
    `;
    const params: any[] = [vendorId];
    let paramIndex = 2;

    if (filters?.category) {
      queryText += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters?.isAvailable !== undefined) {
      queryText += ` AND is_available = $${paramIndex}`;
      params.push(filters.isAvailable);
      paramIndex++;
    }

    if (filters?.isVegetarian) {
      queryText += ` AND is_vegetarian = true`;
    }

    if (filters?.isVegan) {
      queryText += ` AND is_vegan = true`;
    }

    queryText += ` ORDER BY sort_order ASC, created_at DESC`;

    const result = await query(queryText, params);

    // Group by category
    const menuByCategory = result.rows.reduce((acc: any, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    const menu = {
      vendorId,
      categories: Object.keys(menuByCategory).map(cat => ({
        name: cat,
        items: menuByCategory[cat],
      })),
      totalItems: result.rows.length,
    };

    // Cache for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(menu));

    return menu;
  }

  // Update menu item
  async updateMenuItem(menuItemId: string, updates: any) {
    const result = await query(
      `UPDATE menu_items SET
        name = COALESCE($2, name),
        description = COALESCE($3, description),
        category = COALESCE($4, category),
        subcategory = COALESCE($5, subcategory),
        price = COALESCE($6, price),
        compare_at_price = COALESCE($7, compare_at_price),
        image_urls = COALESCE($8, image_urls),
        is_available = COALESCE($9, is_available),
        preparation_time = COALESCE($10, preparation_time),
        tags = COALESCE($11, tags),
        allergens = COALESCE($12, allergens),
        customization_options = COALESCE($13, customization_options),
        addon_groups = COALESCE($14, addon_groups),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING *`,
      [
        menuItemId,
        updates.name,
        updates.description,
        updates.category,
        updates.subcategory,
        updates.price,
        updates.compareAtPrice,
        updates.imageUrls,
        updates.isAvailable,
        updates.preparationTime,
        updates.tags,
        updates.allergens,
        updates.customizationOptions,
        updates.addonGroups,
      ]
    );

    if (result.rows.length === 0) {
      throw new Error('Menu item not found');
    }

    const menuItem = result.rows[0];

    // Update Elasticsearch
    await this.indexMenuItem(menuItem);

    // Invalidate cache
    await redisClient.del(`vendor:${menuItem.vendor_id}:menu`);

    // Publish event
    await publishEvent('menu_item.updated', {
      menuItemId,
      vendorId: menuItem.vendor_id,
      updates,
      timestamp: new Date().toISOString(),
    });

    return menuItem;
  }

  // Toggle item availability
  async toggleAvailability(menuItemId: string, isAvailable: boolean) {
    const result = await query(
      `UPDATE menu_items SET is_available = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [menuItemId, isAvailable]
    );

    if (result.rows.length === 0) {
      throw new Error('Menu item not found');
    }

    const menuItem = result.rows[0];

    // Update ES and cache
    await this.indexMenuItem(menuItem);
    await redisClient.del(`vendor:${menuItem.vendor_id}:menu`);

    return menuItem;
  }

  // Bulk update availability
  async bulkUpdateAvailability(vendorId: string, menuItemIds: string[], isAvailable: boolean) {
    await query(
      `UPDATE menu_items
       SET is_available = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ANY($2) AND vendor_id = $3`,
      [isAvailable, menuItemIds, vendorId]
    );

    // Invalidate cache
    await redisClient.del(`vendor:${vendorId}:menu`);

    // Publish event
    await publishEvent('menu_items.bulk_updated', {
      vendorId,
      menuItemIds,
      isAvailable,
      timestamp: new Date().toISOString(),
    });

    return { updated: menuItemIds.length };
  }

  // Delete menu item (soft delete)
  async deleteMenuItem(menuItemId: string) {
    const result = await query(
      `UPDATE menu_items
       SET is_deleted = true, is_available = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING vendor_id`,
      [menuItemId]
    );

    if (result.rows.length === 0) {
      throw new Error('Menu item not found');
    }

    const vendorId = result.rows[0].vendor_id;

    // Remove from Elasticsearch
    await esClient.delete({
      index: 'menu_items',
      id: menuItemId,
    }).catch(err => logger.warn('ES delete error:', err));

    // Invalidate cache
    await redisClient.del(`vendor:${vendorId}:menu`);

    return { deleted: true };
  }

  // Search menu items across vendors
  async searchMenuItems(searchQuery: string, filters?: any) {
    const must: any[] = [
      { term: { isAvailable: true } },
      {
        multi_match: {
          query: searchQuery,
          fields: ['name^3', 'description', 'tags'],
          fuzziness: 'AUTO',
        },
      },
    ];

    if (filters?.category) {
      must.push({ term: { category: filters.category } });
    }

    if (filters?.isVegetarian) {
      must.push({ term: { isVegetarian: true } });
    }

    if (filters?.isVegan) {
      must.push({ term: { isVegan: true } });
    }

    if (filters?.maxPrice) {
      must.push({ range: { price: { lte: filters.maxPrice } } });
    }

    const result = await esClient.search({
      index: 'menu_items',
      body: {
        query: { bool: { must } },
        sort: [
          { orderCount: { order: 'desc' } },
          { rating: { order: 'desc' } },
        ],
        size: filters?.limit || 50,
      },
    });

    return {
      total: result.hits.total,
      items: result.hits.hits.map((hit: any) => hit._source),
    };
  }

  // Get popular items for a vendor
  async getPopularItems(vendorId: string, limit: number = 10) {
    const result = await query(
      `SELECT mi.*, COUNT(oi.id) as order_count
       FROM menu_items mi
       LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
       WHERE mi.vendor_id = $1 AND mi.is_available = true AND mi.is_deleted = false
       GROUP BY mi.id
       ORDER BY order_count DESC, mi.average_rating DESC
       LIMIT $2`,
      [vendorId, limit]
    );

    return result.rows;
  }

  // Index menu item in Elasticsearch
  private async indexMenuItem(menuItem: any) {
    try {
      await esClient.index({
        index: 'menu_items',
        id: menuItem.id,
        document: {
          id: menuItem.id,
          vendorId: menuItem.vendor_id,
          name: menuItem.name,
          description: menuItem.description,
          category: menuItem.category,
          subcategory: menuItem.subcategory,
          price: parseFloat(menuItem.price),
          tags: menuItem.tags || [],
          isAvailable: menuItem.is_available,
          isVegetarian: menuItem.is_vegetarian,
          isVegan: menuItem.is_vegan,
          allergens: menuItem.allergens || [],
          rating: parseFloat(menuItem.average_rating) || 0,
          orderCount: parseInt(menuItem.total_orders) || 0,
        },
      });

      logger.debug(`Menu item indexed in Elasticsearch: ${menuItem.id}`);
    } catch (error) {
      logger.error('Elasticsearch indexing error:', error);
    }
  }
}
