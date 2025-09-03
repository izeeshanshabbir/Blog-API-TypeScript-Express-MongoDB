// Copyright 2025 Zeeshan Shabbir Abbasi
// Licensed under the Apache License, Version 2.0 (see LICENSE file)

// Node Modules
import { Schema, model } from 'mongoose';
// Custom Modules
import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

// User Schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      maxLength: [20, 'Username must be less than 20 characters'],
      minLength: [3, 'Username must be at least 3 characters'],
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      maxLength: [50, 'Email must be less than 50 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      maxLength: [20, 'Password must be less than 20 characters'],
      minLength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'user'],
        message: '{Value} is not supported',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxLength: [30, 'First name must be less than 30 characters'],
    },
    lastName: {
      type: String,
      maxLength: [30, 'Last name must be less than 30 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        maxLength: [100, 'Website url must be less than 100 characters'],
      },
      facebook: {
        type: String,
        maxLength: [
          100,
          'Facebook profile url must be less than 100 characters',
        ],
      },
      instagram: {
        type: String,
        maxLength: [
          100,
          'Instagram profile url must be less than 100 characters',
        ],
      },
      linkedin: {
        type: String,
        maxLength: [
          100,
          'Linkedin profile url must be less than 100 characters',
        ],
      },
      x: {
        type: String,
        maxLength: [
          100,
          'X (formerly Twitter) profile url must be less than 100 characters',
        ],
      },
      youtube: {
        type: String,
        maxLength: [
          100,
          'YouTube profile url must be less than 100 characters',
        ],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

export default model<IUser>('User', userSchema);
