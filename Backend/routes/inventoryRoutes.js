import express from "express";

import {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getStudentInventory,
  getPendingInventory,
  getInventoryReport,
} from "../controllers/inventoryController.js";

const router = express.Router();

// ==========================================================
// CREATE INVENTORY
// POST /api/inventory
// ==========================================================

router.post(
  "/",
  createInventory
);

// ==========================================================
// GET ALL INVENTORY
// GET /api/inventory
// ==========================================================

router.get(
  "/",
  getAllInventory
);

// ==========================================================
// PENDING INVENTORY
// GET /api/inventory/pending
// ==========================================================

router.get(
  "/pending",
  getPendingInventory
);

// ==========================================================
// INVENTORY REPORT
// GET /api/inventory/report
// ==========================================================

router.get(
  "/report",
  getInventoryReport
);

// ==========================================================
// STUDENT-WISE HISTORY
// GET /api/inventory/student/:studentId
// ==========================================================

router.get(
  "/student/:studentId",
  getStudentInventory
);

// ==========================================================
// GET SINGLE RECORD
// GET /api/inventory/:id
// ==========================================================

router.get(
  "/:id",
  getInventoryById
);

// ==========================================================
// UPDATE RECORD
// PUT /api/inventory/:id
// ==========================================================

router.put(
  "/:id",
  updateInventory
);

// ==========================================================
// DELETE RECORD
// DELETE /api/inventory/:id
// ==========================================================

router.delete(
  "/:id",
  deleteInventory
);

export default router;