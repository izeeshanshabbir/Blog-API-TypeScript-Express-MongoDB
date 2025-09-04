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
const winston_1 = require("../lib/winston");
const user_1 = __importDefault(require("../models/user"));
const authorize = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        try {
            const user = yield user_1.default.findById(userId).select('role').exec();
            if (!user) {
                res.send(404).json({
                    code: 'NotFound',
                    message: 'User not found',
                });
                return;
            }
            if (!roles.includes(user.role)) {
                res.send(403).json({
                    code: 'AuthorizationError',
                    message: 'Access denied, insufficient permissions',
                });
                return;
            }
            return next();
        }
        catch (error) {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal Server Error',
                error: error,
            });
            winston_1.logger.error('Error while authorizing user', error);
        }
    });
};
exports.default = authorize;
