// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Custom Modules
import config from '@/config';
import { logger } from '@/lib/winston';
// Models
import User from '@/models/user';
import Blog from '@/models/blog';
// Types
import type { Request, Response } from 'express';

interface QueryType {
  status?: 'draft' | 'published';
}

const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset = parseInt(req.query.offset as string) || config.defaultOffset;
    
    const user = await User.findById(userId).select('role').lean().exec();
    const query: QueryType = {};
    
    // Show only the published blogs to the user
    if (user?.role === 'user') {
        query.status = 'published';
    }
    
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      code: 'Success',
      message: 'Blogs retrieved successfully',
      limit,
      offset,
      total,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error while getting all blogs', error);
  }
};

export default getAllBlogs;
