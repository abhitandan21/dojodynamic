import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import User from "../model/User.js";
import Student from "../model/Student.js";
import Belt from "../model/Belt.js";
import Achievement from "../model/Achievement.js";

import upload from "../middleware/upload.js";

const router = express.Router();

const ALLOWED_STATUS = [
  "pending",
  "approved",
  "rejected",
];

/* ==========================================
   HELPER
   DELETE UPLOADED FILE
   ========================================== */

const deleteUploadedFile = async (fileUrl) => {
  try {
    if (!fileUrl) {
      return;
    }

    // Example:
    // /uploads/filename.jpg
    //
    // Convert to:
    // ./uploads/filename.jpg

    const relativePath = fileUrl.replace(
      /^\/uploads[\\/]/,
      ""
    );

    const filePath = path.resolve(
      process.cwd(),
      "uploads",
      relativePath
    );

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);

      console.log(
        "Uploaded file deleted:",
        filePath
      );
    } else {
      console.log(
        "File not found, nothing to delete:",
        filePath
      );
    }

  } catch (error) {
    console.error(
      "Uploaded file delete error:",
      error
    );
  }
};


/* ==========================================
   ALL STUDENTS
   ========================================== */

router.get("/students", async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);

  } catch (error) {
    console.error(
      "Get Students Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
});


/* ==========================================
   SINGLE STUDENT FULL DETAILS
   ========================================== */

