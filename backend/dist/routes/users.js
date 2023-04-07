"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const router = express_1.default.Router();
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
router
    .route('/')
    .get(usersController_1.getAllUsers)
    .post(usersController_1.createNewUser);
router
    .route('/confirmation/:emailToken')
    .get(usersController_1.confirmUser);
router
    .route('/resend-email')
    .post(usersController_1.resendConfirmationEmail);
router
    .route('/change-password')
    .patch(verifyJWT_1.default, usersController_1.updateUserPassword);
exports.default = router;
