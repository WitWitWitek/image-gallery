import express from "express";
import {
  getAllImages,
  postImage,
  deleteImage,
  updateImage,
  getUserImages,
} from "../controllers/imagesController";
const router = express.Router();
import verifyJWT from "../middleware/verifyJWT";

router.use(verifyJWT);

router
  .get("/", getAllImages)
  .get("/:user", getUserImages)
  .post("/", postImage)
  .patch("/:imageId", updateImage)
  .delete("/:imageId", deleteImage);

export default router;
