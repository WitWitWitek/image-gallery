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
exports.updateUserPassword = exports.resendConfirmationEmail = exports.confirmUser = exports.createNewUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const nodemailer_1 = require("../lib/nodemailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;
exports.getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield User_1.default.find().select("-password");
    if ((allUsers === null || allUsers === void 0 ? void 0 : allUsers.length) === 0) {
        res.status(400).json({ message: "No users found!" });
        return;
    }
    res.status(200).json(allUsers);
}));
exports.createNewUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
        res.status(400).json({ message: "Credentials are required!" });
        return;
    }
    const userExist = yield User_1.default.findOne({ username })
        .collation({ locale: "en", strength: 2 })
        .exec();
    if (userExist) {
        res.status(408).json({ message: "User already exists!" });
        return;
    }
    const userEmailExist = yield User_1.default.findOne({ email })
        .collation({ locale: "en", strength: 2 })
        .exec();
    if (userEmailExist) {
        res
            .status(408)
            .json({ message: "Your email already registered. Try to log in!" });
        return;
    }
    if (!PASSWORD_REGEX.test(password)) {
        res.status(401).json({ message: "Invalid password!" });
        return;
    }
    const hashedPwd = yield bcrypt_1.default.hash(password, 10);
    const userObject = { username, email, password: hashedPwd };
    const user = yield User_1.default.create(userObject);
    jsonwebtoken_1.default.sign({
        UserInfo: {
            userId: user._id,
        },
    }, process.env.EMAIL_SECRET, { expiresIn: "10m" }, (err, emailToken) => {
        try {
            nodemailer_1.transporter.sendMail(Object.assign({}, (0, nodemailer_1.mailOptions)(email, `https://image-gallery-kim0.onrender.com/confirmation/${emailToken}`)));
        }
        catch (err) {
            // dac res blad
            console.log(err);
        }
    });
    if (user) {
        res.status(201).json({
            message: `New user ${username} created. Confirm your account via email.`,
        });
    }
    else {
        res.status(400).json({ message: "Invalid user data received." });
    }
}));
exports.confirmUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailToken } = req.params;
    jsonwebtoken_1.default.verify(emailToken, process.env.EMAIL_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(400).json({ message: "Token expired" });
            }
            else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(400).json({ message: "Invalid token" });
            }
            return res
                .status(400)
                .json({ message: "Unexpected error occured. Try again." });
        }
        if (typeof decoded === "object" && "UserInfo" in decoded) {
            const { userId } = decoded.UserInfo;
            const userFound = yield User_1.default.findById(userId);
            if (userFound === null || userFound === void 0 ? void 0 : userFound.confirmed) {
                return res
                    .status(200)
                    .json({ message: "User is already confirmed. Please log in." });
            }
            yield User_1.default.updateOne({ _id: userId }, { $set: { confirmed: true } });
            res.status(200).json({ message: "User confirmed. Please log in." });
        }
    }));
}));
exports.resendConfirmationEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Credentials are required!" });
        return;
    }
    const user = yield User_1.default.findOne({ email })
        .collation({ locale: "en", strength: 2 })
        .exec();
    if (!user) {
        res
            .status(408)
            .json({ message: "Your email is not registered. Sign up!" });
        return;
    }
    jsonwebtoken_1.default.sign({
        UserInfo: {
            userId: user._id,
        },
    }, process.env.EMAIL_SECRET, { expiresIn: "10m" }, (err, emailToken) => {
        try {
            nodemailer_1.transporter.sendMail(Object.assign({}, (0, nodemailer_1.mailOptions)(email, `https://image-gallery-kim0.onrender.com/confirmation/${emailToken}`)));
        }
        catch (err) {
            // dac res blad
            console.log(err);
        }
    });
    res.status(201).json({ message: "Confirmation e-mail has been sent." });
}));
exports.updateUserPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, newPassword } = req.body;
    if (!username || !password || !newPassword) {
        res.status(400).json({ message: "All fields are required!" });
        return;
    }
    const userExist = yield User_1.default.findOne({ username }).exec();
    if (!userExist) {
        res.status(404).json({ message: "User doesn't exists" });
        return;
    }
    const pwdsMatch = yield bcrypt_1.default.compare(password, userExist.password);
    if (!pwdsMatch) {
        res.status(400).json({ message: "Invalid old password!" });
        return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
        res.status(400).json({ message: "Invalid new password!" });
        return;
    }
    const hashedPwd = yield bcrypt_1.default.hash(newPassword, 10);
    yield User_1.default.updateOne({ username }, { $set: { password: hashedPwd } });
    res.status(201).json({ message: "Your password has been updated!" });
}));
