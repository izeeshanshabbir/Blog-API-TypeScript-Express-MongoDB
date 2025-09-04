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
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const winston_1 = require("../../../lib/winston");
const blog_1 = __importDefault(require("../../../models/blog"));
const user_1 = __importDefault(require("../../../models/user"));
const window = new jsdom_1.JSDOM('').window;
const purify = (0, dompurify_1.default)(window);
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, banner, status } = req.body;
        const userId = req.userId;
        const blogId = req.params.blogId;
        const user = yield user_1.default.findById(userId).select('role').lean().exec();
        const blog = yield blog_1.default.findById(blogId).select('-__v').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }
        if (blog.author !== userId && (user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            res.status(403).json({
                code: 'AuthenticationError',
                message: 'Access denied, insufficient permissions',
            });
            winston_1.logger.warn('A user tried to update a blog without permission', {
                userId,
                blog,
            });
            return;
        }
        if (title)
            blog.title = title;
        if (content) {
            const cleanContent = purify.sanitize(content);
            blog.content = content;
        }
        if (banner)
            blog.banner = banner;
        if (status)
            blog.status = status;
        yield blog.save();
        winston_1.logger.info('Blog was updated successfully', { blog });
        res.status(200).json({
            code: 'Success',
            message: 'Blog was updated successfully',
            blog
        });
    }
    catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error,
        });
        winston_1.logger.error('Error while updating a blog', error);
    }
});
exports.default = updateBlog;
