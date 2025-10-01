import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate?: Date;
  price: number;
  currency: string;
  paymentMethod?: string;
  paymentId?: string;
  autoRenew: boolean;
  cancelledAt?: Date;
  cancelledBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  // Methods
  isActive(): boolean;
  cancel(cancelledBy?: mongoose.Types.ObjectId): void;
  renew(months: number): boolean;
}

export interface ISubscriptionModel extends mongoose.Model<ISubscription> {
  getActiveSubscriptions(): Promise<ISubscription[]>;
  getExpiringSubscriptions(days?: number): Promise<ISubscription[]>;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  type: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    required: [true, 'Subscription type is required'],
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'pending'],
    default: 'pending',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    uppercase: true,
  },
  paymentMethod: {
    type: String,
    default: null,
  },
  paymentId: {
    type: String,
    default: null,
  },
  autoRenew: {
    type: Boolean,
    default: true,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Index for better query performance
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ type: 1 });
SubscriptionSchema.index({ endDate: 1 });

// Virtual for subscription duration
SubscriptionSchema.virtual('duration').get(function() {
  if (!this.endDate) return null;
  return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24)); // days
});

// Method to check if subscription is active
SubscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && 
         (!this.endDate || this.endDate > new Date());
};

// Method to cancel subscription
SubscriptionSchema.methods.cancel = function(cancelledBy?: mongoose.Types.ObjectId) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  if (cancelledBy) {
    this.cancelledBy = cancelledBy;
  }
};

// Method to renew subscription
SubscriptionSchema.methods.renew = function(months: number = 1) {
  if (this.status !== 'active') return false;
  
  const currentEndDate = this.endDate || new Date();
  const newEndDate = new Date(currentEndDate);
  newEndDate.setMonth(newEndDate.getMonth() + months);
  
  this.endDate = newEndDate;
  this.status = 'active';
  return true;
};

// Static method to get active subscriptions
SubscriptionSchema.statics.getActiveSubscriptions = function() {
  return this.find({
    status: 'active',
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gt: new Date() } }
    ]
  }).populate('userId', 'name email');
};

// Static method to get expiring subscriptions
SubscriptionSchema.statics.getExpiringSubscriptions = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: 'active',
    endDate: {
      $gte: new Date(),
      $lte: futureDate
    }
  }).populate('userId', 'name email');
};

export default mongoose.model<ISubscription, ISubscriptionModel>('Subscription', SubscriptionSchema);
