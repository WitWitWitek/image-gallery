"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imagesController_1 = require("../controllers/imagesController");
const router = express_1.default.Router();
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
router.use(verifyJWT_1.default);
router
    .get("/", imagesController_1.getAllImages)
    .get("/:user", imagesController_1.getUserImages)
    .post("/", imagesController_1.postImage)
    .patch("/:imageId", imagesController_1.updateImage)
    .delete("/:imageId", imagesController_1.deleteImage);
exports.default = router;
