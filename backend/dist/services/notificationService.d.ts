interface PushNotificationData {
    title: string;
    body: string;
    data?: Record<string, any>;
    channelId?: string;
}
export declare const sendPushNotification: (tokens: string[], notification: PushNotificationData) => Promise<void>;
export declare const sendNotificationToUser: (userId: string, notification: PushNotificationData) => Promise<void>;
export declare const sendBroadcastNotification: (notification: PushNotificationData) => Promise<void>;
export {};
//# sourceMappingURL=notificationService.d.ts.map