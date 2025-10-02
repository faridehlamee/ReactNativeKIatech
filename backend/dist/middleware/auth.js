"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSubscription = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required',
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const user = await User_1.default.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireSubscription = (subscriptionType) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
            }
            const user = await User_1.default.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            if (!user.isSubscribed || user.subscriptionType === 'free') {
                return res.status(403).json({
                    success: false,
                    message: `${subscriptionType} subscription required`,
                });
            }
            if (!user.isSubscriptionActive()) {
                return res.status(403).json({
                    success: false,
                    message: 'Subscription has expired',
                });
            }
            const subscriptionLevels = { free: 0, premium: 1, enterprise: 2 };
            const requiredLevel = subscriptionLevels[subscriptionType];
            const userLevel = subscriptionLevels[user.subscriptionType];
            if (userLevel < requiredLevel) {
                return res.status(403).json({
                    success: false,
                    message: `${subscriptionType} subscription required`,
                });
            }
            next();
        }
        catch (error) {
            console.error('Subscription middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };
};
exports.requireSubscription = requireSubscription;
//# sourceMappingURL=auth.js.map