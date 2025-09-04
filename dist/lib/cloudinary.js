"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const winston_1 = require("../lib/winston");
cloudinary_1.v2.config({
    cloud_name: config_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: config_1.default.CLOUDINARY_API_KEY,
    api_secret: config_1.default.CLOUDINARY_API_SECRET,
    secure: config_1.default.NODE_ENV === 'Production',
});
const uploadToCloudinary = (buffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({
            allowed_formats: ['png', 'jpg', 'webp'],
            resource_type: 'image',
            folder: 'blog-api',
            public_id: publicId,
            transformation: { quality: 'auto' },
        }, (error, result) => {
            if (error) {
                (winston_1.logger.error('Error uploading image to Cloudinary', error),
                    reject(error));
            }
            resolve(result);
        })
            .end(buffer);
    });
};
exports.default = uploadToCloudinary;
