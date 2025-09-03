// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import { Schema, model, Types } from 'mongoose';

interface IToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: [true, 'Token is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
  },
});

export default model<IToken>('Token', tokenSchema);
