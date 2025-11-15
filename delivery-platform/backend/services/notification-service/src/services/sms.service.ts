import twilio from 'twilio';
import { logger } from '@delivery/shared';

const client = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export class SMSService {
  async send(userId: string, message: string) {
    if (!client) {
      logger.warn('Twilio not configured, SMS not sent');
      return;
    }

    try {
      // Get user phone number from database
      const phoneNumber = await this.getUserPhoneNumber(userId);

      if (!phoneNumber) {
        logger.warn(`No phone number found for user ${userId}`);
        return;
      }

      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      logger.info(`SMS sent: ${result.sid}`);
    } catch (error) {
      logger.error('SMS send error:', error);
    }
  }

  async sendOTP(phoneNumber: string, otp: string) {
    if (!client) {
      logger.warn('Twilio not configured, OTP not sent');
      return;
    }

    const message = `Your verification code is: ${otp}. Valid for 10 minutes.`;

    try {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      logger.info(`OTP sent to ${phoneNumber}`);
    } catch (error) {
      logger.error('OTP send error:', error);
      throw error;
    }
  }

  private async getUserPhoneNumber(userId: string): Promise<string | null> {
    // In production, fetch from database
    return null;
  }
}
