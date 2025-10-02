"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SubscriptionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, {
    timestamps: true,
});
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ type: 1 });
SubscriptionSchema.index({ endDate: 1 });
SubscriptionSchema.virtual('duration').get(function () {
    if (!this.endDate)
        return null;
    return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
});
SubscriptionSchema.methods.isActive = function () {
    return this.status === 'active' &&
        (!this.endDate || this.endDate > new Date());
};
SubscriptionSchema.methods.cancel = function (cancelledBy) {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    if (cancelledBy) {
        this.cancelledBy = cancelledBy;
    }
};
SubscriptionSchema.methods.renew = function (months = 1) {
    if (this.status !== 'active')
        return false;
    const currentEndDate = this.endDate || new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + months);
    this.endDate = newEndDate;
    this.status = 'active';
    return true;
};
SubscriptionSchema.statics.getActiveSubscriptions = function () {
    return this.find({
        status: 'active',
        $or: [
            { endDate: { $exists: false } },
            { endDate: { $gt: new Date() } }
        ]
    }).populate('userId', 'name email');
};
SubscriptionSchema.statics.getExpiringSubscriptions = function (days = 7) {
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
exports.default = mongoose_1.default.model('Subscription', SubscriptionSchema);
//# sourceMappingURL=Subscription.js.map