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
const config_1 = __importDefault(require("../../../config"));
const token_1 = __importDefault(require("../../../models/token"));
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            yield token_1.default.deleteOne({ token: refreshToken });
            winston_1.logger.info('User refresh token deleted successfully', {
                userId: req.userId,
                token: refreshToken,
            });
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config_1.default.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.sendStatus(204);
        winston_1.logger.info('User logged out successfully', { userId: req.userId });
    }
    catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error,
        });
        winston_1.logger.error('Error during user logout', error);
    }
});
exports.default = logout;
