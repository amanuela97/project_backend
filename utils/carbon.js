'user strcit';
import fetch from 'node-fetch';
import {cloudinaryBase64} from '../utils/cloudinaryLogic.js';

const getImage = async (code) => {
  try {

      var raw = JSON.stringify({"code":code});

      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
      };
      //fetch image from carbon
      const response = await fetch("https://carbonara.vercel.app/api/cook", requestOptions);
      const result = await response.buffer();
      const base64 =  result.toString('base64');
      //upload image to cloudinary as base64
      const uploadResponse = cloudinaryBase64(base64);
      return uploadResponse;
  }
  catch (error) {
    throw new Error(error);
  }

};

export default getImage;
