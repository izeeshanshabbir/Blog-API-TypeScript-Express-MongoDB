// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
// Custom Modules
import { logger } from '@/lib/winston';
// Models
import Blog from '@/models/blog';
// Types
import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

// Purify the blog content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { title, content, banner, status } = req.body as BlogData;

    const cleanContent = purify.sanitize(content)
    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      author: userId,
      status,
    });

    logger.info('New blog created successfully', newBlog);

    res.status(201).json({
      code: 'Success',
      message: 'Blog was created successfully',
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error during blog creation', error);
  }
};

export default createBlog;
