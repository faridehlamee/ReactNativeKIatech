import { FirebaseService } from './firebaseService';

interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  channelId?: string;
}

export const sendPushNotification = async (
  tokens: string[],
  notification: PushNotificationData
): Promise<{ successCount: number; failureCount: number }> => {
  try {
    console.log('Sending push notification:', {
      tokens: tokens.length,
      title: notification.title,
      body: notification.body,
      channelId: notification.channelId,
    });

    if (tokens.length === 0) {
      console.log('No tokens to send notification to');
      return { successCount: 0, failureCount: 0 };
    }

    // Use Firebase service to send notifications
    const result = await FirebaseService.sendNotificationToMultipleDevices(
      tokens,
      notification.title,
      notification.body,
      notification.data,
      notification.channelId
    );

    if (result.success) {
      console.log(`Push notification sent successfully to ${result.successCount} devices`);
      if (result.failureCount > 0) {
        console.log(`Failed to send to ${result.failureCount} devices`);
      }
      return { successCount: result.successCount, failureCount: result.failureCount };
    } else {
      console.error('Failed to send push notification:', result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

export const sendNotificationToUser = async (
  userId: string,
  notification: PushNotificationData
): Promise<void> => {
  try {
    // In a real implementation, you would:
    // 1. Get user's push tokens from database
    // 2. Send push notification to those tokens
    // 3. Save notification to database
    
    console.log(`Sending notification to user ${userId}:`, notification);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('User notification sent successfully');
  } catch (error) {
    console.error('Error sending user notification:', error);
    throw error;
  }
};

export const sendBroadcastNotification = async (
  notification: PushNotificationData
): Promise<void> => {
  try {
    // In a real implementation, you would:
    // 1. Get all active users' push tokens
    // 2. Send push notification to all tokens
    // 3. Save notification to database for all users
    
    console.log('Sending broadcast notification:', notification);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Broadcast notification sent successfully');
  } catch (error) {
    console.error('Error sending broadcast notification:', error);
    throw error;
  }
};
