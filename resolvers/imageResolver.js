'use strict';
import {cloudinaryUpload,cloudinaryDelete} from '../utils/cloudinaryLogic.js';
import  auth from '../utils/auth.js';
export default {
  Query: {
    hello: () => "hello world! :)",
  },
  Mutation: {
    uploadFile: async (_, {file}, {user}) => {
      //check if authenticated
      auth(user);
      try {
        const {createReadStream} = await file;
        const result = await cloudinaryUpload(createReadStream, user.id);
        return { url: result.eager[0].url, public_id: result.public_id};

      } catch (error) {
        throw new Error(error);
      }
    },
    deleteFile: async (_, {public_id}, {user}) => {
      //check if authenticated
      auth(user);
      try {
        //delete file/image
        const result = await cloudinaryDelete(public_id);
        console.log('result',result);
        return result

      } catch (error) {
        throw new Error(error);
      }
    }
  },
};
