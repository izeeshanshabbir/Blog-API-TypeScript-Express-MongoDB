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
const config_1 = __importDefault(require("../../../config"));
const winston_1 = require("../../../lib/winston");
const user_1 = __importDefault(require("../../../models/user"));
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || config_1.default.defaultResLimit;
        const offset = parseInt(req.query.offset) || config_1.default.defaultOffset;
        const total = yield user_1.default.countDocuments();
        const users = yield user_1.default.find()
            .select('-__v')
            .limit(limit)
            .skip(offset)
            .lean()
            .exec();
        winston_1.logger.info('All users retrieved successfully', {
            userId: req.userId,
            limit,
            offset,
            total,
        });
        res.status(200).json({
            code: 'Success',
            message: 'Users retrieved successfully',
            users,
            limit,
            offset,
            total,
        });
    }
    catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error,
        });
        winston_1.logger.error('Error while getting all user', error);
    }
});
exports.default = getAllUser;
