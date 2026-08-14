import express from "express";
import multer from "multer";
import Belt from "../model/Belt.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ==========================================
   STUDENT BELT CERTIFICATE UPLOAD
   POST /api/belts
   ========================================== */

router.post("/", (req, res) => {
  upload.single("file")(req, res, async (error) => {
    try {
      // ========================================
      // MULTER ERROR
      // ========================================

      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          message:
            "File 5MB se jyada nahi honi chahiye",
        });
      }

      // ========================================
      // OTHER UPLOAD ERROR
      // ========================================

      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      // ========================================
      // REQUEST DATA
      // ========================================

      const {
        studentId,
        beltName,
        certNo,
      } = req.body;

      // ========================================
      // VALIDATION
      // ========================================

      if (!studentId) {
        return res.status(400).json({
          message:
            "Student ID missing hai",
        });
      }

      if (!beltName || !certNo) {
        return res.status(400).json({
          message:
            "Belt name aur certificate number required hai",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message:
            "Certificate PDF/Image required hai",
        });
      }

      // ========================================
      // DEBUG
      // IMPORTANT:
      // Ye sirf location check karega.
      // Existing files ko touch nahi karega.
      // ========================================

      console.log(
        "=========================================="
      );

      console.log(
        "CERTIFICATE UPLOAD DEBUG"
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

      const belt = await Belt.create({
        studentId,
        beltName,
        certNo,
        fileUrl:
          `/uploads/${req.file.filename}`,
      });

      // ========================================
      // SUCCESS
      // ========================================

      res.status(201).json(belt);

    } catch (err) {
      console.error(
        "Belt Certificate Upload Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  });
});

/* ==========================================
   GET STUDENT BELT CERTIFICATES
   GET /api/belts/:studentId
   ========================================== */

router.get(
  "/:studentId",
  async (req, res) => {
    try {
      const belts =
        await Belt.find({
          studentId:
            req.params.studentId,
        }).sort({
          createdAt: -1,
        });

      res.json(belts);

    } catch (error) {
      console.error(
        "Get Belt Certificates Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;