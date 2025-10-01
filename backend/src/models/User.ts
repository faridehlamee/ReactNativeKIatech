import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isSubscribed: boolean;
  subscriptionType: 'free' | 'premium' | 'enterprise';
  subscriptionExpiry?: Date;
  pushTokens: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Methods
  isSubscriptionActive(): boolean;
  addPushToken(token: string): void;
  removePushToken(token: string): void;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free',
  },
  subscriptionExpiry: {
    type: Date,
    default: null,
  },
  pushTokens: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ isSubscribed: 1 });
UserSchema.index({ subscriptionType: 1 });

// Virtual for subscription status
UserSchema.virtual('subscriptionStatus').get(function() {
  if (!this.isSubscribed) return 'inactive';
  if (this.subscriptionExpiry && this.subscriptionExpiry < new Date()) {
    return 'expired';
  }
  return 'active';
});

// Method to check if subscription is active
UserSchema.methods.isSubscriptionActive = function(): boolean {
  if (!this.isSubscribed) return false;
  if (this.subscriptionExpiry && this.subscriptionExpiry < new Date()) return false;
  return true;
};

// Method to add push token
UserSchema.methods.addPushToken = function(token: string) {
  if (!this.pushTokens.includes(token)) {
    this.pushTokens.push(token);
  }
};

// Method to remove push token
UserSchema.methods.removePushToken = function(token: string) {
  this.pushTokens = this.pushTokens.filter((t: string) => t !== token);
};

export default mongoose.model<IUser>('User', UserSchema);
