"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_validator_1 = require("express-validator");
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const notificationService_1 = require("../services/notificationService");
const firebaseService_1 = require("../services/firebaseService");
const router = express_1.default.Router();
router.get('/', auth_1.authenticateToken, [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const userId = req.user?.userId;
        const notifications = await Notification_1.default.getUserNotifications(new mongoose_1.default.Types.ObjectId(userId), limit, skip);
        const total = await Notification_1.default.countDocuments({
            $or: [
                { userId: new mongoose_1.default.Types.ObjectId(userId) },
                { userId: null }
            ]
        });
        const unreadCount = await Notification_1.default.getUnreadCount(new mongoose_1.default.Types.ObjectId(userId));
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
    }
    catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.put('/:id/read', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const notification = await Notification_1.default.findOne({
            _id: id,
            $or: [
                { userId: userId },
                { userId: null }
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
    }
    catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.put('/read-all', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.userId;
        await Notification_1.default.updateMany({
            $or: [
                { userId: userId },
                { userId: null }
            ],
            isRead: false
        }, {
            $set: {
                isRead: true,
                readAt: new Date()
            }
        });
        res.json({
            success: true,
            message: 'All notifications marked as read',
        });
    }
    catch (error) {
        console.error('Mark all notifications as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.post('/register-token', auth_1.authenticateToken, [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Push token is required'),
    (0, express_validator_1.body)('platform').isIn(['ios', 'android', 'web']).withMessage('Platform must be ios, android, or web'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { token, platform } = req.body;
        const userId = req.user?.userId;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        user.addPushToken(token);
        await user.save();
        res.json({
            success: true,
            message: 'Push token registered successfully',
        });
    }
    catch (error) {
        console.error('Register push token error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.delete('/remove-token', auth_1.authenticateToken, [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Push token is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { token } = req.body;
        const userId = req.user?.userId;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        user.removePushToken(token);
        await user.save();
        res.json({
            success: true,
            message: 'Push token removed successfully',
        });
    }
    catch (error) {
        console.error('Remove push token error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.post('/send', auth_1.authenticateToken, (0, auth_1.requireSubscription)('enterprise'), [
    (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
    (0, express_validator_1.body)('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message is required and must be less than 500 characters'),
    (0, express_validator_1.body)('type').isIn(['info', 'warning', 'success', 'error']).withMessage('Type must be info, warning, success, or error'),
    (0, express_validator_1.body)('userId').optional().isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
    (0, express_validator_1.body)('subscriptionType').optional().isIn(['free', 'premium', 'enterprise']).withMessage('Subscription type must be free, premium, or enterprise'),
    (0, express_validator_1.body)('data').optional().isObject().withMessage('Data must be an object'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { title, message, type, userId, subscriptionType, data } = req.body;
        let userQuery = { isActive: true };
        if (userId) {
            userQuery._id = userId;
        }
        else if (subscriptionType) {
            userQuery.subscriptionType = subscriptionType;
        }
        const targetUsers = await User_1.default.find(userQuery);
        if (targetUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found matching the criteria',
            });
        }
        const notifications = await Promise.all(targetUsers.map(async (user) => {
            const notification = new Notification_1.default({
                title,
                message,
                type,
                userId: user._id,
                data: data || {},
            });
            await notification.save();
            return notification;
        }));
        let sentCount = 0;
        let failedCount = 0;
        console.log(`📱 Found ${targetUsers.length} target users`);
        try {
            for (const user of targetUsers) {
                console.log(`👤 User: ${user.email}, Push tokens: ${user.pushTokens ? user.pushTokens.length : 0}`);
                if (user.pushTokens && user.pushTokens.length > 0) {
                    try {
                        console.log(`📤 Sending push notification to ${user.email} with ${user.pushTokens.length} tokens`);
                        const result = await (0, notificationService_1.sendPushNotification)(user.pushTokens, {
                            title,
                            body: message,
                            data: { notificationId: notifications[0]._id.toString(), type, ...data },
                            channelId: type === 'error' ? 'updates' : type === 'warning' ? 'promotions' : 'default'
                        });
                        if (result && result.failureCount === user.pushTokens.length) {
                            console.log(`🧹 All push tokens failed for ${user.email}, cleaning up invalid tokens`);
                            user.pushTokens = [];
                            await user.save();
                            console.log(`🗑️ Cleared invalid push tokens for ${user.email}`);
                        }
                        else if (result && result.failureCount > 0) {
                            console.log(`⚠️ Some push tokens failed for ${user.email}, but keeping valid ones`);
                        }
                        sentCount++;
                        console.log(`✅ Push notification sent to ${user.email}`);
                    }
                    catch (pushError) {
                        console.error(`❌ Push notification failed for user ${user.email}:`, pushError);
                        failedCount++;
                    }
                }
                else {
                    console.log(`⚠️ No push tokens for user ${user.email}`);
                }
            }
            await Promise.all(notifications.map(async (notification) => {
                notification.markAsSent();
                await notification.save();
            }));
        }
        catch (pushError) {
            console.error('Push notification error:', pushError);
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
    }
    catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.post('/send-push/:userId', auth_1.authenticateToken, [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('body').notEmpty().withMessage('Body is required'),
    (0, express_validator_1.body)('data').optional().isObject().withMessage('Data must be an object'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }
        const { userId } = req.params;
        const { title, body, data } = req.body;
        const user = await User_1.default.findById(userId);
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
        const result = await firebaseService_1.FirebaseService.sendNotificationToMultipleDevices(user.pushTokens, title, body, data);
        if (result.success) {
            const notification = new Notification_1.default({
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
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to send push notification',
                error: result.error,
            });
        }
    }
    catch (error) {
        console.error('Send push notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.post('/send-push-all', auth_1.authenticateToken, [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('body').notEmpty().withMessage('Body is required'),
    (0, express_validator_1.body)('data').optional().isObject().withMessage('Data must be an object'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }
        const { title, body, data } = req.body;
        const subscribedUsers = await User_1.default.find({
            isSubscribed: true,
            pushTokens: { $exists: true, $not: { $size: 0 } },
        });
        if (subscribedUsers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No subscribed users with push tokens found',
            });
        }
        const allTokens = subscribedUsers.flatMap(user => user.pushTokens);
        const result = await firebaseService_1.FirebaseService.sendNotificationToMultipleDevices(allTokens, title, body, data);
        if (result.success) {
            const notifications = subscribedUsers.map(user => ({
                title,
                message: body,
                type: 'info',
                userId: user._id,
                isSent: true,
                sentAt: new Date(),
                data: data || {},
            }));
            await Notification_1.default.insertMany(notifications);
            res.json({
                success: true,
                message: 'Push notifications sent to all subscribed users',
                result: {
                    successCount: result.successCount,
                    failureCount: result.failureCount,
                    totalUsers: subscribedUsers.length,
                },
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to send push notifications',
                error: result.error,
            });
        }
    }
    catch (error) {
        console.error('Send push notification to all error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map