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
const comment_1 = __importDefault(require("../../../models/comment"));
const window = new jsdom_1.JSDOM('').window;
const purify = (0, dompurify_1.default)(window);
const commentBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const { blogId } = req.params;
    const userId = req.userId;
    try {
        const blog = yield blog_1.default.findById(blogId).select('_id commentsCount').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }
        const cleanContent = purify.sanitize(content);
        const newComment = yield comment_1.default.create({
            blogId,
            content: cleanContent,
            userId,
        });
        blog.commentsCount++;
        yield blog.save();
        winston_1.logger.info('Blog comment count updated', {
            blogId: blog._id,
            commentsCount: blog.commentsCount,
        });
        res.status(201).json({
            code: 'Success',
            message: 'Comment created successfully',
            comment: newComment,
        });
    }
    catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error,
        });
        winston_1.logger.error('Error while commenting blog', error);
    }
});
exports.default = commentBlog;
