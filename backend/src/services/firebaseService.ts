import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK
let serviceAccount;

try {
  // Try to read from environment variable first (for production/Railway)
  if (process.env.FIREBASE_ADMIN_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
    console.log('✅ Firebase Admin SDK initialized from environment variable');
  } else {
    // Fallback to local file (for development only)
    const serviceAccountPath = path.join(__dirname, '../../firebase-admin-key.json');
    serviceAccount = require(serviceAccountPath);
    console.log('✅ Firebase Admin SDK initialized from local file');
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error);
  console.error('Make sure FIREBASE_ADMIN_KEY environment variable is set in production');
}

export class FirebaseService {
  /**
   * Send push notification to a single device
   */
  static async sendNotificationToDevice(token: string, title: string, body: string, data?: any) {
    try {
      const message = {
        token,
        notification: {
          title,
          body,
        },
        data: data || {},
        android: {
          priority: 'high' as const,
          notification: {
            icon: 'ic_notification',
            color: '#2563eb',
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title,
                body,
              },
              badge: 1,
              sound: 'default',
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('✅ Notification sent successfully:', response);
      return { success: true, messageId: response };
    } catch (error: any) {
      console.error('❌ Failed to send notification:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Send push notification to multiple devices
   */
  static async sendNotificationToMultipleDevices(tokens: string[], title: string, body: string, data?: any) {
    try {
      const message = {
        tokens,
        notification: {
          title,
          body,
        },
        data: data || {},
        android: {
          priority: 'high' as const,
          notification: {
            icon: 'ic_notification',
            color: '#2563eb',
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title,
                body,
              },
              badge: 1,
              sound: 'default',
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log('✅ Multicast notification sent:', response);
      return { 
        success: true, 
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses 
      };
    } catch (error: any) {
      console.error('❌ Failed to send multicast notification:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Send notification to all subscribed users
   */
  static async sendNotificationToAllSubscribers(title: string, body: string, data?: any) {
    try {
      // This would typically fetch all user tokens from your database
      // For now, we'll implement a basic version
      const message = {
        topic: 'all_subscribers',
        notification: {
          title,
          body,
        },
        data: data || {},
        android: {
          priority: 'high' as const,
          notification: {
            icon: 'ic_notification',
            color: '#2563eb',
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title,
                body,
              },
              badge: 1,
              sound: 'default',
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('✅ Topic notification sent:', response);
      return { success: true, messageId: response };
    } catch (error: any) {
      console.error('❌ Failed to send topic notification:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Validate FCM token
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      await admin.messaging().send({
        token,
        data: { test: 'true' },
      }, true); // dry run
      return true;
    } catch (error) {
      console.error('❌ Invalid FCM token:', error);
      return false;
    }
  }
}

export default FirebaseService;
