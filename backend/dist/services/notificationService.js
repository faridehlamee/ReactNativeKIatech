"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBroadcastNotification = exports.sendNotificationToUser = exports.sendPushNotification = void 0;
const sendPushNotification = async (tokens, notification) => {
    try {
        console.log('Sending push notification:', {
            tokens: tokens.length,
            title: notification.title,
            body: notification.body,
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Push notification sent successfully');
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