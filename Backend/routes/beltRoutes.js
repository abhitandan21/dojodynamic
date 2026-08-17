import express from "express";
import multer from "multer";
import fs from "fs";
import Belt from "../model/Belt.js";
import upload from "../middleware/upload.js";
import path from "path";

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
        beltName,
        certNo,
      } = req.body;

      // ========================================
      // VALIDATION
      // ========================================

      if (!studentId) {
        return res.status(400).json({
          message: "Student ID missing hai",
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
      // CLEAN INPUT
      // ========================================

      const cleanBeltName = beltName.trim();
      const cleanCertNo = certNo.trim();

      // ========================================
      // DUPLICATE CHECK
      //
      // Same Student + Same Belt + Same Cert No
      // ========================================

      const existingBelt = await Belt.findOne({
        studentId: studentId,
        beltName: cleanBeltName,
        certNo: cleanCertNo,
      });

      // ========================================
      // DUPLICATE FOUND
      // ========================================

      if (existingBelt) {

        // Delete newly uploaded duplicate file
        try {
          if (req.file.path) {
            await fs.promises.unlink(
              req.file.path
            );
          }
        } catch (deleteError) {
          console.error(
            "Duplicate file delete error:",
            deleteError
          );
        }

        return res.status(409).json({
          message:
            "Ye belt certificate already uploaded hai. Duplicate certificate upload nahi kiya ja sakta.",
          existingBelt: {
            _id: existingBelt._id,
            beltName:
              existingBelt.beltName,
            certNo:
              existingBelt.certNo,
            status:
              existingBelt.status,
          },
        });
      }

      // ========================================
      // SAVE DATABASE RECORD
      // ========================================

      const belt = await Belt.create({
        studentId,
        beltName: cleanBeltName,
        certNo: cleanCertNo,
        fileUrl:
          `/uploads/${req.file.filename}`,
      });

      // ========================================
      // SUCCESS
      // ========================================

      return res.status(201).json(belt);

    } catch (err) {
      console.error(
        "Belt Certificate Upload Error:",
        err
      );

      // Cleanup uploaded file if database fails
      try {
        if (req.file?.path) {
          await fs.promises.unlink(
            req.file.path
          );
        }
      } catch (deleteError) {
        console.error(
          "Upload cleanup error:",
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





/* ==========================================
   BELT CERTIFICATE RE-UPLOAD
   PUT /api/belts/:id/re-upload
   ========================================== */

router.put(
  "/:id/re-upload",
  async (req, res) => {
    try {
      // ========================================
      // FIND EXISTING BELT RECORD
      // ========================================

      const existingBelt = await Belt.findById(
        req.params.id
      );

      if (!existingBelt) {
        return res.status(404).json({
          message:
            "Belt certificate record not found",
        });
      }

      // ========================================
      // ONLY APPROVED OR REJECTED CAN RE-UPLOAD
      // PENDING CANNOT RE-UPLOAD
      // ========================================

      if (
        existingBelt.status !== "approved" &&
        existingBelt.status !== "rejected"
      ) {
        return res.status(400).json({
          message:
            "Sirf approved ya rejected certificate ko re-upload kiya ja sakta hai.",
        });
      }

      // ========================================
      // STORE OLD FILE PATH
      // ========================================

      const oldFileUrl =
        existingBelt.fileUrl;

      // ========================================
      // ACCEPT NEW FILE
      // ========================================

      upload.single("file")(
        req,
        res,
        async (error) => {
          try {
            // ====================================
            // MULTER ERROR
            // ====================================

            if (
              error instanceof multer.MulterError
            ) {
              if (
                error.code ===
                "LIMIT_FILE_SIZE"
              ) {
                return res.status(400).json({
                  message:
                    "File 5MB se jyada nahi honi chahiye",
                });
              }

              return res.status(400).json({
                message: error.message,
              });
            }

            // ====================================
            // OTHER UPLOAD ERROR
            // ====================================

            if (error) {
              return res.status(400).json({
                message: error.message,
              });
            }

            // ====================================
            // FILE REQUIRED
            // ====================================

            if (!req.file) {
              return res.status(400).json({
                message:
                  "New certificate file required hai",
              });
            }

            // ====================================
            // NEW FILE URL
            // ====================================

            const newFileUrl =
              `/uploads/${req.file.filename}`;

            // ====================================
            // UPDATE SAME MONGODB RECORD
            //
            // _id SAME
            // studentId SAME
            // beltName SAME
            // certNo SAME
            // fileUrl NEW
            // status PENDING
            // ====================================

            existingBelt.fileUrl =
              newFileUrl;

            existingBelt.status =
              "pending";

            // reviewRemark intentionally
            // unchanged

            await existingBelt.save();

            // ====================================
            // DELETE OLD PHYSICAL FILE
            // ====================================

            if (
              oldFileUrl &&
              oldFileUrl !== newFileUrl
            ) {
              try {
                const oldFileName =
                  path.basename(
                    oldFileUrl
                  );

                const oldFilePath =
                  path.join(
                    process.cwd(),
                    "uploads",
                    oldFileName
                  );

                await fs.promises.unlink(
                  oldFilePath
                );

                console.log(
                  "Old belt certificate deleted:",
                  oldFileName
                );
              } catch (deleteError) {
                // Old file missing hone par
                // database update fail nahi hoga
                console.warn(
                  "Old belt certificate delete warning:",
                  deleteError.message
                );
              }
            }

            // ====================================
            // SUCCESS
            // ====================================

            return res.json({
              success: true,

              message:
                "Certificate re-uploaded successfully. Waiting for admin approval.",

              belt: existingBelt,
            });

          } catch (err) {
            console.error(
              "Belt Certificate Re-upload Error:",
              err
            );

            // If DB update fails,
            // remove newly uploaded file
            try {
              if (req.file?.path) {
                await fs.promises.unlink(
                  req.file.path
                );
              }
            } catch (cleanupError) {
              console.error(
                "New belt file cleanup error:",
                cleanupError
              );
            }

            return res.status(500).json({
              message: err.message,
            });
          }
        }
      );

    } catch (err) {
      console.error(
        "Belt Certificate Re-upload Find Error:",
        err
      );

      return res.status(500).json({
        message: err.message,
      });
    }
  }
);
export default router;