import express from "express";
import { login, refresh, logut } from "../controllers/authController";
import { limiter } from "../middleware/limiter";
const router = express.Router();

router.route("/").post(limiter, login);

router.route("/refresh").get(refresh);

router.route("/logout").post(logut);

export default router;
