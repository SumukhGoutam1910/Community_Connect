import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video', 'document'], required: true },
  url: { type: String, required: true },
  publicId: String, // Cloudinary public ID for deletion
  originalName: String,
  mimeType: String,
  size: Number
});

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  media: [MediaSchema], // Array of media objects with detailed info
  likes: { type: Number, default: 0 }, // Changed from array to number count
  commentCount: { type: Number, default: 0 }, // Added comment count
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
});

export default mongoose.model("Post", PostSchema);