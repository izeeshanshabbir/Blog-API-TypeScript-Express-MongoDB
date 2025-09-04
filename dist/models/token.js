"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: [true, 'Token is required'],
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
    },
});
exports.default = (0, mongoose_1.model)('Token', tokenSchema);
