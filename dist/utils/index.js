"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSlug = exports.genUsername = void 0;
const genUsername = () => {
    const usernamePrefix = 'user_';
    const randomChars = Math.random().toString(36).slice(2);
    const username = usernamePrefix + randomChars;
    return username;
};
exports.genUsername = genUsername;
const genSlug = (title) => {
    const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]\s-/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    const randomChars = Math.random().toString(36).slice(2);
    const uniqueSlug = `${slug}-${randomChars}`;
    return uniqueSlug;
};
exports.genSlug = genSlug;
