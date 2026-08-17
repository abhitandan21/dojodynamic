import Attendance from "../model/Attendance.js";
import Student from "../model/Student.js";
import ClassCalendar from "../model/ClassCalendar.js";

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
// ==========================================
// ATTENDANCE REPORT HELPERS
// ==========================================

const getDateRange = (
  startDate,
  endDate
) => {
  const dates = [];

  const current = new Date(
    `${startDate}T00:00:00`
  );

  const end = new Date(
    `${endDate}T00:00:00`
  );

  while (current <= end) {
    const year =
      current.getFullYear();

    const month = String(
      current.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      current.getDate()
    ).padStart(2, "0");

    dates.push(
      `${year}-${month}-${day}`
    );

    current.setDate(
      current.getDate() + 1
    );
  }

  return dates;
};


// ==========================================
// GET ATTENDANCE REPORT BY DATE RANGE
//
// GET
// /api/attendance/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// ==========================================

export const getAttendanceReport =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } = req.query;

      // ======================================
      // VALIDATION
      // ======================================

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message:
            "Start date and end date are required.",
        });
      }

      if (startDate > endDate) {
        return res.status(400).json({
          success: false,
          message:
            "Start date cannot be greater than end date.",
        });
      }

      // ======================================
      // GET ALL DATES
      // ======================================

      const allDates =
        getDateRange(
          startDate,
          endDate
        );

      // ======================================
      // GET SPECIAL HOLIDAYS
      // ======================================

      const holidays =
        await ClassCalendar.find({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        }).lean();

      const holidayMap =
        new Map(
          holidays.map(
            (holiday) => [
              holiday.date,
              holiday.reason,
            ]
          )
        );

      // ======================================
      // GET ATTENDANCE RECORDS
      // ======================================

      const attendance =
        await Attendance.find({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        })
          .sort({
            date: 1,
          })
          .lean();

      // ======================================
      // GROUP ATTENDANCE BY DATE
      // ======================================

      const attendanceByDate =
        new Map();

      attendance.forEach(
        (record) => {
          if (
            !attendanceByDate.has(
              record.date
            )
          ) {
            attendanceByDate.set(
              record.date,
              []
            );
          }

          attendanceByDate
            .get(record.date)
            .push(record);
        }
      );

      // ======================================
      // DAILY REPORT
      // ======================================

      const dailyReport = [];

      let totalPresent = 0;
      let totalAbsent = 0;

      let markedClassDays = 0;

      for (const date of allDates) {

        // ====================================
        // SUNDAY
        // ====================================

        const day =
          new Date(
            `${date}T00:00:00`
          ).getDay();

        if (day === 0) {
          dailyReport.push({
            date,
            type: "Sunday",
            present: 0,
            absent: 0,
            total: 0,
            percentage: 0,
          });

          continue;
        }

        // ====================================
        // SPECIAL HOLIDAY
        // ====================================

        if (holidayMap.has(date)) {
          dailyReport.push({
            date,
            type: "Holiday",
            reason:
              holidayMap.get(date),
            present: 0,
            absent: 0,
            total: 0,
            percentage: 0,
          });

          continue;
        }

        // ====================================
        // ATTENDANCE FOR DATE
        // ====================================

        const records =
          attendanceByDate.get(
            date
          ) || [];

        // No attendance marked yet
        if (records.length === 0) {
          continue;
        }

        // ====================================
        // COUNT
        // ====================================

        const present =
          records.filter(
            (record) =>
              record.status ===
              "Present"
          ).length;

        const absent =
          records.filter(
            (record) =>
              record.status ===
              "Absent"
          ).length;

        const total =
          present + absent;

        const percentage =
          total === 0
            ? 0
            : Number(
                (
                  (present /
                    total) *
                  100
                ).toFixed(2)
              );

        totalPresent += present;
        totalAbsent += absent;

        markedClassDays++;

        dailyReport.push({
          date,
          type: "Class",
          present,
          absent,
          total,
          percentage,
        });
      }

      // ======================================
      // OVERALL SUMMARY
      // ======================================

      const totalAttendance =
        totalPresent +
        totalAbsent;

      const overallPercentage =
        totalAttendance === 0
          ? 0
          : Number(
              (
                (totalPresent /
                  totalAttendance) *
                100
              ).toFixed(2)
            );

      // ======================================
      // EXCLUDED DAYS
      // ======================================

      const sundayCount =
        dailyReport.filter(
          (item) =>
            item.type === "Sunday"
        ).length;

      const holidayCount =
        dailyReport.filter(
          (item) =>
            item.type === "Holiday"
        ).length;

      // ======================================
      // SUCCESS
      // ======================================

      return res.json({
        success: true,

        period: {
          startDate,
          endDate,
        },

        summary: {
          markedClassDays,
          totalPresent,
          totalAbsent,
          totalAttendance,
          percentage:
            overallPercentage,
        },

        excluded: {
          sundays: sundayCount,
          holidays: holidayCount,
        },

        dailyReport,
      });

    } catch (error) {
      console.error(
        "Attendance Report Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
