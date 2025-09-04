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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        maxLength: [20, 'Username must be less than 20 characters'],
        minLength: [3, 'Username must be at least 3 characters'],
        unique: [true, 'Username must be unique'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        maxLength: [50, 'Email must be less than 50 characters'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
        maxLength: [20, 'Password must be less than 20 characters'],
        minLength: [8, 'Password must be at least 8 characters'],
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['admin', 'user'],
            message: '{Value} is not supported',
        },
        default: 'user',
    },
    firstName: {
        type: String,
        maxLength: [30, 'First name must be less than 30 characters'],
    },
    lastName: {
        type: String,
        maxLength: [30, 'Last name must be less than 30 characters'],
    },
    socialLinks: {
        website: {
            type: String,
            maxLength: [100, 'Website url must be less than 100 characters'],
        },
        facebook: {
            type: String,
            maxLength: [
                100,
                'Facebook profile url must be less than 100 characters',
            ],
        },
        instagram: {
            type: String,
            maxLength: [
                100,
                'Instagram profile url must be less than 100 characters',
            ],
        },
        linkedin: {
            type: String,
            maxLength: [
                100,
                'Linkedin profile url must be less than 100 characters',
            ],
        },
        x: {
            type: String,
            maxLength: [
                100,
                'X (formerly Twitter) profile url must be less than 100 characters',
            ],
        },
        youtube: {
            type: String,
            maxLength: [
                100,
                'YouTube profile url must be less than 100 characters',
            ],
        },
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
            return;
        }
        this.password = yield bcrypt_1.default.hash(this.password, 10);
    });
});
exports.default = (0, mongoose_1.model)('User', userSchema);
