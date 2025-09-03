// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import { validationResult } from 'express-validator';
// Types
import type { Request, Response, NextFunction } from 'express';

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 'ValidationError',
      message: 'Validation failed',
      errors: errors.mapped(),
    });
    return;
  }
  next();
};

export default validationError;