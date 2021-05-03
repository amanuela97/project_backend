import pkk from 'apollo-server-express';
const { AuthenticationError, UserInputError } = pkk;
import { login } from '../passport/authenticate.js';
import userModel from '../models/user.js';
import bcrypt from 'bcrypt';
import {Loginschema, Registerschema} from '../utils/validate.js';
import generateToken from '../utils/generateToken.js';
import auth from '../utils/auth.js'
import {UpdateUserSchema} from '../utils/validate.js';

export default {
  Query: {
    getUser: async (_,{id}, { user }) => {
      //check authentication
      auth(user);
      try {
        return await userModel.findById({ _id: id}).exec();
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    login: async (_, args, { req, res }) => {
      console.log('login query');
      // validate user data
      const {error} = Loginschema.validate({username: args.username, password: args.password});
      if (error !== undefined) {
        throw new UserInputError(error.details[0].message);
      }
    try{
      // inject username and password to req.body for passport checkup
      req.body = args;
      const authResponse = await login(req, res);
      return {
        id: authResponse.user._id,
        ...authResponse.user,
        token: authResponse.token,
      };
    } catch (e) {
      throw new AuthenticationError("invalid credentials");
    }
  },
    registerUser: async (_,{ username, email, password, confirmPassword }) => {
      console.log('registerUser resolver');
        // Validate user data
        const {error } = Registerschema.validate({
          username,
          email,
          password,
          confirmPassword
        });

        if (error !== undefined) {
          throw new UserInputError(error.details[0].message);
        }
        try {
         // Make sure username doesnt already exist
        const checkUser = await userModel.findOne({username});
        if (checkUser) {
          throw new UserInputError('username already exists');
        }

        //make sure email isnt taken
        const checkEmail = await userModel.findOne({email});
        if (checkEmail) {
          throw new UserInputError('email address already exists');
        }

         // hash password and create an auth token
        const hash = await bcrypt.hash(password, 12);
        const userWithHash = {
          email,
          username,
          password,
          isAdmin: false,
          password: hash,
        };
        const newUser = new userModel(userWithHash);
        const result = await newUser.save();
        const token = generateToken(result._id, result._doc.email, result._doc.username);
        return {
          ...result._doc,
          id: result._id,
          token
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    updateUser: async (_,{username, email ,bio, public_id, url}, {user}) => {
      //check authentication
      auth(user);

      //validate userInfo
      const {error} = UpdateUserSchema.validate({
        username,
        email,
        bio,
        public_id,
        url
      });
      if (error !== undefined) {
        throw new UserInputError(error.details[0].message);
      }

       // Make sure username doesnt already exist
       const checkUser = await userModel.findOne({username});
       if (checkUser) {
         if(checkUser.id !== user.id){
            throw new UserInputError('username already exists');
          }
       }

      //make sure email isnt taken
      const checkEmail = await userModel.findOne({email});
      if (checkEmail) {
        if(checkEmail.id !== user.id){
          throw new UserInputError('email address already exists');
        }
      }

      try {
        const newUser = {
          username,
          email,
          bio,
          public_id,
          url,
        };
        return userModel.findByIdAndUpdate(user.id,newUser, {new:true})
      } catch (error) {
        throw new Error(error);
      }
    }
  },
};
