// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import { Router } from 'express';
// Routes
import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';
import blogRoutes from '@/routes/v1/blog';
import likeRoutes from '@/routes/v1/like';
import commentRoutes from '@/routes/v1/comment';

const router = Router();

// Root Routes
router.get('/', (req, res) => {
  res.status(200).send({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/blog', blogRoutes);
router.use('/like', likeRoutes);
router.use('/comment', commentRoutes);

export default router;
