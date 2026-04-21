import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// new added 
import path from "path";
import { fileURLToPath } from "url";
import beltRoutes from "./routes/beltRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";



// ✅ models import (VERY IMPORTANT)
import Student from "./model/Student.js";
import Competition from "./model/Competition.js";
import Lathi from "./model/Lathi.js";
import Nunchaku from "./model/Nunchaku.js";



// routes import
import authRoutes from "./routes/authRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

// enquiry import 
import enquiryRoutes from "./routes/enquiryRoutes.js";

// students details 
import studentRoutes from "./routes/student.js";




dotenv.config();
const app = express();

// new added 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());

// new added 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/belts", beltRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/achievements", achievementRoutes);


// routes
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/form", formRoutes);

// enquiry routes 
app.use("/api/enquiries", enquiryRoutes);

// students detsila
app.use("/api/students", studentRoutes);


//user login
app.use("/api/auth", authRoutes);

// env variables
const PORT = process.env.PORT || 4001;
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


// =========================
// ✅ STUDENT CORNER ROUTES
// =========================

// students
app.get("/api/students", async (req, res) => {
  try {
    const data = await Student.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/students/:id", async (req, res) => {
  try {
    const data = await Student.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// competition
app.get("/api/competition", async (req, res) => {
  try {
    const data = await Competition.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/competition/:id", async (req, res) => {
  try {
    const data = await Competition.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// lathi
app.get("/api/lathi", async (req, res) => {
  try {
    const data = await Lathi.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// nunchaku
app.get("/api/nunchaku", async (req, res) => {
  try {
    const data = await Nunchaku.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// helpdesk
app.listen(4001, () => {
  console.log("Server running on port 4001");
});


// new added 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});