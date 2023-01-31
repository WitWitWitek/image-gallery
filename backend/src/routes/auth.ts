import express from "express";
import { login, refresh, logut } from "../controllers/authController";
const router = express.Router()

router
    .route('/')
    .post(login)

router
    .route('/refresh')
    .get(refresh)

router
    .route('/logout')
    .post(logut)

export default router