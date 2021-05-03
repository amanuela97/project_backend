'use strict';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email:  {
    type: String,
    lowercase: true,
    unique: true,
  },
  public_id: {
    type: String,
    default: "rlzbd17hswnhijpdmsyy",
  },
  url: {
    type: String,
    default:"https://res.cloudinary.com/metropolia-fi/image/upload/ar_1:1,b_rgb:c1c6cd,bo_5px_solid_rgb:ffffff,c_thumb,g_auto,r_max,w_200/v1619718397/avatars/rlzbd17hswnhijpdmsyy.jpg",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    default: '',
  }
}, {timestamps: true})

export default mongoose.model('User', userSchema);
