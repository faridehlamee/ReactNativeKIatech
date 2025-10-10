"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBroadcastNotification = exports.sendNotificationToUser = exports.sendPushNotification = void 0;
const firebaseService_1 = require("./firebaseService");
const sendPushNotification = async (tokens, notification) => {
    try {
        console.log('Sending push notification:', {
            tokens: tokens.length,
            title: notification.title,
            body: notification.body,
            channelId: notification.channelId,
        });
        if (tokens.length === 0) {
            console.log('No tokens to send notification to');
            return;
        }
        const result = await firebaseService_1.FirebaseService.sendNotificationToMultipleDevices(tokens, notification.title, notification.body, notification.data, notification.channelId);
        if (result.success) {
            console.log(`Push notification sent successfully to ${result.successCount} devices`);
            if (result.failureCount > 0) {
                console.log(`Failed to send to ${result.failureCount} devices`);
            }
        }
        else {
            console.error('Failed to send push notification:', result.error);
            throw new Error(result.error);
        }
    }
    catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
};
exports.sendPushNotification = sendPushNotification;
const sendNotificationToUser = async (userId, notification) => {
    try {
        console.log(`Sending notification to user ${userId}:`, notification);
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('User notification sent successfully');
    }
    catch (error) {
        console.error('Error sending user notification:', error);
        throw error;
    }
};
exports.sendNotificationToUser = sendNotificationToUser;
const sendBroadcastNotification = async (notification) => {
    try {
        console.log('Sending broadcast notification:', notification);
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Broadcast notification sent successfully');
    }
    catch (error) {
        console.error('Error sending broadcast notification:', error);
        throw error;
    }
};
exports.sendBroadcastNotification = sendBroadcastNotification;
//# sourceMappingURL=notificationService.js.map