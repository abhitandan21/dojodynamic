import express from "express";
import Student from "../model/Student.js";

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find({
      status: "Active"
    });

    res.json(students);
  } catch (error) {
    console.error("Get Active Students Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

// GET single student
router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
});

export default router;