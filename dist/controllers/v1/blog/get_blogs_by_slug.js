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
const user_1 = __importDefault(require("../../../models/user"));
const blog_1 = __importDefault(require("../../../models/blog"));
const getBlogsBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const slug = req.params.slug;
        const user = yield user_1.default
            .findById(userId)
            .select('role')
            .lean()
            .exec();
        const blog = yield blog_1.default.findOne({ slug })
            .select('-banner.publicId -__v')
            .populate('author', '-createdAt -updatedAt -__v')
            .lean()
            .exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found'
            });
            return;
        }
        if ((user === null || user === void 0 ? void 0 : user.role) === 'user' && blog.status === 'draft') {
            res.status(403).json({
                code: 'AuthenticationError',
                message: 'Access denied, insufficient permissions'
            });
            winston_1.logger.warn('A user tried to access a draft blog', {
                userId,
                blog
            });
        }
        res.status(200).json({
            code: 'Success',
            message: 'Blog retrieved successfully',
            blog,
        });
    }
    catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error,
        });
        winston_1.logger.error('Error while getting all blog by slug', error);
    }
});
exports.default = getBlogsBySlug;
