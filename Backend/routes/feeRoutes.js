
import express from "express";

import {
  createFee,
  getAllFees,
  getFeeById,
  getStudentFees,
  updateFee,
  deleteFee,
  getPendingFees,
  getFeesReport,
} from "../controllers/feeController.js";

const router = express.Router();

// ==========================================================
// FEE MANAGEMENT ROUTES
// Base URL: /api/fees
// ==========================================================


// ==========================================================
// CREATE FEE
// POST /api/fees
// ==========================================================

router.post(
  "/",
  createFee
);


// ==========================================================
// GET ALL FEES
// GET /api/fees
//
// Optional:
// ?month=8&year=2026
// ?status=Pending
// ==========================================================

router.get(
  "/",
  getAllFees
);


// ==========================================================
// GET PENDING FEES
// GET /api/fees/pending
//
// Optional:
// ?month=8&year=2026
// ==========================================================

router.get(
  "/pending",
  getPendingFees
);


// ==========================================================
// GET FEES REPORT
// GET /api/fees/report
//
// Optional:
// ?month=8&year=2026
// ==========================================================

router.get(
  "/report",
  getFeesReport
);


// ==========================================================
// GET STUDENT FEE HISTORY
// GET /api/fees/student/:studentId
//
// Optional:
// ?year=2026
// ?month=8
// ==========================================================

router.get(
  "/student/:studentId",
  getStudentFees
);


// ==========================================================
// GET FEE BY ID
// GET /api/fees/:id
// ==========================================================

router.get(
  "/:id",
  getFeeById
);


// ==========================================================
// UPDATE FEE / PAYMENT
// PUT /api/fees/:id
// ==========================================================

router.put(
  "/:id",
  updateFee
);


// ==========================================================
// DELETE FEE
// DELETE /api/fees/:id
// ==========================================================

router.delete(
  "/:id",
  deleteFee
);


export default router;









