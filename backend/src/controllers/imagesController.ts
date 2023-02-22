import { RequestHandler, Request, Response, NextFunction } from 'express'
import { imagekitDeleteHandler, imagekitUploadHandler } from '../lib/imagekit'
import Image from '../models/Image';
import User from '../models/User';
import asyncHandler from 'express-async-handler';
interface ImageType {
    imagekitId: string;
    src: string;
    title: string;
    description: string;
    user: string;
}

export const getAllImages: RequestHandler = asyncHandler(async (req, res, next) => {
    const page = +req.query.page! || 1
    const imgsCount = await Image.count()
    const imgsPerPage = 4


    const listOfImgs = await Image.find().sort({ "createdAt": -1} ).limit(imgsPerPage * page)
    res.json({ listOfImgs, imgsCount })
    // REFACTOR NEEDED
    // zmienić array zeby nie dawalo id imageId
})

export const postImage: RequestHandler = asyncHandler(async (req, res, next) => {
        const userExist = await User.findOne({username: req.body.user}).exec()
        if (!userExist) {
            res.status(401).json({message: 'User doesn\'t exists'})
            return;
        }
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
    }
)

export const updateImage: RequestHandler = asyncHandler(async (req, res, next) => {
        const { imageId } = req.params
        const { updatedTitle, updatedDescription } = req.body;
        const image = await Image.findOne({_id: imageId})
        if (!image) {
            res.status(404).json({message: "Image doesn't exists."})
            return;
        }
        image.title = updatedTitle;
        image.description = updatedDescription;
        image.save()
        res.status(201).json({message: "Image data succesfully updated!"})
})



export const deleteImage: RequestHandler = asyncHandler(async (req, res, next) => {
        const { imageId } = req.params;
        const imagekitId = await Image.findById(imageId)
        await imagekitDeleteHandler(imagekitId!.imagekitId)
        await Image.deleteOne({_id: imageId})
        res.json({message: 'Image successfully deleted'})
    }
)