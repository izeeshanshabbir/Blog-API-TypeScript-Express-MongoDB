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
const like_1 = __importDefault(require("../../../models/like"));
const unlikeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const { userId } = req.body;
    try {
        const existingLike = yield like_1.default.findOne({ blogId, userId }).lean().exec();
        if (!existingLike) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Like not found',
            });
            return;
        }
        yield like_1.default.deleteOne({ _id: existingLike._id });
        const blog = yield blog_1.default.findById(blogId).select('likesCount').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }
        blog.likesCount--;
        yield blog.save();
        winston_1.logger.info('Blog unliked successfully', {
            userId,
            blogId: blog._id,
            likesCount: blog.likesCount,
        });
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error,
        });
        winston_1.logger.error('Error while unliking the blog', error);
    }
});
exports.default = unlikeBlog;
