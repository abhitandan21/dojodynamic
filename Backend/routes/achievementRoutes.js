// Backend/routes/achievementRoutes.js

import express from "express";
import multer from "multer";
import fs from "fs";
import Achievement from "../model/Achievement.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ==========================================
   STUDENT COMPETITION CERTIFICATE UPLOAD
   POST /api/achievements/competition
   ========================================== */

router.post("/competition", (req, res) => {
  upload.single("file")(req, res, async (error) => {
    try {
      // ========================================
      // MULTER ERROR
      // ========================================

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message:
              "File 5MB se jyada nahi honi chahiye",
          });
        }

        return res.status(400).json({
          message: error.message,
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
            "Student ID aur competition name required hai",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message:
            "PDF/Image file required hai",
        });
      }

      // ========================================
      // CLEAN INPUT
      // ========================================

      const cleanName = name.trim();
      const cleanKata = (kata || "").trim();
      const cleanKumite = (kumite || "").trim();

      // ========================================
      // DUPLICATE CHECK
      //
      // Same:
      // Student + Competition + Kata + Kumite
      //
      // = Duplicate
      // ========================================

      const existingAchievement =
        await Achievement.findOne({
          studentId: studentId,
          type: "competition",
          title: cleanName,
          kata: cleanKata,
          kumite: cleanKumite,
        });

      // ========================================
      // DUPLICATE FOUND
      // ========================================

      if (existingAchievement) {

        // Delete newly uploaded duplicate file
        try {
          if (req.file.path) {
            await fs.promises.unlink(
              req.file.path
            );
          }
        } catch (deleteError) {
          console.error(
            "Duplicate competition file delete error:",
            deleteError
          );
        }

        return res.status(409).json({
          message:
            "Ye competition certificate already uploaded hai. Duplicate certificate upload nahi kiya ja sakta.",

          existingAchievement: {
            _id:
              existingAchievement._id,

            title:
              existingAchievement.title,

            kata:
              existingAchievement.kata,

            kumite:
              existingAchievement.kumite,

            status:
              existingAchievement.status,
          },
        });
      }

      // ========================================
      // SAVE DATABASE RECORD
      // ========================================

      const achievement =
        await Achievement.create({
          studentId,
          type: "competition",
          title: cleanName,
          kata: cleanKata,
          kumite: cleanKumite,
          fileUrl:
            `/uploads/${req.file.filename}`,
        });

      // ========================================
      // SUCCESS
      // ========================================

      return res.status(201).json(
        achievement
      );

    } catch (err) {

      console.error(
        "Competition Certificate Upload Error:",
        err
      );

      // ========================================
      // CLEANUP FILE IF DATABASE SAVE FAILS
      // ========================================

      try {
        if (req.file?.path) {
          await fs.promises.unlink(
            req.file.path
          );
        }
      } catch (deleteError) {
        console.error(
          "Competition upload cleanup error:",
          deleteError
        );
      }

      return res.status(500).json({
        message: err.message,
      });
    }
  });
});


/* ==========================================
   GET STUDENT COMPETITION CERTIFICATES
   GET /api/achievements/student/:studentId
   ========================================== */

router.get(
  "/student/:studentId",
  async (req, res) => {
    try {
      const achievements =
        await Achievement.find({
          studentId:
            req.params.studentId,

          type: "competition",
        }).sort({
          createdAt: -1,
        });

      res.json(achievements);

    } catch (error) {

      console.error(
        "Get Competition Achievements Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


/* ==========================================
   ACHIEVEMENT CERTIFICATE RE-UPLOAD
   PUT /api/achievements/:id/re-upload
   ========================================== */

router.put(
  "/:id/re-upload",
  async (req, res) => {
    try {
      // ========================================
      // FIND EXISTING ACHIEVEMENT FIRST
      // IMPORTANT:
      // File upload se pehle status check hoga
      // ========================================

      const existingAchievement =
        await Achievement.findById(
          req.params.id
        );

      if (!existingAchievement) {
        return res.status(404).json({
          message:
            "Competition certificate record not found",
        });
      }

      // ========================================
      // ONLY REJECTED CERTIFICATE CAN RE-UPLOAD
      // ========================================

      if (
        existingAchievement.status !==
        "rejected"
      ) {
        return res.status(400).json({
          message:
            "Sirf rejected certificate ko re-upload kiya ja sakta hai.",
        });
      }

      // ========================================
      // NOW ACCEPT FILE
      // ========================================

      upload.single("file")(
        req,
        res,
        async (error) => {
          try {
            // ========================================
            // MULTER ERROR
            // ========================================

            if (
              error instanceof multer.MulterError
            ) {
              if (
                error.code ===
                "LIMIT_FILE_SIZE"
              ) {
                return res.status(400).json({
                  message:
                    "File 3MB se jyada nahi honi chahiye",
                });
              }

              return res.status(400).json({
                message: error.message,
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
            // FILE REQUIRED
            // ========================================

            if (!req.file) {
              return res.status(400).json({
                message:
                  "New certificate file required hai",
              });
            }

            // ========================================
            // UPDATE ONLY FILE + STATUS
            // ========================================

            existingAchievement.fileUrl =
              `/uploads/${req.file.filename}`;

            existingAchievement.status =
              "pending";

            // ========================================
            // REVIEW REMARK
            // Keep existing review remark
            // for dashboard compatibility
            // ========================================

            await existingAchievement.save();

            // ========================================
            // SUCCESS
            // ========================================

            return res.json({
              success: true,

              message:
                "Certificate re-uploaded successfully. Waiting for admin approval.",

              achievement:
                existingAchievement,
            });

          } catch (err) {
            console.error(
              "Achievement Certificate Re-upload Error:",
              err
            );

            return res.status(500).json({
              message: err.message,
            });
          }
        }
      );

    } catch (err) {
      console.error(
        "Achievement Certificate Re-upload Find Error:",
        err
      );

      return res.status(500).json({
        message: err.message,
      });
    }
  }
);


export default router;