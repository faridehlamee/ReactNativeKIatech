import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const requireSubscription = (subscriptionType: 'premium' | 'enterprise') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check subscription
      if (!user.isSubscribed || user.subscriptionType === 'free') {
        return res.status(403).json({
          success: false,
          message: `${subscriptionType} subscription required`,
        });
      }

      // Check if subscription is active
      if (!user.isSubscriptionActive()) {
        return res.status(403).json({
          success: false,
          message: 'Subscription has expired',
        });
      }

      // Check subscription type level
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
    } catch (error) {
      console.error('Subscription middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};
