import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  userId?: mongoose.Types.ObjectId; // If null, it's a broadcast notification
  isRead: boolean;
  isSent: boolean;
  sentAt?: Date;
  readAt?: Date;
  data?: Record<string, any>; // Additional data for the notification
  createdAt: Date;
  updatedAt: Date;
  // Methods
  markAsRead(): void;
  markAsSent(): void;
}

export interface INotificationModel extends mongoose.Model<INotification> {
  getUserNotifications(userId: mongoose.Types.ObjectId, limit?: number, skip?: number): Promise<INotification[]>;
  getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number>;
}

const NotificationSchema = new Schema<INotification>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters'],
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null means broadcast to all users
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: null,
  },
  readAt: {
    type: Date,
    default: null,
  },
  data: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Index for better query performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ isSent: 1 });
NotificationSchema.index({ type: 1 });

// Method to mark as read
NotificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
};

// Method to mark as sent
NotificationSchema.methods.markAsSent = function() {
  this.isSent = true;
  this.sentAt = new Date();
};

// Static method to get user notifications
NotificationSchema.statics.getUserNotifications = function(userId: mongoose.Types.ObjectId, limit = 20, skip = 0) {
  return this.find({
    $or: [
      { userId: userId },
      { userId: null } // Broadcast notifications
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('userId', 'name email');
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = function(userId: mongoose.Types.ObjectId) {
  return this.countDocuments({
    $or: [
      { userId: userId },
      { userId: null } // Broadcast notifications
    ],
    isRead: false
  });
};

export default mongoose.model<INotification, INotificationModel>('Notification', NotificationSchema);
