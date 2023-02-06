import express from "express";
import { createNewUser, getAllUsers } from "../controllers/usersController";
const router = express.Router()
// import verifyJWT from "../middleware/verifyJWT";

// router.use(verifyJWT)

router
    .route('/')
    .get(getAllUsers)
    .post(createNewUser)

export default router