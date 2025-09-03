// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
// Custom Modules
import { logger } from '@/lib/winston';
// Models
import Blog from '@/models/blog';
import User from '@/models/user';
// Types
import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

// Purify the blog content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as BlogData;
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });

      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthenticationError',
        message: 'Access denied, insufficient permissions',
      });

      logger.warn('A user tried to update a blog without permission', {
        userId,
        blog,
      });
      return;
    }

    if(title) blog.title = title;
    if(content) {
        const cleanContent = purify.sanitize(content);
        blog.content = content
    }
    if(banner) blog.banner = banner;
    if(status) blog.status = status;

    await blog.save();

    logger.info('Blog was updated successfully', { blog });

    res.status(200).json({
        code: 'Success',
        message: 'Blog was updated successfully',
        blog
    })
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error while updating a blog', error);
  }
};

export default updateBlog;
