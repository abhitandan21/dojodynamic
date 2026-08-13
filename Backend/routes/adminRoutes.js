import express from "express";
import User from "../model/User.js";
import Student from "../model/Student.js";
import Belt from "../model/Belt.js";
import Achievement from "../model/Achievement.js";

const router = express.Router();

const ALLOWED_STATUS = [
  "pending",
  "approved",
  "rejected",
];

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
    console.error("Get Students Error:", error);

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
      // Status is stored here
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
      }).sort({ createdAt: -1 });

      // ========================================
      // GET ACHIEVEMENTS
      // ========================================

      const achievements =
        await Achievement.find({
          studentId,
        }).sort({ createdAt: -1 });

      // ========================================
      // COMBINE USER + STUDENT DATA
      // ========================================

      const student = {
        ...user.toObject(),

        // Take status from Student collection
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
          .sort({ createdAt: -1 });

      const pendingAchievements =
        await Achievement.find({
          status: "pending",
        })
          .populate(
            "studentId",
            "name mobile registrationNo fatherName dob address"
          )
          .sort({ createdAt: -1 });

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

      if (!ALLOWED_STATUS.includes(status)) {
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

      if (!ALLOWED_STATUS.includes(status)) {
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

      if (!allowedStatuses.includes(status)) {
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
        _id: req.params.studentId,
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
      // Using registration number
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
      // IMPORTANT:
      // Do NOT use student.save()
      // ========================================

      const updatedStudent =
        await Student.findOneAndUpdate(
          {
            _id: student._id,
          },
          {
            $set: {
              status: status,
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
          _id: updatedStudent._id,
          name: updatedStudent.name,
          registrationNo:
            updatedStudent.registrationNo,
          status: updatedStudent.status,
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