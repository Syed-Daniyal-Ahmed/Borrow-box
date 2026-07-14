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
    image: {
      type: String,
    },
    qr: {
      type: String
    },
    status: {
      type: String,
      enum: ["Open", "Contacted", "Shipped", "Delivered", "Confirmed"],
      default: "Open"
    },
    // Delivery System Fields
    receiverEmail: {
      type: String,
      default: null,
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    deliveryConfirmedAt: {
      type: Date,
      default: null,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    deliveryAttempts: {
      type: Number,
      default: 0,
    }
  }, {
  timestamps: true
}
);

export const posts = mongoose.models.posts || mongoose.model('posts', postSchema);