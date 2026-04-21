import express from "express";
import multer from "multer";
import Achievement from "../model/Achievement.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/competition", (req, res) => {
  upload.single("file")(req, res, async (error) => {
    try {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          message: "File 40KB se jyada nahi honi chahiye",
        });
      }

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const { studentId, name, kata, kumite } = req.body;

      if (!studentId || !name) {
        return res.status(400).json({
          message: "Student ID aur competition name required hai",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "PDF/Image file required hai",
        });
      }

      const achievement = await Achievement.create({
        studentId,
        type: "competition",
        title: name,
        kata,
        kumite,
        fileUrl: `/uploads/${req.file.filename}`,
      });

      res.status(201).json(achievement);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
});

router.get("/student/:studentId", async (req, res) => {
  try {
    const achievements = await Achievement.find({
      studentId: req.params.studentId,
      type: "competition",
    }).sort({ createdAt: -1 });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
