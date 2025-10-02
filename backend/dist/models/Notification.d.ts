import mongoose, { Document } from 'mongoose';
export interface INotification extends Document {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    userId?: mongoose.Types.ObjectId;
    isRead: boolean;
    isSent: boolean;
    sentAt?: Date;
    readAt?: Date;
    data?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    markAsRead(): void;
    markAsSent(): void;
}
export interface INotificationModel extends mongoose.Model<INotification> {
    getUserNotifications(userId: mongoose.Types.ObjectId, limit?: number, skip?: number): Promise<INotification[]>;
    getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number>;
}
declare const _default: INotificationModel;
export default _default;
//# sourceMappingURL=Notification.d.ts.map