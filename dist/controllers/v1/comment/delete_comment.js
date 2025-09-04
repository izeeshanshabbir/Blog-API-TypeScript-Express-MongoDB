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
const winston_1 = require("../../../lib/winston");
const blog_1 = __importDefault(require("../../../models/blog"));
const comment_1 = __importDefault(require("../../../models/comment"));
const user_1 = __importDefault(require("../../../models/user"));
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.userId;
    const { commentId } = req.params;
    try {
        const comment = yield comment_1.default.findById(commentId)
            .select('userId blogId')
            .lean()
            .exec();
        const user = yield user_1.default.findById(currentUserId)
            .select('role')
            .lean()
            .exec();
        if (!comment) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Comment not found',
            });
            return;
        }
        const blog = yield blog_1.default.findById(comment.blogId)
            .select('commentsCount')
            .exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }
        if (comment.userId !== currentUserId && (user === null || user === void 0 ? void 0 : user.role) != 'admin') {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });
            winston_1.logger.warn('A user tried to delete a comment without permission', {
                userId: currentUserId,
                comment,
            });
            return;
        }
        yield comment_1.default.deleteOne({ _id: commentId });
        winston_1.logger.info('Comment deleted successfully', { commentId });
        blog.commentsCount--;
        yield blog.save();
        winston_1.logger.info('Blog comments count updated', {
            blog: blog._id,
            commentsCount: blog.commentsCount,
        });
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error,
        });
        winston_1.logger.error('Error while deleting a comment', error);
    }
});
exports.default = deleteComment;
