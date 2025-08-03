import mongoose from "mongoose";
import User from "./models/User.js";
import env from "dotenv";
env.config();

async function listUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log("All users:", users.map(u => ({ email: u.email, username: u.username, _id: u._id, password: u.password, passwordHash: u.passwordHash })));
  await mongoose.disconnect();
}

listUsers();
