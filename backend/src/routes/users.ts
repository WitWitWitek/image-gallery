import express from "express";
import { createNewUser } from "../controllers/usersController";
const router = express.Router()
import verifyJWT from "../middleware/verifyJWT";

router.use(verifyJWT)

router
    .route('/')
    .post(createNewUser)

export default router