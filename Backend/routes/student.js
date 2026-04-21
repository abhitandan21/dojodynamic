import express from "express";
import Student from "../model/Student.js";

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// GET single student
router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
});

export default router;