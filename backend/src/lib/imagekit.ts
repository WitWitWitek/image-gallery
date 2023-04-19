import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_ID as string,
});

interface uploadObjType {
  folder: string;
  file: Buffer;
  fileName: string;
}

const imagekitUploadHandler = (optionsObj: uploadObjType) => {
  return new Promise((resolve, reject) => {
    imagekit
      .upload(optionsObj)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const imagekitDeleteHandler = (id: string) => {
  return new Promise((resolve, reject) => {
    imagekit
      .deleteFile(id)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

export { imagekitUploadHandler, imagekitDeleteHandler };
export default imagekit;
