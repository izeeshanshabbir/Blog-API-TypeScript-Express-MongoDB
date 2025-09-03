// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Custom Modules
import config from '@/config';
import { logger } from '@/lib/winston';
// Models
import User from '@/models/user';
// Types
import type { Request, Response } from 'express';

const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset = parseInt(req.query.offset as string) || config.defaultOffset;
    const total = await User.countDocuments();

    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    logger.info('All users retrieved successfully', {
      userId: req.userId,
      limit,
      offset,
      total,
    });
    res.status(200).json({
      code: 'Success',
      message: 'Users retrieved successfully',
      users,
      limit,
      offset,
      total,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error while getting all user', error);
  }
};

export default getAllUser;
