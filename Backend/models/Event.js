import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  files: [{ type: { type: String }, url: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Event", EventSchema);