export declare class FirebaseService {
    static sendNotificationToDevice(token: string, title: string, body: string, data?: any): Promise<{
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    }>;
    static sendNotificationToMultipleDevices(tokens: string[], title: string, body: string, data?: any, channelId?: string): Promise<{
        success: boolean;
        successCount: number;
        failureCount: number;
        responses: import("firebase-admin/lib/messaging/messaging-api").SendResponse[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        successCount?: undefined;
        failureCount?: undefined;
        responses?: undefined;
    }>;
    static sendNotificationToAllSubscribers(title: string, body: string, data?: any): Promise<{
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    }>;
    static validateToken(token: string): Promise<boolean>;
}
export default FirebaseService;
//# sourceMappingURL=firebaseService.d.ts.map