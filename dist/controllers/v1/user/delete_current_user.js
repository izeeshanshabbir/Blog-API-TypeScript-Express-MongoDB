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
const cloudinary_1 = require("cloudinary");
const winston_1 = require("../../../lib/winston");
const user_1 = __importDefault(require("../../../models/user"));
const blog_1 = __importDefault(require("../../../models/blog"));
const deleteCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const blogs = yield blog_1.default.find({ author: userId })
            .select('banner.publicId')
            .lean()
            .exec();
        const publicIds = blogs.map(({ banner }) => banner.publicId);
        yield cloudinary_1.v2.api.delete_resources(publicIds);
        winston_1.logger.info('Multiple blog banners deleted from cloudinary', {
            publicIds,
        });
        yield blog_1.default.deleteMany({ author: userId });
        winston_1.logger.info('Multiple blogs deleted', {
            userId,
            blogs,
        });
        yield user_1.default.deleteOne({ _id: userId });
        winston_1.logger.info('A user account has been deleted', { userId });
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error,
        });
        winston_1.logger.error('Error while deleting current user', error);
    }
});
exports.default = deleteCurrentUser;
