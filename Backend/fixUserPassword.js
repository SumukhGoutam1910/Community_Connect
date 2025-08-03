import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import env from "dotenv";
env.config();

async function fixPasswordField() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: "john@example.com" });
  if (!user) {
    console.log("User not found");
    await mongoose.disconnect();
    return;
  }
  console.log("User found:", user.toObject());
  const plainPassword = user.get('password');
  if (plainPassword && typeof plainPassword === 'string') {
    const hashed = await bcrypt.hash(plainPassword, 10);
    user.passwordHash = hashed;
    // Remove the password field
    user.set('password', undefined, { strict: false });
    await user.save();
    console.log("Password field renamed to passwordHash and hashed for john@example.com");
  } else if (user.passwordHash) {
    console.log("User already has a passwordHash field.");
  } else {
    console.log("User has no password or passwordHash field, or password is not a string.");
  }
  await mongoose.disconnect();
}

fixPasswordField();
