"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("../lib/winston");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const blog_1 = __importDefault(require("../models/blog"));
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const uploadBlogBanner = (method) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (method === 'put' && !req.file) {
            next();
            return;
        }
        if (!req.file) {
            res.status(400).json({
                code: 'ValidationError',
                message: 'Banner is required',
            });
            return;
        }
        if (req.file.size > MAX_FILE_SIZE) {
            res.status(413).json({
                code: 'ValidationError',
                message: 'File size must be less than 2 MB',
            });
            return;
        }
        try {
            const blogId = req.params;
            const blog = yield blog_1.default.findById(blogId).select('banner.publicId').exec();
            const data = yield (0, cloudinary_1.default)(req.file.buffer, blog === null || blog === void 0 ? void 0 : blog.banner.publicId.replace('blog-api/', ''));
            if (!data) {
                res.status(500).json({
                    code: 'ServerError',
                    message: 'Internal server error',
                });
                winston_1.logger.error('Error while uploading blog benner to Cloudinary', {
                    blogId,
                    publicId: blog === null || blog === void 0 ? void 0 : blog.banner.publicId
                });
                return;
            }
            const newBanner = {
                publicId: data.public_id,
                url: data.secure_url,
                width: data.width,
                height: data.height,
            };
            winston_1.logger.info('Blog banner uploaded to cloudinary', {
                blogId,
                banner: newBanner,
            });
            req.body.banner = newBanner,
                next();
        }
        catch (error) {
            res.status(error.http_code).json({
                code: error.http_code < 500 ? 'ValidationError' : error.name,
                message: error.message
            });
            winston_1.logger.error('Error while uploading blog banner to Cloudinary', error);
        }
    });
};
exports.default = uploadBlogBanner;
