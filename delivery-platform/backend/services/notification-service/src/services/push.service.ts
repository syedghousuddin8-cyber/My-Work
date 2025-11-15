import admin from 'firebase-admin';
import { logger } from '@delivery/shared';

// Initialize Firebase Admin (in production, use service account)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      } as any),
    });
  } catch (error) {
    logger.warn('Firebase initialization skipped (dev mode)');
  }
}

export class PushNotificationService {
  async send(userId: string, notification: { title: string; body: string; data?: any }) {
    try {
      // Get user's FCM token from database (simplified)
      const fcmToken = await this.getUserFCMToken(userId);

      if (!fcmToken) {
        logger.warn(`No FCM token found for user ${userId}`);
        return;
      }

      const message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        token: fcmToken,
      };

      const response = await admin.messaging().send(message);
      logger.info(`Push notification sent: ${response}`);
    } catch (error) {
      logger.error('Push notification error:', error);
    }
  }

  async sendToMultiple(userIds: string[], notification: any) {
    const promises = userIds.map(userId => this.send(userId, notification));
    await Promise.allSettled(promises);
  }

  private async getUserFCMToken(userId: string): Promise<string | null> {
    // In production, fetch from database
    // For now, return null (dev mode)
    return null;
  }
}
