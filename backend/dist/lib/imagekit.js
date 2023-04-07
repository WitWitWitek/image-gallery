"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagekitDeleteHandler = exports.imagekitUploadHandler = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
const imagekit = new imagekit_1.default({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_ID,
});
const imagekitUploadHandler = (optionsObj) => {
    return new Promise((resolve, reject) => {
        imagekit.upload(optionsObj)
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
};
exports.imagekitUploadHandler = imagekitUploadHandler;
const imagekitDeleteHandler = (id) => {
    return new Promise((resolve, reject) => {
        imagekit.deleteFile(id)
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
};
exports.imagekitDeleteHandler = imagekitDeleteHandler;
exports.default = imagekit;
