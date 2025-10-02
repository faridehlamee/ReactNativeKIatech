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
const UserSchema = new mongoose_1.Schema({
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
        select: false,
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
UserSchema.index({ email: 1 });
UserSchema.index({ isSubscribed: 1 });
UserSchema.index({ subscriptionType: 1 });
UserSchema.virtual('subscriptionStatus').get(function () {
    if (!this.isSubscribed)
        return 'inactive';
    if (this.subscriptionExpiry && this.subscriptionExpiry < new Date()) {
        return 'expired';
    }
    return 'active';
});
UserSchema.methods.isSubscriptionActive = function () {
    if (!this.isSubscribed)
        return false;
    if (this.subscriptionExpiry && this.subscriptionExpiry < new Date())
        return false;
    return true;
};
UserSchema.methods.addPushToken = function (token) {
    if (!this.pushTokens.includes(token)) {
        this.pushTokens.push(token);
    }
};
UserSchema.methods.removePushToken = function (token) {
    this.pushTokens = this.pushTokens.filter((t) => t !== token);
};
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map