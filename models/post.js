'use strict';
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  username: String,
  hidden: {
    type: Boolean,
    default: false,
  },
  body: {
    public_id: String,
    url: String
  },
  comments: [
    {
      body: String,
      username: String,
      userID: String,
      createdAt: Date
    },
  ] ,
  likes: [
    {
      username: String,
      createdAt: Date,
    }
  ],
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
}, {timestamps: true})

export default mongoose.model('Post', postSchema);
