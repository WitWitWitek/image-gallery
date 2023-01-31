import express from "express";
import { getAllImages, postImage, deleteImage, updateImage } from "../controllers/imagesController";
const router = express.Router()
import verifyJWT from "../middleware/verifyJWT";

router.use(verifyJWT)

router
    .get('/', getAllImages)
    .post('/', postImage)
    .patch('/:imageId', updateImage) 
    .delete('/:imageId', deleteImage) 
   
    
    // :id R

export default router