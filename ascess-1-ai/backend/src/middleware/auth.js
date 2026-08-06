import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { ApiError } from '../utils/response.js';

export const authenticateJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ApiError(401, 'Access denied. Authorization token missing.');
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, err.message || 'Invalid or expired token.'));
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return next(new ApiError(403, 'Forbidden. Insufficient privileges.'));
  }
  next();
};
