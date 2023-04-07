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
exports.deleteImage = exports.updateImage = exports.postImage = exports.getAllImages = void 0;
const imagekit_1 = require("../lib/imagekit");
const Image_1 = __importDefault(require("../models/Image"));
const getAllImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const listOfImgs = yield Image_1.default.find();
    res.json({ listOfImgs });
    // REFACTOR NEEDED
    // zmienić array zeby nie dawalo id imageId
});
exports.getAllImages = getAllImages;
const postImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const result = yield (0, imagekit_1.imagekitUploadHandler)({
            folder: 'images-app',
            file: (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer,
            fileName: (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname
        });
        const imageObj = {
            imagekitId: result.fileId,
            src: result.url,
            title: req.body.title,
            description: req.body.description,
        };
        yield Image_1.default.create(imageObj);
        res.status(201).json({ message: 'New image successfully created!' });
    }
    catch (err) {
        console.log(err);
    }
});
exports.postImage = postImage;
const updateImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.params;
    const { updatedTitle, updatedDescription } = req.body;
    const image = yield Image_1.default.findOne({ _id: imageId });
    if (!image) {
        return res.status(404).json({ message: "Image doesn't exists." });
    }
    image.title = updatedTitle;
    image.description = updatedDescription;
    image.save();
    res.status(201).json({ message: "Image data succesfully updated!" });
});
exports.updateImage = updateImage;
const deleteImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.params;
    try {
        const imagekitId = yield Image_1.default.findById(imageId);
        yield (0, imagekit_1.imagekitDeleteHandler)(imagekitId.imagekitId);
        yield Image_1.default.deleteOne({ _id: imageId });
        res.json({ message: 'Image successfully deleted' });
    }
    catch (err) {
        console.log(err);
    }
});
exports.deleteImage = deleteImage;
