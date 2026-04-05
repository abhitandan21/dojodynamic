import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    default: "Admin"
  }
});

export default mongoose.model("Blog", blogSchema);