router.get(
  "/students/:studentId",
  async (req, res) => {
    try {
      const { studentId } = req.params;

      // ========================================
      // GET USER DATA
      // ========================================

      const user = await User.findById(
        studentId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      // ========================================
      // GET STUDENT DATA
      // ========================================

      const studentData =
        await Student.findOne({
          registrationNo:
            user.registrationNo,
        });

      // ========================================
      // GET BELTS
      // ========================================

      const belts = await Belt.find({
        studentId,
      }).sort({
        createdAt: -1,
      });

      // ========================================
      // GET ACHIEVEMENTS
      // ========================================

      const achievements =
        await Achievement.find({
          studentId,
        }).sort({
          createdAt: -1,
        });

      // ========================================
      // COMBINE USER + STUDENT DATA
      // ========================================

      const student = {
        ...user.toObject(),

        status:
          studentData?.status || "Active",

        inactiveFrom:
          studentData?.inactiveFrom || "",

        inactiveReason:
          studentData?.inactiveReason || "",
      };

      // ========================================
      // RESPONSE
      // ========================================

      res.json({
        student,
        belts,
        achievements,
      });

    } catch (error) {
      console.error(
        "Get Student Details Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


/* ==========================================
   PENDING CERTIFICATES
   ========================================== */

router.get(
  "/certificates/pending",
  async (req, res) => {
    try {
      const pendingBelts =
        await Belt.find({
          status: "pending",
        })
          .populate(
            "studentId",
            "name mobile registrationNo fatherName dob address"
          )
          .sort({
            createdAt: -1,
          });

      const pendingAchievements =
        await Achievement.find({
          status: "pending",
        })
          .populate(
            "studentId",
            "name mobile registrationNo fatherName dob address"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        belts: pendingBelts,
        achievements:
          pendingAchievements,
      });

    } catch (error) {
      console.error(
        "Pending Certificates Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


/* ==========================================
   APPROVE / REJECT BELT CERTIFICATE
   ========================================== */

router.patch(
  "/belts/:id/status",
  async (req, res) => {
    try {
      const {
        status,
        reviewRemark,
      } = req.body;

      if (
        !ALLOWED_STATUS.includes(status)
      ) {
        return res.status(400).json({
          message:
            "Invalid status value",
        });
      }

      const updatedBelt =
        await Belt.findByIdAndUpdate(
          req.params.id,
          {
            status,
            reviewRemark:
              reviewRemark || "",
          },
          {
            new: true,
          }
        ).populate(
          "studentId",
          "name mobile registrationNo"
        );

      if (!updatedBelt) {
        return res.status(404).json({
          message:
            "Belt certificate not found",
        });
      }

      res.json(updatedBelt);

    } catch (error) {
      console.error(
        "Belt Status Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


/* ==========================================
   APPROVE / REJECT COMPETITION CERTIFICATE
   ========================================== */

router.patch(
  "/achievements/:id/status",
  async (req, res) => {
    try {
      const {
        status,
        reviewRemark,
      } = req.body;

      if (
        !ALLOWED_STATUS.includes(status)
      ) {
        return res.status(400).json({
          message:
            "Invalid status value",
        });
      }

      const updatedAchievement =
        await Achievement.findByIdAndUpdate(
          req.params.id,
          {
            status,
            reviewRemark:
              reviewRemark || "",
          },
          {
            new: true,
          }
        ).populate(
          "studentId",
          "name mobile registrationNo"
        );

      if (!updatedAchievement) {
        return res.status(404).json({
          message:
            "Competition certificate not found",
        });
      }

      res.json(updatedAchievement);

    } catch (error) {
      console.error(
        "Achievement Status Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);




/* ==========================================
   ADMIN EDIT BELT CERTIFICATE
   PUT /api/admin/belts/:id
   ========================================== */

router.put(
  "/belts/:id",
  (req, res) => {
    upload.single("file")(
      req,
      res,
      async (error) => {
        try {
          // ========================================
          // MULTER ERROR
          // ========================================

          if (error instanceof multer.MulterError) {
            return res.status(400).json({
              message:
                error.code === "LIMIT_FILE_SIZE"
                  ? "File 5MB se jyada nahi honi chahiye"
                  : error.message,
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
          // FIND EXISTING BELT
          // ========================================

          const existingBelt =
            await Belt.findById(req.params.id);

          if (!existingBelt) {
            // Agar new file upload ho gayi thi
            // lekin record nahi mila, new file delete karo
            if (req.file) {
              await deleteUploadedFile(
                `/uploads/${req.file.filename}`
              );
            }

            return res.status(404).json({
              message:
                "Belt certificate not found",
            });
          }

          // ========================================
          // SAVE OLD FILE URL
          // IMPORTANT
          // ========================================

          const oldFileUrl =
            existingBelt.fileUrl;

          // ========================================
          // REQUEST DATA
          // ========================================

          const newBeltName =
            req.body.beltName !== undefined
              ? req.body.beltName.trim()
              : existingBelt.beltName;

          const newCertNo =
            req.body.certNo !== undefined
              ? req.body.certNo.trim()
              : existingBelt.certNo;

          // ========================================
          // VALIDATION
          // ========================================

          if (!newBeltName || !newCertNo) {
            if (req.file) {
              await deleteUploadedFile(
                `/uploads/${req.file.filename}`
              );
            }

            return res.status(400).json({
              message:
                "Belt name aur certificate number required hai",
            });
          }

          // ========================================
          // DUPLICATE CHECK
          //
          // Same student
          // + same belt
          // + same certificate number
          //
          // Current record excluded
          // ========================================

          const duplicateBelt =
            await Belt.findOne({
              _id: {
                $ne: existingBelt._id,
              },

              studentId:
                existingBelt.studentId,

              beltName:
                newBeltName,

              certNo:
                newCertNo,
            });

          if (duplicateBelt) {
            // Duplicate hone par new uploaded file
            // bhi delete kar do
            if (req.file) {
              await deleteUploadedFile(
                `/uploads/${req.file.filename}`
              );
            }

            return res.status(409).json({
              message:
                "Same student ke liye ye Belt + Certificate No already uploaded hai. Duplicate certificate save nahi kiya ja sakta.",
            });
          }

          // ========================================
          // UPDATE BELT DETAILS
          // ========================================

          existingBelt.beltName =
            newBeltName;

          existingBelt.certNo =
            newCertNo;

          // ========================================
          // REPLACE FILE IF NEW FILE PROVIDED
          // ========================================

          if (req.file) {
            existingBelt.fileUrl =
              `/uploads/${req.file.filename}`;
          }

          // ========================================
          // IMPORTANT
          // Status / reviewRemark untouched
          // ========================================

          await existingBelt.save();

          // ========================================
          // DELETE OLD FILE
          //
          // Only when a new file was uploaded
          // and DB save was successful
          // ========================================

          if (
            req.file &&
            oldFileUrl &&
            oldFileUrl !==
              existingBelt.fileUrl
          ) {
            await deleteUploadedFile(
              oldFileUrl
            );
          }

          // ========================================
          // SUCCESS
          // ========================================

          return res.json({
            success: true,

            message:
              "Belt certificate updated successfully.",

            belt: existingBelt,
          });

        } catch (err) {

          // ========================================
          // ERROR CLEANUP
          // ========================================

          if (req.file) {
            await deleteUploadedFile(
              `/uploads/${req.file.filename}`
            );
          }

          console.error(
            "Admin Belt Edit Error:",
            err
          );

          return res.status(500).json({
            message: err.message,
          });
        }
      }
    );
  }
);


/* ==========================================
   ADMIN DELETE BELT CERTIFICATE
   DELETE /api/admin/belts/:id
   ========================================== */

router.delete(
  "/belts/:id",
  async (req, res) => {
    try {

      const existingBelt =
        await Belt.findById(
          req.params.id
        );

      if (!existingBelt) {
        return res.status(404).json({
          message:
            "Belt certificate not found",
        });
      }

      const oldFileUrl =
        existingBelt.fileUrl;

      await Belt.findByIdAndDelete(
        req.params.id
      );

      // Delete actual file
      await deleteUploadedFile(
        oldFileUrl
      );

      return res.json({
        success: true,
        message:
          "Belt certificate deleted successfully.",
      });

    } catch (error) {

      console.error(
        "Admin Belt Delete Error:",
        error
      );

      return res.status(500).json({
        message: error.message,
      });
    }
  }
);


/* ==========================================
   ADMIN EDIT COMPETITION CERTIFICATE
   PUT /api/admin/achievements/:id
   ========================================== */

router.put(
  "/achievements/:id",
  (req, res) => {
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

            return res.status(400).json({
              message:
                error.code === "LIMIT_FILE_SIZE"
                  ? "File 5MB se jyada nahi honi chahiye"
                  : error.message,
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
          // FIND EXISTING ACHIEVEMENT
          // ========================================

          const existingAchievement =
            await Achievement.findById(
              req.params.id
            );

          if (!existingAchievement) {
            return res.status(404).json({
              message:
                "Competition certificate not found",
            });
          }

          // ========================================
          // REQUEST DATA
          // ========================================

          const newTitle =
            req.body.title !== undefined
              ? req.body.title.trim()
              : existingAchievement.title;

          const newKata =
            req.body.kata !== undefined
              ? req.body.kata.trim()
              : existingAchievement.kata;

          const newKumite =
            req.body.kumite !== undefined
              ? req.body.kumite.trim()
              : existingAchievement.kumite;

          // ========================================
          // VALIDATION
          // ========================================

          if (!newTitle) {

            if (req.file) {
              await deleteUploadedFile(
                `/uploads/${req.file.filename}`
              );
            }

            return res.status(400).json({
              message:
                "Competition name required hai",
            });
          }

          // ========================================
          // DUPLICATE CHECK
          //
          // Same student +
          // same competition +
          // same kata +
          // same kumite
          //
          // Current record excluded
          // ========================================

          const duplicateAchievement =
            await Achievement.findOne({
              _id: {
                $ne:
                  existingAchievement._id,
              },

              studentId:
                existingAchievement.studentId,

              type: "competition",

              title:
                newTitle,

              kata:
                newKata,

              kumite:
                newKumite,
            });

          if (duplicateAchievement) {

            if (req.file) {
              await deleteUploadedFile(
                `/uploads/${req.file.filename}`
              );
            }

            return res.status(409).json({
              message:
                "Same student ke liye ye Competition + Kata + Kumite already uploaded hai. Duplicate certificate save nahi kiya ja sakta.",
            });
          }

          // ========================================
          // OLD FILE URL
          // Save before replacing it
          // ========================================

          const oldFileUrl =
            existingAchievement.fileUrl;

          // ========================================
          // UPDATE DATA
          // ========================================

          existingAchievement.title =
            newTitle;

          existingAchievement.kata =
            newKata;

          existingAchievement.kumite =
            newKumite;

          // ========================================
          // NEW FILE
          // ========================================

          if (req.file) {

            existingAchievement.fileUrl =
              `/uploads/${req.file.filename}`;
          }

          // IMPORTANT:
          // Status / reviewRemark untouched

          await existingAchievement.save();

          // ========================================
          // DELETE OLD FILE
          // Only after successful DB save
          // ========================================

          if (
            req.file &&
            oldFileUrl &&
            oldFileUrl !==
              existingAchievement.fileUrl
          ) {
            await deleteUploadedFile(
              oldFileUrl
            );
          }

          // ========================================
          // SUCCESS
          // ========================================

          return res.json({
            success: true,
            message:
              "Competition certificate updated successfully.",
            achievement:
              existingAchievement,
          });

        } catch (err) {

          // Remove newly uploaded file if
          // database update fails

          if (req.file) {
            await deleteUploadedFile(
              `/uploads/${req.file.filename}`
            );
          }

          console.error(
            "Admin Competition Edit Error:",
            err
          );

          return res.status(500).json({
            message: err.message,
          });
        }
      }
    );
  }
);


/* ==========================================
   ADMIN DELETE COMPETITION CERTIFICATE
   DELETE /api/admin/achievements/:id
   ========================================== */

router.delete(
  "/achievements/:id",
  async (req, res) => {
    try {

      const existingAchievement =
        await Achievement.findById(
          req.params.id
        );

      if (!existingAchievement) {
        return res.status(404).json({
          message:
            "Competition certificate not found",
        });
      }

      const oldFileUrl =
        existingAchievement.fileUrl;

      await Achievement.findByIdAndDelete(
        req.params.id
      );

      // Delete actual file
      await deleteUploadedFile(
        oldFileUrl
      );

      return res.json({
        success: true,
        message:
          "Competition certificate deleted successfully.",
      });

    } catch (error) {

      console.error(
        "Admin Competition Delete Error:",
        error
      );

      return res.status(500).json({
        message: error.message,
      });
    }
  }
);


/* ==========================================
   UPDATE STUDENT STATUS
   PATCH /api/admin/students/:studentId/status
   ========================================== */

router.patch(
  "/students/:studentId/status",
  async (req, res) => {
    try {

      const {
        status,
        inactiveFrom,
        inactiveReason,
      } = req.body;

      // ========================================
      // ALLOWED STUDENT STATUS
      // ========================================

      const allowedStatuses = [
        "Active",
        "Inactive",
        "Dropped",
        "Completed",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid student status.",
        });
      }

      // ========================================
      // FIND USER
      // ========================================

      const user = await User.findOne({
        _id:
          req.params.studentId,
        role: "student",
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found.",
        });
      }

      // ========================================
      // FIND STUDENT COLLECTION
      // ========================================

      const student =
        await Student.findOne({
          registrationNo:
            user.registrationNo,
        });

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student record not found in Student collection.",
        });
      }

      // ========================================
      // UPDATE ONLY STATUS FIELDS
      // ========================================

      const updatedStudent =
        await Student.findOneAndUpdate(
          {
            _id: student._id,
          },
          {
            $set: {
              status:
                status,

              inactiveFrom:
                inactiveFrom || "",

              inactiveReason:
                inactiveReason || "",
            },
          },
          {
            new: true,
            runValidators: false,
          }
        );

      // ========================================
      // SUCCESS
      // ========================================

      res.json({
        success: true,

        message:
          "Student status updated successfully.",

        student: {
          _id:
            updatedStudent._id,

          name:
            updatedStudent.name,

          registrationNo:
            updatedStudent.registrationNo,

          status:
            updatedStudent.status,

          inactiveFrom:
            updatedStudent.inactiveFrom,

          inactiveReason:
            updatedStudent.inactiveReason,
        },
      });

    } catch (error) {

      console.error(
        "Student Status Update Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


/* ==========================================
   EXPORT ROUTER
   ========================================== */

export default router;