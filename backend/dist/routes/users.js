"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticateToken, (0, auth_1.requireSubscription)('enterprise'), [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('subscriptionType').optional().isIn(['free', 'premium', 'enterprise']).withMessage('Invalid subscription type'),
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
        const subscriptionType = req.query.subscriptionType;
        const query = {};
        if (subscriptionType) {
            query.subscriptionType = subscriptionType;
        }
        const users = await User_1.default.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const total = await User_1.default.countDocuments(query);
        res.json({
            success: true,
            data: {
                users,
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
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.get('/:id', auth_1.authenticateToken, (0, auth_1.requireSubscription)('enterprise'), async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.put('/:id/status', auth_1.authenticateToken, (0, auth_1.requireSubscription)('enterprise'), [
    (0, express_validator_1.body)('isActive').isBoolean().withMessage('isActive must be a boolean'),
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
        const { id } = req.params;
        const { isActive } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { isActive }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            message: 'User status updated successfully',
            data: user,
        });
    }
    catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.get('/stats/overview', auth_1.authenticateToken, (0, auth_1.requireSubscription)('enterprise'), async (req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const activeUsers = await User_1.default.countDocuments({ isActive: true });
        const subscribedUsers = await User_1.default.countDocuments({ isSubscribed: true });
        const subscriptionStats = await User_1.default.aggregate([
            {
                $group: {
                    _id: '$subscriptionType',
                    count: { $sum: 1 }
                }
            }
        ]);
        const recentUsers = await User_1.default.find()
            .select('name email createdAt subscriptionType')
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                subscribedUsers,
                subscriptionStats,
                recentUsers,
            },
        });
    }
    catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map