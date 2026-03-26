import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB ✅");
  } catch (error) {
    console.log("MongoDB Error ❌:", error);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});