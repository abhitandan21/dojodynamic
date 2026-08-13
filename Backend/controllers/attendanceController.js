import Attendance from "../model/Attendance.js";
import Student from "../model/Student.js";

/**
 * ==========================================
 * Save Daily Attendance
 * POST /api/attendance
 * ==========================================
 */
export const saveAttendance = async (req, res) => {
  try {
    const {
      date,
      month,
      year,
      batch,
      markedBy,
      attendance,
    } = req.body;

    console.log(
      "========== ATTENDANCE REQUEST =========="
    );

    console.log("DATE:", date);

    console.log(
      "ATTENDANCE COUNT:",
      attendance?.length
    );

    console.log(
      "FIRST STUDENT:",
      attendance?.[0]
    );

    console.log(
      "========================================"
    );

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !date ||
      !attendance ||
      attendance.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance data is required.",
      });
    }

    // ==========================================
    // CHECK IF ATTENDANCE ALREADY EXISTS
    // ==========================================

    const attendanceBatch =
      batch || "General";

    const alreadyExists =
      await Attendance.findOne({
        date,
        batch: attendanceBatch,
      });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance already marked for this date.",
      });
    }

    // ==========================================
    // GET STUDENT DETAILS
    // ==========================================

    const attendanceData = [];

    for (
      const attendanceStudent of attendance
    ) {
      const student =
        await Student.findById(
          attendanceStudent.studentId
        );

      console.log(
        "STUDENT FROM DB:",
        student
      );

      // ========================================
      // STUDENT NOT FOUND
      // ========================================

      if (!student) {
        return res.status(400).json({
          success: false,
          message:
            `Student not found: ${attendanceStudent.studentId}`,
        });
      }

      // ========================================
      // GET NAME
      // ========================================

      const studentName =
        student.name?.trim() ||
        attendanceStudent.studentName?.trim() ||
        "";

      // ========================================
      // GET REGISTRATION NUMBER
      // ========================================

      const registrationNo =
        student.registrationNo?.trim() ||
        attendanceStudent.registrationNo?.trim() ||
        "";

      // ========================================
      // NAME VALIDATION
      // ========================================

      if (!studentName) {
        console.error(
          "STUDENT NAME MISSING:",
          {
            studentId:
              attendanceStudent.studentId,

            student,
          }
        );

        return res.status(400).json({
          success: false,
          message:
            `Student name is missing for Student ID: ${attendanceStudent.studentId}`,
        });
      }

      // ========================================
      // REGISTRATION NUMBER VALIDATION
      // ========================================

      if (!registrationNo) {
        console.error(
          "REGISTRATION NUMBER MISSING:",
          {
            studentId:
              attendanceStudent.studentId,

            studentName,
          }
        );

        return res.status(400).json({
          success: false,
          message:
            `Registration number is missing for student: ${studentName}`,
        });
      }

      // ========================================
      // CREATE ATTENDANCE OBJECT
      // ========================================

      attendanceData.push({
        studentId: student._id,

        studentName: studentName,

        registrationNo:
          registrationNo,

        date,

        month,

        year,

        batch:
          attendanceBatch,

        status:
          attendanceStudent.status ===
          "Absent"
            ? "Absent"
            : "Present",

        markedBy:
          markedBy || "Admin",
      });
    }

    // ==========================================
    // DEBUG FINAL DATA
    // ==========================================

    console.log(
      "FINAL ATTENDANCE RECORD:",
      attendanceData[0]
    );

    console.log(
      "TOTAL ATTENDANCE RECORDS:",
      attendanceData.length
    );

    // ==========================================
    // INSERT ATTENDANCE
    // ==========================================

    await Attendance.insertMany(
      attendanceData
    );

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,
      message:
        "Attendance saved successfully.",
    });

  } catch (error) {
    console.error(
      "Save Attendance Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * ==========================================
 * Get Attendance By Date
 * GET /api/attendance/date/:date
 * ==========================================
 */
export const getAttendanceByDate = async (
  req,
  res
) => {
  try {
    const attendance =
      await Attendance.find({
        date: req.params.date,
      }).populate("studentId");

    res.json({
      success: true,
      attendance,
    });

  } catch (error) {
    console.error(
      "Get Attendance By Date Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * ==========================================
 * Get Student Monthly Attendance
 * GET /api/attendance/student/:studentId/:month/:year
 * ==========================================
 */
export const getStudentAttendance = async (
  req,
  res
) => {
  try {
    const {
      studentId,
      month,
      year,
    } = req.params;

    const attendance =
      await Attendance.find({
        studentId,
        month,
        year,
      });

    res.json({
      success: true,
      attendance,
    });

  } catch (error) {
    console.error(
      "Get Student Attendance Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * ==========================================
 * Attendance Summary
 * GET /api/attendance/summary/:studentId
 * ==========================================
 */
export const getAttendanceSummary = async (
  req,
  res
) => {
  try {
    const studentId =
      req.params.studentId;

    const present =
      await Attendance.countDocuments({
        studentId,
        status: "Present",
      });

    const absent =
      await Attendance.countDocuments({
        studentId,
        status: "Absent",
      });

    const total =
      present + absent;

    const percentage =
      total === 0
        ? 0
        : (
            (present / total) *
            100
          ).toFixed(2);

    res.json({
      success: true,
      present,
      absent,
      total,
      percentage,
    });

  } catch (error) {
    console.error(
      "Attendance Summary Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * ==========================================
 * Update Attendance By Date
 * PUT /api/attendance/date/:date
 * ==========================================
 */
export const updateAttendanceByDate =
  async (req, res) => {
    try {
      const { date } = req.params;

      const {
        month,
        year,
        batch,
        markedBy,
        attendance,
      } = req.body;

      // ========================================
      // VALIDATION
      // ========================================

      if (
        !date ||
        !attendance ||
        attendance.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Attendance data is required.",
        });
      }

      const attendanceBatch =
        batch || "General";

      // ========================================
      // CREATE UPDATE OPERATIONS
      // ========================================

      const operations = [];

      for (
        const attendanceStudent of attendance
      ) {
        const student =
          await Student.findById(
            attendanceStudent.studentId
          );

        // ======================================
        // STUDENT NOT FOUND
        // ======================================

        if (!student) {
          return res.status(400).json({
            success: false,
            message:
              `Student not found: ${attendanceStudent.studentId}`,
          });
        }

        // ======================================
        // GET STUDENT NAME
        // ======================================

        const studentName =
          student.name?.trim() ||
          attendanceStudent.studentName?.trim() ||
          "";

        // ======================================
        // GET REGISTRATION NUMBER
        // ======================================

        const registrationNo =
          student.registrationNo?.trim() ||
          attendanceStudent.registrationNo?.trim() ||
          "";

        // ======================================
        // VALIDATE NAME
        // ======================================

        if (!studentName) {
          return res.status(400).json({
            success: false,
            message:
              `Student name is missing for Student ID: ${attendanceStudent.studentId}`,
          });
        }

        // ======================================
        // VALIDATE REGISTRATION NUMBER
        // ======================================

        if (!registrationNo) {
          return res.status(400).json({
            success: false,
            message:
              `Registration number is missing for student: ${studentName}`,
          });
        }

        // ======================================
        // UPDATE OPERATION
        // ======================================

        operations.push({
          updateOne: {
            filter: {
              studentId:
                attendanceStudent.studentId,

              date,

              batch:
                attendanceBatch,
            },

            update: {
              $set: {
                studentId:
                  student._id,

                studentName:
                  studentName,

                registrationNo:
                  registrationNo,

                date,

                month,

                year,

                batch:
                  attendanceBatch,

                status:
                  attendanceStudent.status ===
                  "Absent"
                    ? "Absent"
                    : "Present",

                markedBy:
                  markedBy || "Admin",
              },
            },

            upsert: true,
          },
        });
      }

      // ========================================
      // BULK UPDATE
      // ========================================

      await Attendance.bulkWrite(
        operations
      );

      // ========================================
      // SUCCESS
      // ========================================

      res.json({
        success: true,
        message:
          "Attendance updated successfully.",
      });

    } catch (error) {
      console.error(
        "Update Attendance Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


/**
 * ==========================================
 * Get Active Students For Attendance
 * GET /api/attendance/students
 * ==========================================
 */
export const getAllStudents = async (
  req,
  res
) => {
  try {
    const students = await Student.find({
      $or: [
        // ======================================
        // CURRENT ACTIVE STUDENTS
        // ======================================
        {
          status: "Active",
        },

        // ======================================
        // OLD STUDENTS
        // जिनमें अभी status field नहीं है
        // ======================================
        {
          status: {
            $exists: false,
          },
        },
      ],
    }).sort({
      name: 1,
    });

    res.json({
      success: true,
      students,
    });

  } catch (error) {
    console.error(
      "Get Active Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};