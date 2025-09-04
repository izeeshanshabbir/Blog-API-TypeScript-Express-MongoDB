"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../routes/v1/auth"));
const user_1 = __importDefault(require("../../routes/v1/user"));
const blog_1 = __importDefault(require("../../routes/v1/blog"));
const like_1 = __importDefault(require("../../routes/v1/like"));
const comment_1 = __importDefault(require("../../routes/v1/comment"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(200).send({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        time: new Date().toISOString(),
    });
});
router.use('/auth', auth_1.default);
router.use('/user', user_1.default);
router.use('/blog', blog_1.default);
router.use('/like', like_1.default);
router.use('/comment', comment_1.default);
exports.default = router;
