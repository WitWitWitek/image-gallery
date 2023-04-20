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
exports.deleteImage = exports.updateImage = exports.postImage = exports.getUserImages = exports.getAllImages = void 0;
const imagekit_1 = require("../lib/imagekit");
const Image_1 = __importDefault(require("../models/Image"));
const User_1 = __importDefault(require("../models/User"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.getAllImages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page ? +req.query.page : 1;
    const imgsCount = yield Image_1.default.count();
    const imgsPerPage = 4;
    const listOfImgs = yield Image_1.default.find()
        .sort({ createdAt: -1 })
        .limit(imgsPerPage * page);
    res.json({ listOfImgs, imgsCount });
}));
exports.getUserImages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.params;
    const page = req.query.page ? +req.query.page : 1;
    const imgsCount = yield Image_1.default.find({ user }).count();
    const imgsPerPage = 4;
    const listOfImgs = yield Image_1.default.find({ user })
        .sort({ createdAt: -1 })
        .limit(imgsPerPage * page);
    res.json({ listOfImgs, imgsCount });
}));
exports.postImage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userExist = yield User_1.default.findOne({ username: req.body.user }).exec();
    if (!userExist) {
        res.status(401).json({ message: "User doesn't exists" });
        return;
    }
    const result = (yield (0, imagekit_1.imagekitUploadHandler)({
        folder: "images-app",
        file: (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer,
        fileName: (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname,
    }));
    const imageObj = {
        imagekitId: result.fileId,
        src: result.url,
        title: req.body.title,
        description: req.body.description,
        user: userExist.username,
    };
    try {
        yield Image_1.default.create(imageObj);
        res.status(201).json({ message: "New image successfully created!" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error occured!" });
    }
}));
exports.updateImage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.params;
    const { updatedTitle, updatedDescription } = req.body;
    const image = yield Image_1.default.findOne({ _id: imageId });
    if (!image) {
        res.status(404).json({ message: "Image doesn't exists." });
        return;
    }
    image.title = updatedTitle;
    image.description = updatedDescription;
    image.save();
    res.status(201).json({ message: "Image data succesfully updated!" });
}));
exports.deleteImage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.params;
    const image = yield Image_1.default.findById(imageId);
    if (!image) {
        res.status(404).json({ message: "Image doesn't exists." });
        return;
    }
    yield (0, imagekit_1.imagekitDeleteHandler)(image.imagekitId);
    yield Image_1.default.deleteOne({ _id: imageId });
    res.json({ message: "Image successfully deleted" });
}));
