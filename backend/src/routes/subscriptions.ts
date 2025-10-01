import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult, query } from 'express-validator';
import Subscription from '../models/Subscription';
import User from '../models/User';
import { authenticateToken, requireSubscription } from '../middleware/auth';

interface AuthRequest extends express.Request {
  user?: {
    userId: string;
    email: string;
  };
}

const router = express.Router();

// Get user's subscription
router.get('/my-subscription', authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.userId;

    const subscription = await Subscription.findOne({ userId })
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
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Create subscription
router.post('/', authenticateToken, [
  body('type').isIn(['free', 'premium', 'enterprise']).withMessage('Invalid subscription type'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('paymentMethod').optional().isString().withMessage('Payment method must be a string'),
  body('paymentId').optional().isString().withMessage('Payment ID must be a string'),
], async (req: AuthRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { type, price, currency = 'USD', paymentMethod, paymentId } = req.body;
    const userId = req.user?.userId;

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId,
      status: 'active',
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'User already has an active subscription',
      });
    }

    // Calculate end date based on subscription type
    let endDate: Date | undefined;
    if (type !== 'free') {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
    }

    // Create subscription
    const subscription = new Subscription({
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

    // Update user subscription status
    await User.findByIdAndUpdate(userId, {
      isSubscribed: true,
      subscriptionType: type,
      subscriptionExpiry: endDate,
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Cancel subscription
router.put('/cancel', authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.userId;

    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    // Cancel subscription
    subscription.cancel(new mongoose.Types.ObjectId(userId));
    await subscription.save();

    // Update user subscription status
    await User.findByIdAndUpdate(userId, {
      isSubscribed: false,
      subscriptionType: 'free',
      subscriptionExpiry: null,
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Renew subscription
router.put('/renew', authenticateToken, [
  body('months').isInt({ min: 1, max: 12 }).withMessage('Months must be between 1 and 12'),
], async (req: AuthRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { months } = req.body;
    const userId = req.user?.userId;

    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    // Renew subscription
    const renewed = subscription.renew(months);
    if (!renewed) {
      return res.status(400).json({
        success: false,
        message: 'Subscription cannot be renewed',
      });
    }

    await subscription.save();

    // Update user subscription expiry
    await User.findByIdAndUpdate(userId, {
      subscriptionExpiry: subscription.endDate,
    });

    res.json({
      success: true,
      message: 'Subscription renewed successfully',
      data: subscription,
    });
  } catch (error) {
    console.error('Renew subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get all subscriptions (Admin only)
router.get('/all', authenticateToken, requireSubscription('enterprise'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['active', 'cancelled', 'expired', 'pending']).withMessage('Invalid status'),
], async (req: AuthRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }

    const subscriptions = await Subscription.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Subscription.countDocuments(query);

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
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get subscription statistics (Admin only)
router.get('/stats', authenticateToken, requireSubscription('enterprise'), async (req, res) => {
  try {
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.getActiveSubscriptions();
    const expiringSubscriptions = await Subscription.getExpiringSubscriptions();

    const revenueStats = await Subscription.aggregate([
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

    const monthlyRevenue = await Subscription.aggregate([
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
  } catch (error) {
    console.error('Get subscription stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
