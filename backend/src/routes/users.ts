import express from "express";
import {
  confirmUser,
  createNewUser,
  getAllUsers,
  updateUserPassword,
  resendConfirmationEmail,
} from "../controllers/usersController";
const router = express.Router();
import verifyJWT from "../middleware/verifyJWT";

router.route("/").get(getAllUsers).post(createNewUser);

router.route("/confirmation/:emailToken").get(confirmUser);

router.route("/resend-email").post(resendConfirmationEmail);

router.route("/change-password").patch(verifyJWT, updateUserPassword);

export default router;
