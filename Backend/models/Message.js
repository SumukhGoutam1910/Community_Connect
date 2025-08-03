import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  media: [{ type: { type: String }, url: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);