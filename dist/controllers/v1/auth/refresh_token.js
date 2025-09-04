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
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_1 = require("../../../lib/jwt");
const winston_1 = require("../../../lib/winston");
const token_1 = __importDefault(require("../../../models/token"));
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    try {
        const tokenExists = yield token_1.default.exists({ token: refreshToken });
        if (!tokenExists) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }
        const jwtPayload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        if (!jwtPayload) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(jwtPayload.userId);
        res.status(200).json({
            code: 'Success',
            message: 'Access token refreshed successfully',
            data: {
                accessToken: accessToken,
            },
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token expired, please login again',
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });
        winston_1.logger.error('Error during token refresh', error);
    }
});
exports.default = refreshToken;
