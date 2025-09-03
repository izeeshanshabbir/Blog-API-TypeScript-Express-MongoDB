// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import { Router } from 'express';
import { param, body } from 'express-validator';
// Custom Modules
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
// Controllers
import likeBlog from '@/controllers/v1/like/like_blog';
import unlikeBlog from '@/controllers/v1/like/unlike_blog';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid user ID'),
  body('userId')
    .notEmpty()
    .withMessage('User Id is required')
    .isMongoId()
    .withMessage('Invalid user Id'),
  validationError,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid user ID'),
  body('userId')
    .notEmpty()
    .withMessage('User Id is required')
    .isMongoId()
    .withMessage('Invalid user Id'),
  validationError,
  unlikeBlog,
);

export default router;
