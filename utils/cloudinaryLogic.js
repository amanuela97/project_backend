'use strict';
import cloudinary from './cloudinary.js';

const cloudinaryUpload = async (createReadStream, id) => {
  return new Promise((resolve, reject) => {
    const cloudinaryUploadStream =  cloudinary.uploader.upload_stream(
      {
      resource_type: 'auto',
      folder: "avatars",
      public_id: id,
      overwrite: true,
      eager:[{width: 200, height: 200, crop: "thumb",gravity: "face", radius: "max"}],
      } ,
        (error, result) => {
          console.log('stream', result);
          if(error){
            console.log('stream erro',error);
            reject.toString(error)
          }
          resolve(result);
        }
    );
    createReadStream().pipe(cloudinaryUploadStream);
  });
}

const cloudinaryDelete = async (public_id) => {
  return await cloudinary.uploader.destroy(public_id);
}

const cloudinaryBase64 = async (base64) => {
    const uploadResponse =  await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
      upload_preset: "project_posts",

    });
    return uploadResponse;
}

export {cloudinaryUpload, cloudinaryDelete, cloudinaryBase64};
