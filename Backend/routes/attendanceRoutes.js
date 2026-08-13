import express from "express";

import {
  saveAttendance,
  getAttendanceByDate,
  getStudentAttendance,
  getAttendanceSummary,
  updateAttendanceByDate,
  getAllStudents,
} from "../controllers/attendanceController.js";

const router = express.Router();

/**
 * ==========================================
 * Attendance Routes
 * Base URL : /api/attendance
 * ==========================================
 */

// ==========================================
// Save Daily Attendance
// POST /api/attendance
// ==========================================

router.post(
  "/",
  saveAttendance
);


// ==========================================
// Get Attendance By Date
// GET /api/attendance/date/:date
// ==========================================

router.get(
  "/date/:date",
  getAttendanceByDate
);


// ==========================================
// Update Attendance By Date
// PUT /api/attendance/date/:date
// ==========================================

router.put(
  "/date/:date",
  updateAttendanceByDate
);


// ==========================================
// Get Student Monthly Attendance
// GET /api/attendance/student/:studentId/:month/:year
// ==========================================

router.get(
  "/student/:studentId/:month/:year",
  getStudentAttendance
);


// ==========================================
// Get Student Attendance Summary
// GET /api/attendance/summary/:studentId
// ==========================================

router.get(
  "/summary/:studentId",
  getAttendanceSummary
);


// ==========================================
// Get All Students
// GET /api/attendance/students
// ==========================================

router.get(
  "/students",
  getAllStudents
);


export default router;