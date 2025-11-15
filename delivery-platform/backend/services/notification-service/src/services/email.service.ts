import sgMail from '@sendgrid/mail';
import { logger } from '@delivery/shared';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export class EmailService {
  async send(userId: string, subject: string, html: string) {
    try {
      // Get user email from database
      const email = await this.getUserEmail(userId);

      if (!email) {
        logger.warn(`No email found for user ${userId}`);
        return;
      }

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@delivery.com',
        subject,
        html,
      };

      await sgMail.send(msg);
      logger.info(`Email sent to ${email}`);
    } catch (error) {
      logger.error('Email send error:', error);
    }
  }

  async sendOrderConfirmation(userId: string, orderData: any) {
    const html = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <p>Order Number: <strong>${orderData.orderNumber}</strong></p>
      <p>Total: <strong>$${orderData.total}</strong></p>
      <p>Estimated delivery: ${orderData.estimatedDeliveryTime}</p>
    `;

    await this.send(userId, 'Order Confirmation', html);
  }

  async sendReceipt(userId: string, orderData: any) {
    const html = `
      <h1>Receipt</h1>
      <p>Order #${orderData.orderNumber}</p>
      <p>Subtotal: $${orderData.subtotal}</p>
      <p>Delivery Fee: $${orderData.deliveryFee}</p>
      <p>Tax: $${orderData.tax}</p>
      <h3>Total: $${orderData.total}</h3>
    `;

    await this.send(userId, 'Your Receipt', html);
  }

  private async getUserEmail(userId: string): Promise<string | null> {
    // In production, fetch from database
    return null;
  }
}
