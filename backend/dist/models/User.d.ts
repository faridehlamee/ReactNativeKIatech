import mongoose, { Document } from 'mongoose';
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
    isSubscriptionActive(): boolean;
    addPushToken(token: string): void;
    removePushToken(token: string): void;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map