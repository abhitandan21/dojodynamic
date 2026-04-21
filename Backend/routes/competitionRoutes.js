import express from "express";
import Competition from "../model/Competition.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ================= EVENT COMPETITIONS LIST ================= */
/* Ye route competition page ke liye hai */
router.get("/", async (req, res) => {
  try {
    const competitions = await Competition.find({
      title: { $exists: true, $ne: "" },
    }).sort({ createdAt: -1 });

    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= STUDENT CERTIFICATE UPLOAD ================= */
/* Ye route dashboard ke liye hai */
router.post("/student", upload.single("file"), async (req, res) => {
  try {
    const { studentId, name, kata, kumite } = req.body;

    if (!studentId || !name) {
      return res.status(400).json({
        message: "Student ID and competition name required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "PDF/Image file required",
      });
    }

    const competition = await Competition.create({
      studentId,
      name,
      kata,
      kumite,
      fileUrl: `/uploads/${req.file.filename}`,
      type: "student-upload",
    });

    res.status(201).json(competition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= STUDENT COMPETITION HISTORY ================= */
/* Ye route dashboard me student ke uploaded competitions dikhane ke liye hai */
router.get("/student/:studentId", async (req, res) => {
  try {
    const competitions = await Competition.find({
      studentId: req.params.studentId,
      fileUrl: { $exists: true },
    }).sort({ createdAt: -1 });

    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
