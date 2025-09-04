"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const validationError_1 = __importDefault(require("../../middlewares/validationError"));
const comment_blog_1 = __importDefault(require("../../controllers/v1/comment/comment_blog"));
const get_comment_by_blog_1 = __importDefault(require("../../controllers/v1/comment/get_comment_by_blog"));
const delete_comment_1 = __importDefault(require("../../controllers/v1/comment/delete_comment"));
const router = (0, express_1.Router)();
router.post('blog/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.param)('blogId').isMongoId().withMessage('Invalid blog ID'), (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Content is required'), validationError_1.default, comment_blog_1.default);
router.get('blog/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.param)('blogId').isMongoId().withMessage('Invalid blog ID'), (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Content is required'), validationError_1.default, get_comment_by_blog_1.default);
router.delete('/:commentId', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.param)('commentId').isMongoId().withMessage('Invalid comment Id'), validationError_1.default, delete_comment_1.default);
exports.default = router;
