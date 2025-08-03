import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['image', 'video', 'doc'] },
  url: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("File", FileSchema);