import express from "express";

import {
  addHoliday,
  getHolidays,
  deleteHoliday,
} from "../controllers/calendarController.js";

const router = express.Router();

/**
 * ==========================================
 * CLASS CALENDAR / HOLIDAY ROUTES
 * Base URL: /api/calendar
 * ==========================================
 */

// ==========================================
// ADD HOLIDAY
// POST /api/calendar/holiday
// ==========================================

router.post(
  "/holiday",
  addHoliday
);


// ==========================================
// GET ALL HOLIDAYS
// GET /api/calendar/holidays
// ==========================================

router.get(
  "/holidays",
  getHolidays
);


// ==========================================
// DELETE HOLIDAY
// DELETE /api/calendar/holiday/:id
// ==========================================

router.delete(
  "/holiday/:id",
  deleteHoliday
);


export default router;