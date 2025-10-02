interface PushNotificationData {
    title: string;
    body: string;
    data?: Record<string, any>;
}
export declare const sendPushNotification: (tokens: string[], notification: PushNotificationData) => Promise<void>;
export declare const sendNotificationToUser: (userId: string, notification: PushNotificationData) => Promise<void>;
export declare const sendBroadcastNotification: (notification: PushNotificationData) => Promise<void>;
export {};
//# sourceMappingURL=notificationService.d.ts.map