import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Non-Active"
    },
    wnumber:{
      type: Number,
      required: true,
    },
    upi_id: {
      type: String,
      required: true,
    },
    upi_name: {
      type: String,
      required: true,
    },
  }
);

export const User = mongoose.models.User||mongoose.model('User', UserSchema);