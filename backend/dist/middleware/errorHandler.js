"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res) => {
    res.status(res.statusCode || 500);
    res.json({ message: error.message, isError: true });
};
exports.errorHandler = errorHandler;
