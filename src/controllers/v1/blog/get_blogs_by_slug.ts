// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Custom Modules
import { logger } from '@/lib/winston';
// Models
import User from '@/models/user';
import Blog from '@/models/blog';
// Types
import type { Request, Response } from 'express';

const getBlogsBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const slug = req.params.slug;

    const user = await User
    .findById(userId)
    .select('role')
    .lean()
    .exec();

    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    if(!blog) {
        res.status(404).json({
            code: 'NotFound',
            message: 'Blog not found'
        });
        return;
    }

    if (user?.role === 'user' && blog.status === 'draft') {
        res.status(403).json({
            code: 'AuthenticationError',
            message: 'Access denied, insufficient permissions'
        })
        logger.warn('A user tried to access a draft blog', {
            userId,
            blog
        })
    }

    res.status(200).json({
      code: 'Success',
      message: 'Blog retrieved successfully',
      blog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error while getting all blog by slug', error);
  }
};

export default getBlogsBySlug;
