// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
// Custom Modules
import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
// Types
import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  // If there's no Bearer token, respond with 401 Unauthorized
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied: No token provided',
    });
    return;
  }

  // Split out the token from 'Bearer' prefix
  const [_, token] = authHeader.split(' ');
  try {
    // Verify the token and extract userId from the payload
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach userId to the request object for later use
    req.userId = jwtPayload.userId;

    // Proceed to next middleware or route handler
    return next();
  } catch (error) {
    // Handle expired token error
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access Token expired',
      });
      return;
    }
    // Handle invalid token error
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid token',
      });
      return;
    }

    // Catch-all for other options
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error during authentication', error);
  }
};

export default authenticate;
