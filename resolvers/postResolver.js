'use strict';
import postModel from '../models/post.js';
import auth from '../utils/auth.js';
import pkk from 'apollo-server-express';
const { AuthenticationError, UserInputError } = pkk;
import {Postschema, UpdatePostSchema} from '../utils/validate.js';
import getImage from '../utils/carbon.js';


export default  {
  Query: {
    async getPosts(_ ,{user}) {
      //check auth
      auth(user);
      try {
        const posts = await postModel.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPaginatedPosts(_, {limit,page, sort},{user}) {
      //check auth
      auth(user);
      try {
        const pagee = page || 0;
        const total = await postModel.countDocuments({});
        const sorting = sort === 'oldest' ? {createdAt: 1} : (sort === 'latest' ? {createdAt: -1} : (sort === 'likes' ? {"likes_count": -1} : {"comments_count": -1}))
        const result = await postModel.aggregate([
          {
            $sort: sorting
          },
          {
            $match: {hidden: false}
          },
          {
              $addFields: { pageCount: Math.ceil(total / limit) }
          },
          {
            $addFields:  { likes_count: {$size: { "$ifNull": [ "$likes", [] ] } }},
          },
          {
            $addFields:  { comments_count: {$size: { "$ifNull": [ "$comments", [] ] } } }
          },
        ]).skip((pagee * limit)).limit(limit);
        return result.map(v => ({...v ,id: v._id}));
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserPaginatedPosts(_, { limit,page, sort }, {user}) {
      //check auth
      auth(user);
      try {
        const pagee = page || 0;
        const total = await postModel.countDocuments({});
        const sorting = sort === 'oldest' ? {createdAt: 1} : (sort === 'latest' ? {createdAt: -1} : (sort === 'likes' ? {"likes_count": -1} : {"comments_count": -1}))
        const result = await postModel.aggregate([
          {
              $addFields: { pageCount: Math.ceil(total / limit) }
          },
          {
            $addFields:  { likes_count: {$size: { "$ifNull": [ "$likes", [] ] } }, comments_count: {$size: { "$ifNull": [ "$comments", [] ] } } },
          },
          {
            $addFields:  { comments_count: {$size: { "$ifNull": [ "$comments", [] ] } } }
          },
          {
              $sort: sorting,
          },
          {
            $match: {user: user._id}
          }
        ]).skip((pagee * limit)).limit(limit);
        return result.map(v => ({...v ,id: v._id}));
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId },{user}) {
      //check auth
      auth(user);
      try {
        const post = await postModel.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { title, body, description, hidden }, {user}) {
      //check if authenticated
      auth(user);

      //validate post
      const {error} = Postschema.validate({title,body,description,hidden});
      if (error !== undefined) {
        throw new UserInputError(error.details[0].message);
      }

      try {
         //carbon request and base64 upload
        const {public_id,url}  = await getImage(body);
        const newPost = new postModel({
          title: title,
          description: description,
          body: {
            public_id,
            url
          },
          hidden: hidden,
          user: user.id,
          username: user.username,
        });

        const post = await newPost.save();

        pubsub.publish('NEW_POST', {
          newPost: post
        });

        return post;
      } catch (error) {

      }
    },
    async updatePost (_, {title,description, hidden, postId }, {user}){
       //check if authenticated
       auth(user);

       //validate post
       const {error} = UpdatePostSchema.validate({title,description,hidden});
       if (error !== undefined) {
         throw new UserInputError(error.details[0].message);
       }

       try {

         const newPost = {
           title: title,
           description: description,
           hidden: hidden,
         }


         return postModel.findByIdAndUpdate(postId, newPost, {new:true});
       } catch (error) {
        throw new Error(error);
       }
    },
    async deletePost(_, { postId }, {user}) {
      //check if authenticated
      auth(user);

      try {
        const post = await postModel.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, {user}) {
      //check if authenticated
      auth(user);
      try {
          const {username} = user;
          const post = await postModel.findById(postId);
          if (post) {
            if (post.likes.find((like) => like.username === username)) {
              // Post already liked, so unlike it
              post.likes = post.likes.filter((like) => like.username !== username);
            } else {
              // Not liked, so like post
              post.likes.push({
                username,
                createdAt: new Date()
              });
            }

            await post.save();
            return post;
          } else throw new UserInputError('Post not found');
        } catch (error) {
          throw new Error(err);
        }
    }
  }
};

