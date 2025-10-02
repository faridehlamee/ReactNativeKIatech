"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_validator_1 = require("express-validator");
const Subscription_1 = __importDefault(require("../models/Subscription"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/my-subscription', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const subscription = await Subscription_1.default.findOne({ userId })
            .sort({ createdAt: -1 });
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'No subscription found',
            });
        }
        res.json({
            success: true,
            data: subscription,
        });
    }
    catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.post('/', auth_1.authenticateToken, [
    (0, express_validator_1.body)('type').isIn(['free', 'premium', 'enterprise']).withMessage('Invalid subscription type'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('currency').optional().isString().withMessage('Currency must be a string'),
    (0, express_validator_1.body)('paymentMethod').optional().isString().withMessage('Payment method must be a string'),
    (0, express_validator_1.body)('paymentId').optional().isString().withMessage('Payment ID must be a string'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { type, price, currency = 'USD', paymentMethod, paymentId } = req.body;
        const userId = req.user?.userId;
        const existingSubscription = await Subscription_1.default.findOne({
            userId,
            status: 'active',
        });
        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: 'User already has an active subscription',
            });
        }
        let endDate;
        if (type !== 'free') {
            endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
        }
        const subscription = new Subscription_1.default({
            userId,
            type,
            price,
            currency,
            paymentMethod,
            paymentId,
            status: 'active',
            endDate,
        });
        await subscription.save();
        await User_1.default.findByIdAndUpdate(userId, {
            isSubscribed: true,
            subscriptionType: type,
            subscriptionExpiry: endDate,
        });
        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: subscription,
        });
    }
    catch (error) {
        console.error('Create subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.put('/cancel', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const subscription = await Subscription_1.default.findOne({
            userId,
            status: 'active',
        });
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found',
            });
        }
        subscription.cancel(new mongoose_1.default.Types.ObjectId(userId));
        await subscription.save();
        await User_1.default.findByIdAndUpdate(userId, {
            isSubscribed: false,
            subscriptionType: 'free',
            subscriptionExpiry: null,
        });
        res.json({
            success: true,
            message: 'Subscription cancelled successfully',
            data: subscription,
        });
    }
    catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.put('/renew', auth_1.authenticateToken, [
    (0, express_validator_1.body)('months').isInt({ min: 1, max: 12 }).withMessage('Months must be between 1 and 12'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { months } = req.body;
        const userId = req.user?.userId;
        const subscription = await Subscription_1.default.findOne({
            userId,
            status: 'active',
        });
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found',
            });
        }
        const renewed = subscription.renew(months);
        if (!renewed) {
            return res.status(400).json({
                success: false,
                message: 'Subscription cannot be renewed',
            });
        }
        await subscription.save();
        await User_1.default.findByIdAndUpdate(userId, {
            subscriptionExpiry: subscription.endDate,
        });
        res.json({
            success: true,
            message: 'Subscription renewed successfully',
            data: subscription,
        });
    }
    catch (error) {
        console.error('Renew subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.get('/all', auth_1.authenticateToken, (0, auth_1.requireSubscription)('enterprise'), [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('status').optional().isIn(['active', 'cancelled', 'expired', 'pending']).withMessage('Invalid status'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const query = {};
        if (status) {
            query.status = status;
        }
        const subscriptions = await Subscription_1.default.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const total = await Subscription_1.default.countDocuments(query);
        res.json({
            success: true,
            data: {
                subscriptions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    }
    catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.get('/stats', auth_1.authenticateToken, (0, auth_1.requireSubscription)('enterprise'), async (req, res) => {
    try {
        const totalSubscriptions = await Subscription_1.default.countDocuments();
        const activeSubscriptions = await Subscription_1.default.getActiveSubscriptions();
        const expiringSubscriptions = await Subscription_1.default.getExpiringSubscriptions();
        const revenueStats = await Subscription_1.default.aggregate([
            {
                $match: { status: 'active' }
            },
            {
                $group: {
                    _id: '$type',
                    totalRevenue: { $sum: '$price' },
                    count: { $sum: 1 }
                }
            }
        ]);
        const monthlyRevenue = await Subscription_1.default.aggregate([
            {
                $match: {
                    status: 'active',
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$price' }
                }
            }
        ]);
        res.json({
            success: true,
            data: {
                totalSubscriptions,
                activeSubscriptions: activeSubscriptions.length,
                expiringSubscriptions: expiringSubscriptions.length,
                revenueStats,
                monthlyRevenue: monthlyRevenue[0]?.totalRevenue || 0,
            },
        });
    }
    catch (error) {
        console.error('Get subscription stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=subscriptions.js.map