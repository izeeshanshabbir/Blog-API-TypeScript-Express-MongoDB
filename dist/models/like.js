"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    blogId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    commentId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
exports.default = (0, mongoose_1.model)('Like', likeSchema);
