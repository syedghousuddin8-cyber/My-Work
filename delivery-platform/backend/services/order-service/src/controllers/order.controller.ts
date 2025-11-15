import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { logger } from '@delivery/shared';

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const orderData = req.body;
      const order = await orderService.createOrder(orderData);
      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      logger.error('Error creating order:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      res.json({ success: true, data: order });
    } catch (error: any) {
      logger.error('Error fetching order:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getUserOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status, category, limit = 20, offset = 0 } = req.query;

      const orders = await orderService.getUserOrders(userId, {
        status: status as string,
        category: category as string,
        limit: Number(limit),
        offset: Number(offset),
      });

      res.json({ success: true, data: orders });
    } catch (error: any) {
      logger.error('Error fetching user orders:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getVendorOrders(req: Request, res: Response) {
    try {
      const { vendorId } = req.params;
      const { status, date } = req.query;

      const orders = await orderService.getVendorOrders(vendorId, {
        status: status as string,
        date: date as string,
      });

      res.json({ success: true, data: orders });
    } catch (error: any) {
      logger.error('Error fetching vendor orders:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getDriverOrders(req: Request, res: Response) {
    try {
      const { driverId } = req.params;
      const orders = await orderService.getDriverOrders(driverId);
      res.json({ success: true, data: orders });
    } catch (error: any) {
      logger.error('Error fetching driver orders:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, metadata } = req.body;

      const order = await orderService.updateOrderStatus(id, status, metadata);
      res.json({ success: true, data: order });
    } catch (error: any) {
      logger.error('Error updating order status:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const order = await orderService.cancelOrder(id, reason);
      res.json({ success: true, data: order });
    } catch (error: any) {
      logger.error('Error cancelling order:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getOrderTracking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tracking = await orderService.getOrderTracking(id);
      res.json({ success: true, data: tracking });
    } catch (error: any) {
      logger.error('Error fetching order tracking:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
