import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email:    { type: String, unique: true, required: true },
  passwordHash: String,
  name: String,
  avatarUrl: String,
  title: String, // fixed typo here
  location: String,
  bio: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profile: {
    education: [{
      school: String,
      degree: String,
      duration: String, // Frontend sends this
      grade: String,    // Frontend sends this
      start: Date,      // Keep for compatibility
      end: Date         // Keep for compatibility
    }],
    experience: [{
      company: String,
      title: String,
      start: String,    // Frontend sends month strings like "2023-01"
      end: String,      // Frontend sends month strings like "2023-01"
      description: String
    }],
    skills: [String],
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String
    }
  },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'users' });

export default mongoose.model("User", UserSchema);