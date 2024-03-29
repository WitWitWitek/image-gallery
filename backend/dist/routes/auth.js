"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const limiter_1 = require("../middleware/limiter");
const router = express_1.default.Router();
router.route("/").post(limiter_1.limiter, authController_1.login);
router.route("/refresh").get(authController_1.refresh);
router.route("/logout").post(authController_1.logut);
exports.default = router;
