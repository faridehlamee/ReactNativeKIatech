import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult, query } from 'express-validator';
import Notification from '../models/Notification';
import User from '../models/User';
import { authenticateToken, requireSubscription } from '../middleware/auth';
import { sendPushNotification } from '../services/notificationService';
import { FirebaseService } from '../services/firebaseService';

interface AuthRequest extends express.Request {
  user?: {
    userId: string;
    email: string;
  };
}

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], async (req: AuthRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const userId = req.user?.userId;

    const notifications = await Notification.getUserNotifications(new mongoose.Types.ObjectId(userId), limit, skip);
    const total = await Notification.countDocuments({
      $or: [
        { userId: new mongoose.Types.ObjectId(userId) },
        { userId: null } // Broadcast notifications
      ]
    });
    const unreadCount = await Notification.getUnreadCount(new mongoose.Types.ObjectId(userId));

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const notification = await Notification.findOne({
      _id: id,
      $or: [
        { userId: userId },
        { userId: null } // Broadcast notifications
      ]
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.markAsRead();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.userId;

    await Notification.updateMany(
      {
        $or: [
          { userId: userId },
          { userId: null } // Broadcast notifications
        ],
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Register push token
router.post('/register-token', authenticateToken, [
  body('token').notEmpty().withMessage('Push token is required'),
  body('platform').isIn(['ios', 'android', 'web']).withMessage('Platform must be ios, android, or web'),
], async (req: AuthRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { token, platform } = req.body;
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Add token if not already present
    user.addPushToken(token);
    await user.save();

    res.json({
      success: true,
      message: 'Push token registered successfully',
    });
  } catch (error) {
    console.error('Register push token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Remove push token
router.delete('/remove-token', authenticateToken, [
  body('token').notEmpty().withMessage('Push token is required'),
], async (req: AuthRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { token } = req.body;
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove token
    user.removePushToken(token);
    await user.save();

    res.json({
      success: true,
      message: 'Push token removed successfully',
    });
  } catch (error) {
    console.error('Remove push token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Send notification (Admin only - requires enterprise subscription)
router.post('/send', authenticateToken, requireSubscription('enterprise'), [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message is required and must be less than 500 characters'),
  body('type').isIn(['info', 'warning', 'success', 'error']).withMessage('Type must be info, warning, success, or error'),
  body('userId').optional().isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
  body('subscriptionType').optional().isIn(['free', 'premium', 'enterprise']).withMessage('Subscription type must be free, premium, or enterprise'),
  body('data').optional().isObject().withMessage('Data must be an object'),
], async (req: AuthRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, message, type, userId, subscriptionType, data } = req.body;

    // Build user query based on parameters
    let userQuery: any = { isActive: true };
    
    if (userId) {
      // Send to specific user
      userQuery._id = userId;
    } else if (subscriptionType) {
      // Send to users with specific subscription type
      userQuery.subscriptionType = subscriptionType;
    }

    // Find target users
    const targetUsers = await User.find(userQuery);
    
    if (targetUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found matching the criteria',
      });
    }

    // Create notifications for each target user
    const notifications = await Promise.all(
      targetUsers.map(async (user) => {
        const notification = new Notification({
          title,
          message,
          type,
          userId: user._id,
          data: data || {},
        });
        await notification.save();
        return notification;
      })
    );

    // Send push notifications
    let sentCount = 0;
    let failedCount = 0;
    
    try {
      for (const user of targetUsers) {
        if (user.pushTokens && user.pushTokens.length > 0) {
          try {
            await sendPushNotification(user.pushTokens, {
              title,
              body: message,
              data: { notificationId: notifications[0]._id.toString(), type, ...data },
              channelId: type === 'error' ? 'updates' : type === 'warning' ? 'promotions' : 'default'
            });
            sentCount++;
          } catch (pushError) {
            console.error(`Push notification failed for user ${user.email}:`, pushError);
            failedCount++;
          }
        }
      }

      // Mark notifications as sent
      await Promise.all(
        notifications.map(async (notification) => {
          notification.markAsSent();
          await notification.save();
        })
      );
    } catch (pushError) {
      console.error('Push notification error:', pushError);
      // Don't fail the request if push notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: {
        notifications: notifications.length,
        targetUsers: targetUsers.length,
        pushNotificationsSent: sentCount,
        pushNotificationsFailed: failedCount,
        usersWithoutTokens: targetUsers.length - sentCount - failedCount,
        details: {
          title,
          message,
          type,
          subscriptionType: subscriptionType || 'all',
        }
      },
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Send push notification to specific user
router.post('/send-push/:userId', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
  body('data').optional().isObject().withMessage('Data must be an object'),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { userId } = req.params;
    const { title, body, data } = req.body;

    // Find user and get their FCM tokens
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.pushTokens || user.pushTokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User has no push tokens registered',
      });
    }

    // Send push notification using Firebase
    const result = await FirebaseService.sendNotificationToMultipleDevices(
      user.pushTokens,
      title,
      body,
      data
    );

    if (result.success) {
      // Create notification record in database
      const notification = new Notification({
        title,
        message: body,
        type: 'info',
        userId: user._id,
        isSent: true,
        sentAt: new Date(),
        data: data || {},
      });

      await notification.save();

      res.json({
        success: true,
        message: 'Push notification sent successfully',
        result: {
          successCount: result.successCount,
          failureCount: result.failureCount,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send push notification',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Send push notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Send push notification to all subscribed users
router.post('/send-push-all', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
  body('data').optional().isObject().withMessage('Data must be an object'),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { title, body, data } = req.body;

    // Get all subscribed users with push tokens
    const subscribedUsers = await User.find({
      isSubscribed: true,
      pushTokens: { $exists: true, $not: { $size: 0 } },
    });

    if (subscribedUsers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No subscribed users with push tokens found',
      });
    }

    // Collect all push tokens
    const allTokens = subscribedUsers.flatMap(user => user.pushTokens);

    // Send push notification to all tokens
    const result = await FirebaseService.sendNotificationToMultipleDevices(
      allTokens,
      title,
      body,
      data
    );

    if (result.success) {
      // Create notification records for all users
      const notifications = subscribedUsers.map(user => ({
        title,
        message: body,
        type: 'info',
        userId: user._id,
        isSent: true,
        sentAt: new Date(),
        data: data || {},
      }));

      await Notification.insertMany(notifications);

      res.json({
        success: true,
        message: 'Push notifications sent to all subscribed users',
        result: {
          successCount: result.successCount,
          failureCount: result.failureCount,
          totalUsers: subscribedUsers.length,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send push notifications',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Send push notification to all error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
