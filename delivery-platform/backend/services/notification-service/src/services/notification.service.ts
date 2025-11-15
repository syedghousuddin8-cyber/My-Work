import { logger } from '@delivery/shared';
import { PushNotificationService } from './push.service';
import { SMSService } from './sms.service';
import { EmailService } from './email.service';

export class NotificationService {
  private pushService = new PushNotificationService();
  private smsService = new SMSService();
  private emailService = new EmailService();

  async sendNotification(type: string, userId: string, data: any) {
    logger.info(`Sending ${type} notification to user ${userId}`);

    try {
      // Send push notification
      await this.pushService.send(userId, {
        title: data.title,
        body: data.body,
        data: data.metadata || {}
      });

      // Send SMS for critical notifications
      if (data.critical) {
        await this.smsService.send(userId, data.body);
      }

      // Send email for receipts and confirmations
      if (data.sendEmail) {
        await this.emailService.send(userId, data.subject, data.emailBody || data.body);
      }

      logger.info(`Notification sent successfully to ${userId}`);
    } catch (error) {
      logger.error('Notification send error:', error);
      throw error;
    }
  }

  async sendOrderCreatedNotifications(orderData: any) {
    // Notify customer
    await this.sendNotification('order_created', orderData.customerId, {
      title: 'Order Placed Successfully',
      body: `Your order #${orderData.orderNumber} has been placed`,
      sendEmail: true,
      subject: 'Order Confirmation',
      emailBody: `Thank you for your order! Order #${orderData.orderNumber} - Total: $${orderData.total}`
    });

    // Notify vendor
    await this.sendNotification('new_order', orderData.vendorId, {
      title: 'New Order Received',
      body: `New order #${orderData.orderNumber} - $${orderData.total}`,
      critical: true
    });
  }

  async sendOrderConfirmedNotifications(orderData: any) {
    await this.sendNotification('order_confirmed', orderData.customerId, {
      title: 'Order Confirmed',
      body: `Your order #${orderData.orderNumber} has been confirmed and is being prepared`
    });
  }

  async sendOrderDeliveredNotifications(orderData: any) {
    await this.sendNotification('order_delivered', orderData.customerId, {
      title: 'Order Delivered',
      body: `Your order #${orderData.orderNumber} has been delivered. Enjoy!`,
      sendEmail: true,
      subject: 'Order Delivered'
    });
  }
}
