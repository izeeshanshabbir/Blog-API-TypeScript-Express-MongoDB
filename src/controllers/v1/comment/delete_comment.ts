// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Custom Modules
import { logger } from '@/lib/winston';
// Models
import Blog from '@/models/blog';
import Comment from '@/models/comment';
import User from '@/models/user';
// Types
import type { Request, Response } from 'express';

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.userId;
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();
    const user = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (comment.userId !== currentUserId && user?.role != 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });

      logger.warn('A user tried to delete a comment without permission', {
        userId: currentUserId,
        comment,
      });

      return;
    }

    await Comment.deleteOne({ _id: commentId });

    logger.info('Comment deleted successfully', { commentId });

    blog.commentsCount--;

    await blog.save();

    logger.info('Blog comments count updated', {
      blog: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error while deleting a comment', error);
  }
};

export default deleteComment;
