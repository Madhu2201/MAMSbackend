

import jwt from 'jsonwebtoken';
import User from '../Models/UserSchema.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    if (req.user.role === 'Base Commander') {
      const baseIdParam = req.params.baseId || req.body.baseId;
      if (baseIdParam && baseIdParam !== req.user.baseId.toString()) {
        return res.status(403).json({ message: 'Forbidden: Cannot access other base data' });
      }
    }
    
    next();
  };
};
