"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxLength: [180, 'Title must be less than 180 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: [true, 'Slug must be unique'],
    },
    content: {
        type: String,
        required: [true, 'The content is required'],
    },
    banner: {
        publicId: {
            type: String,
            required: [true, 'Banner public ID is required'],
        },
        url: {
            type: String,
            required: [true, 'Banner URL is required'],
        },
        width: {
            type: Number,
            required: [true, 'Banner width is required'],
        },
        height: {
            type: Number,
            required: [true, 'Banner height is required'],
        },
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published'],
            message: '{Value} is not supported',
        },
        default: 'draft',
    },
}, {
    timestamps: {
        createdAt: 'publishedAt',
    },
});
blogSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = (0, utils_1.genSlug)(this.title);
    }
    next();
});
exports.default = (0, mongoose_1.model)('Blog', blogSchema);
