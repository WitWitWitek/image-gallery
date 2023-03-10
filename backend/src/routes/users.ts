import express from "express";
import { createNewUser, getAllUsers, updateUserPassword } from "../controllers/usersController";
const router = express.Router()
import verifyJWT from "../middleware/verifyJWT";

router
    .route('/')
    .get(getAllUsers)
    .post(createNewUser)

router
    .route('/change-password')
    .patch(verifyJWT, updateUserPassword)

export default router