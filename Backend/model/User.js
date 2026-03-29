import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true },
  password: String,
  role: { type: String, default: "student" }
});

export default mongoose.model("User", userSchema);