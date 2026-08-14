import express from "express";
import Competition from "../model/Competition.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ==========================================
   EVENT COMPETITIONS LIST
   ========================================== */

router.get("/", async (req, res) => {
  try {
    const competitions =
      await Competition.find({
        title: {
          $exists: true,
          $ne: "",
        },
      }).sort({
        createdAt: -1,
      });

    res.json(competitions);

  } catch (error) {
    console.error(
      "Get Competitions Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
});

/* ==========================================
   STUDENT COMPETITION CERTIFICATE UPLOAD
   POST /api/competitions/student
   ========================================== */

router.post(
  "/student",
  upload.single("file"),
  async (req, res) => {
    try {

      const {
        studentId,
        name,
        kata,
        kumite,
      } = req.body;

      // ========================================
      // VALIDATION
      // ========================================

      if (!studentId || !name) {
        return res.status(400).json({
          message:
            "Student ID and competition name required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message:
            "PDF/Image file required",
        });
      }

      // ========================================
      // DEBUG
      // IMPORTANT:
      // Sirf upload location check karega.
      // Existing files ko touch nahi karega.
      // ========================================

      console.log(
        "=========================================="
      );

      console.log(
        "COMPETITION CERTIFICATE UPLOAD DEBUG"
      );

      console.log(
        "Current Working Directory:",
        process.cwd()
      );

      console.log(
        "Uploaded File:",
        req.file
      );

      console.log(
        "Uploaded File Path:",
        req.file.path
      );

      console.log(
        "Uploaded File Filename:",
        req.file.filename
      );

      console.log(
        "Uploaded File Destination:",
        req.file.destination
      );

      console.log(
        "=========================================="
      );

      // ========================================
      // SAVE DATABASE RECORD
      // ========================================

      const competition =
        await Competition.create({
          studentId,
          name,
          kata,
          kumite,
          fileUrl:
            `/uploads/${req.file.filename}`,
          type: "student-upload",
        });

      // ========================================
      // SUCCESS
      // ========================================

      res.status(201).json(
        competition
      );

    } catch (error) {
      console.error(
        "Competition Certificate Upload Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/* ==========================================
   STUDENT COMPETITION HISTORY
   ========================================== */

router.get(
  "/student/:studentId",
  async (req, res) => {
    try {
      const competitions =
        await Competition.find({
          studentId:
            req.params.studentId,

          fileUrl: {
            $exists: true,
          },
        }).sort({
          createdAt: -1,
        });

      res.json(competitions);

    } catch (error) {
      console.error(
        "Get Student Competition History Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;