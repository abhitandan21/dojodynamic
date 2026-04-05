import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";


// routes import
import authRoutes from "./routes/authRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";


dotenv.config();
const app = express();

app.use("/api/blogs", blogRoutes);



// middleware
app.use(cors());
app.use(express.json());

//  routes 
app.use("/api/blogs", blogRoutes);
// routes
app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/form", formRoutes);

// env variables
const PORT = process.env.PORT || 4000;
const URI = process.env.MONGODB_URI;

// DB connection
const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB ✅");
  } catch (error) {
    console.log("MongoDB Error ❌:", error);
    process.exit(1);
  }
};

connectDB();



// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});