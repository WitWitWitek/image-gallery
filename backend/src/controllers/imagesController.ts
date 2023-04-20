import { RequestHandler } from "express";
import { imagekitDeleteHandler, imagekitUploadHandler } from "../lib/imagekit";
import Image from "../models/Image";
import User from "../models/User";
import asyncHandler from "express-async-handler";

interface ImagekitResponse {
  fileId: string;
  url: string;
}

export const getAllImages: RequestHandler = asyncHandler(async (req, res) => {
  const page = req.query.page ? +req.query.page : 1;
  const imgsCount = await Image.count();
  const imgsPerPage = 4;

  const listOfImgs = await Image.find()
    .sort({ createdAt: -1 })
    .limit(imgsPerPage * page);
  res.json({ listOfImgs, imgsCount });
});

export const getUserImages: RequestHandler = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const page = req.query.page ? +req.query.page : 1;
  const imgsCount = await Image.find({ user }).count();
  const imgsPerPage = 4;

  const listOfImgs = await Image.find({ user })
    .sort({ createdAt: -1 })
    .limit(imgsPerPage * page);
  res.json({ listOfImgs, imgsCount });
});

export const postImage: RequestHandler = asyncHandler(async (req, res) => {
  const userExist = await User.findOne({ username: req.body.user }).exec();
  if (!userExist) {
    res.status(401).json({ message: "User doesn't exists" });
    return;
  }
  const result = (await imagekitUploadHandler({
    folder: "images-app",
    file: req.file?.buffer as Buffer,
    fileName: req.file?.originalname as string,
  })) as ImagekitResponse;

  const imageObj = {
    imagekitId: result.fileId,
    src: result.url,
    title: req.body.title,
    description: req.body.description,
    user: userExist.username,
  };
  try {
    await Image.create(imageObj);
    res.status(201).json({ message: "New image successfully created!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occured!" });
  }
});

export const updateImage: RequestHandler = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const { updatedTitle, updatedDescription } = req.body;
  const image = await Image.findOne({ _id: imageId });
  if (!image) {
    res.status(404).json({ message: "Image doesn't exists." });
    return;
  }
  image.title = updatedTitle;
  image.description = updatedDescription;
  image.save();
  res.status(201).json({ message: "Image data succesfully updated!" });
});

export const deleteImage: RequestHandler = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const image = await Image.findById(imageId);
  if (!image) {
    res.status(404).json({ message: "Image doesn't exists." });
    return;
  }
  await imagekitDeleteHandler(image.imagekitId);
  await Image.deleteOne({ _id: imageId });
  res.json({ message: "Image successfully deleted" });
});
