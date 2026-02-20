import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    post: {
        type: String,
        required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    image:{
      type:String,
    }
  },{
    timestamps: true
  }
);

export const posts = mongoose.models.posts||mongoose.model('posts', postSchema);