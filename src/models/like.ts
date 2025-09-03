// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import { Schema, model, Types } from 'mongoose';

interface ILike {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  commentId?: Types.ObjectId;
}

const likeSchema = new Schema<ILike>({
  blogId: {
    type: Schema.Types.ObjectId,
  },
  commentId: {
    type: Schema.Types.ObjectId,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model<ILike>('Like', likeSchema);
