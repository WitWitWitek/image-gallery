import { RequestHandler } from 'express'
import { imagekitDeleteHandler, imagekitUploadHandler } from '../lib/imagekit'
import Image from '../models/Image';
import User from '../models/User';

interface ImageType {
    imagekitId: string;
    src: string;
    title: string;
    description: string;
    user: string;
}

export const getAllImages: RequestHandler = async (req, res, next) => {
    const listOfImgs = await Image.find()
    res.json({ listOfImgs })
    // REFACTOR NEEDED
    // zmienić array zeby nie dawalo id imageId
}

export const postImage: RequestHandler = async (req, res, next) => {
    const userExist = await User.findOne({username: req.body.user}).exec()
    if (!userExist) {
        return res.status(401).json({message: 'User doesn\'t exists'})
    }
    try {
        const result = await imagekitUploadHandler({
            folder: 'images-app',
            file: req.file?.buffer as Buffer, 
            fileName : req.file?.originalname as string
        })
        const imageObj: ImageType = {
            imagekitId: result.fileId,
            src: result.url,
            title: req.body.title,
            description: req.body.description,
            user: userExist.username
        }
        await Image.create(imageObj)
        res.status(201).json({message: 'New image successfully created!'})
    } catch (err) {
        console.log(err)
    }
}

export const updateImage: RequestHandler = async (req, res, next) => {
    const { imageId } = req.params
    const { updatedTitle, updatedDescription } = req.body;
    const image = await Image.findOne({_id: imageId})
    if (!image) {
        return res.status(404).json({message: "Image doesn't exists."})
    }
    image.title = updatedTitle;
    image.description = updatedDescription;
    image.save()
    res.status(201).json({message: "Image data succesfully updated!"})
}


export const deleteImage: RequestHandler = async (req, res, next) => {
    const { imageId } = req.params;
    try {
        const imagekitId = await Image.findById(imageId)
        await imagekitDeleteHandler(imagekitId!.imagekitId)
        await Image.deleteOne({_id: imageId})
        res.json({message: 'Image successfully deleted'})
    } catch (err) {
        console.log(err)
    }
}