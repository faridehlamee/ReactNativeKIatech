import mongoose, { Document } from 'mongoose';
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
    isActive(): boolean;
    cancel(cancelledBy?: mongoose.Types.ObjectId): void;
    renew(months: number): boolean;
}
export interface ISubscriptionModel extends mongoose.Model<ISubscription> {
    getActiveSubscriptions(): Promise<ISubscription[]>;
    getExpiringSubscriptions(days?: number): Promise<ISubscription[]>;
}
declare const _default: ISubscriptionModel;
export default _default;
//# sourceMappingURL=Subscription.d.ts.map