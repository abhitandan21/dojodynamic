import express from "express";
import multer from "multer";
import Belt from "../model/Belt.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", (req, res) => {
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

      const { studentId, beltName, certNo } = req.body;

      if (!studentId) {
        return res.status(400).json({ message: "Student ID missing hai" });
      }

      if (!beltName || !certNo) {
        return res.status(400).json({
          message: "Belt name aur certificate number required hai",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Certificate PDF/Image required hai",
        });
      }

      const belt = await Belt.create({
        studentId,
        beltName,
        certNo,
        fileUrl: `/uploads/${req.file.filename}`,
      });

      res.status(201).json(belt);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
});

router.get("/:studentId", async (req, res) => {
  try {
    const belts = await Belt.find({ studentId: req.params.studentId }).sort({
      createdAt: -1,
    });

    res.json(belts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
