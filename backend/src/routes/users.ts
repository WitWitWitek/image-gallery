import express from "express";
import { createNewUser, getAllUsers, updateUserPassword } from "../controllers/usersController";
const router = express.Router()
// import verifyJWT from "../middleware/verifyJWT";

// router.use(verifyJWT)

router
    .route('/')
    .get(getAllUsers)
    .post(createNewUser)

router
    .route('/change-password')
    .patch(updateUserPassword)

export default router