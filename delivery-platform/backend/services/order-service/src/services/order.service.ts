import { query } from '../config/database';
import { publishEvent } from '../config/kafka';
import { redisClient } from '../config/redis';
import { logger, OrderStatus, OrderCategory } from '@delivery/shared';
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  async createOrder(orderData: any) {
    const orderId = uuidv4();
    const orderNumber = this.generateOrderNumber();

    // Calculate totals
    const subtotal = this.calculateSubtotal(orderData.items);
    const deliveryFee = await this.calculateDeliveryFee(orderData);
    const tax = this.calculateTax(subtotal, deliveryFee);
    const total = subtotal + deliveryFee + tax;

    // Insert order
    const result = await query(
      `INSERT INTO orders (
        id, order_number, customer_id, vendor_id, category, status,
        delivery_address_id, delivery_address, items, subtotal,
        delivery_fee, tax, total, special_instructions,
        category_specific_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      RETURNING *`,
      [
        orderId,
        orderNumber,
        orderData.customerId,
        orderData.vendorId,
        orderData.category,
        OrderStatus.PENDING,
        orderData.deliveryAddressId,
        JSON.stringify(orderData.deliveryAddress),
        JSON.stringify(orderData.items),
        subtotal,
        deliveryFee,
        tax,
        total,
        orderData.specialInstructions,
        JSON.stringify(orderData.categorySpecificData || {}),
      ]
    );

    const order = result.rows[0];

    // Publish order created event
    await publishEvent('order.created', {
      orderId: order.id,
      vendorId: order.vendor_id,
      customerId: order.customer_id,
      category: order.category,
      total: order.total,
      timestamp: new Date().toISOString(),
    });

    // Cache order for quick access
    await redisClient.setEx(`order:${orderId}`, 3600, JSON.stringify(order));

    logger.info(`Order created: ${orderNumber}`);
    return order;
  }

  async getOrderById(orderId: string) {
    // Try cache first
    const cached = await redisClient.get(`order:${orderId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = result.rows[0];

    if (order) {
      await redisClient.setEx(`order:${orderId}`, 3600, JSON.stringify(order));
    }

    return order;
  }

  async getUserOrders(userId: string, filters: any) {
    let queryText = 'SELECT * FROM orders WHERE customer_id = $1';
    const params: any[] = [userId];
    let paramCount = 1;

    if (filters.status) {
      paramCount++;
      queryText += ` AND status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters.category) {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      params.push(filters.category);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(filters.limit, filters.offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  async getVendorOrders(vendorId: string, filters: any) {
    let queryText = 'SELECT * FROM orders WHERE vendor_id = $1';
    const params: any[] = [vendorId];
    let paramCount = 1;

    if (filters.status) {
      paramCount++;
      queryText += ` AND status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters.date) {
      paramCount++;
      queryText += ` AND DATE(created_at) = $${paramCount}`;
      params.push(filters.date);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    return result.rows;
  }

  async getDriverOrders(driverId: string) {
    const result = await query(
      `SELECT * FROM orders
       WHERE driver_id = $1
       AND status IN ('picked_up', 'in_transit')
       ORDER BY created_at DESC`,
      [driverId]
    );
    return result.rows;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, metadata?: any) {
    const result = await query(
      `UPDATE orders
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, orderId]
    );

    const order = result.rows[0];

    // Log event
    await query(
      `INSERT INTO order_events (order_id, event_type, description, metadata, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [orderId, `status_changed_to_${status}`, `Order status updated to ${status}`, JSON.stringify(metadata || {})]
    );

    // Publish status update event
    await publishEvent(`order.${status}`, {
      orderId,
      status,
      timestamp: new Date().toISOString(),
      metadata,
    });

    // Update cache
    await redisClient.setEx(`order:${orderId}`, 3600, JSON.stringify(order));

    return order;
  }

  async cancelOrder(orderId: string, reason: string) {
    const result = await query(
      `UPDATE orders
       SET status = $1, cancelled_at = NOW(), updated_at = NOW()
       WHERE id = $2 AND status NOT IN ('delivered', 'cancelled')
       RETURNING *`,
      [OrderStatus.CANCELLED, orderId]
    );

    if (result.rowCount === 0) {
      throw new Error('Order cannot be cancelled');
    }

    const order = result.rows[0];

    // Log cancellation
    await query(
      `INSERT INTO order_events (order_id, event_type, description, metadata, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [orderId, 'order_cancelled', reason, JSON.stringify({ reason })]
    );

    // Publish cancellation event
    await publishEvent('order.cancelled', {
      orderId,
      reason,
      timestamp: new Date().toISOString(),
    });

    return order;
  }

  async getOrderTracking(orderId: string) {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Get order events
    const events = await query(
      'SELECT * FROM order_events WHERE order_id = $1 ORDER BY created_at ASC',
      [orderId]
    );

    // Get driver location if in transit
    let driverLocation = null;
    if (order.driver_id && (order.status === 'picked_up' || order.status === 'in_transit')) {
      const locationData = await redisClient.get(`driver:location:${order.driver_id}`);
      if (locationData) {
        driverLocation = JSON.parse(locationData);
      }
    }

    return {
      order,
      events: events.rows,
      driverLocation,
    };
  }

  private generateOrderNumber(): string {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  private calculateSubtotal(items: any[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  private async calculateDeliveryFee(orderData: any): Promise<number> {
    // Simplified delivery fee calculation
    const baseFee = parseFloat(process.env.DELIVERY_FEE_BASE || '2.99');
    const perKmFee = parseFloat(process.env.DELIVERY_FEE_PER_KM || '0.50');

    // In production, calculate actual distance using geospatial queries
    const estimatedDistance = 5; // km

    return baseFee + (estimatedDistance * perKmFee);
  }

  private calculateTax(subtotal: number, deliveryFee: number): number {
    const taxRate = 0.08; // 8%
    return (subtotal + deliveryFee) * taxRate;
  }
}
