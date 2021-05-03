'use strict';
 // resolver
import postResolver from './postResolver.js';
import userResolver from './userResolver.js';
import commentsResolver from './commentsResolver.js';
import imageResolver from './imageResolver.js';
import messageResolver from './messageResovler.js';

export default {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postResolver.Query,
    ...userResolver.Query,
    ...imageResolver.Query,
    ...messageResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...commentsResolver.Mutation,
    ...imageResolver.Mutation,
    ...messageResolver.Mutation,
  },
  Subscription: {
    ...messageResolver.Subscription
  }
};
