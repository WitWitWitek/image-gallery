import express from "express";
import { getAllImages, postImage, deleteImage, updateImage } from "../controllers/images";
const router = express.Router()

router
    .get('/', getAllImages)
    .post('/', postImage)
    .patch('/:imageId', updateImage) 
    .delete('/:imageId', deleteImage) 
   
    
    // :id R

export default router