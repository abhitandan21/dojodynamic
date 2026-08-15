// Backend/routes/achievementRoutes.js
import express from "express";
import multer from "multer";
import Achievement from "../model/Achievement.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/competition", (req, res) => {
  upload.single("file")(req, res, async (error) => {
    try {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File 5MB se jyada nahi honi chahiye",
          });
        }

        return res.status(400).json({
          message: error.message,
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


/* ==========================================
   ACHIEVEMENT CERTIFICATE RE-UPLOAD
   PUT /api/achievements/:id/re-upload
   ========================================== */

router.put(
  "/:id/re-upload",
  (req, res) => {
    upload.single("file")(req, res, async (error) => {
      try {
        // ========================================
        // MULTER ERROR
        // ========================================

        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
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
        // FIND EXISTING ACHIEVEMENT
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
        // UPDATE ONLY FILE + STATUS
        // ========================================

        existingAchievement.fileUrl =
          `/uploads/${req.file.filename}`;

        existingAchievement.status =
          "pending";

        await existingAchievement.save();

        // ========================================
        // SUCCESS
        // ========================================

        res.json({
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

        res.status(500).json({
          message: err.message,
        });
      }
    });
  }
);




export default router;
