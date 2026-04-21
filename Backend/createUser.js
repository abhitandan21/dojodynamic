import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js"; // ✅ correct path

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const hashedPassword = await bcrypt.hash("123456", 10);

await User.create({
  email: "student@test.com",
  password: hashedPassword,
});

console.log("User created ✅");
process.exit();