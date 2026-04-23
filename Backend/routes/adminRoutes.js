import express from "express";
import User from "../model/User.js";
import Belt from "../model/Belt.js";
import Achievement from "../model/Achievement.js";

const router = express.Router();

/* All students */
router.get("/students", async (req, res) => {
  try {
    const students = await User.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Single student full details */
router.get("/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);
    const belts = await Belt.find({ studentId }).sort({ createdAt: -1 });
    const achievements = await Achievement.find({ studentId }).sort({ createdAt: -1 });

    res.json({
      student,
      belts,
      achievements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Pending certificates count/list */
router.get("/certificates/pending", async (req, res) => {
  try {
    const pendingBelts = await Belt.find({ status: "pending" }).populate("studentId");
    const pendingAchievements = await Achievement.find({ status: "pending" }).populate("studentId");

    res.json({
      belts: pendingBelts,
      achievements: pendingAchievements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Approve/Reject belt certificate */
router.patch("/belts/:id/status", async (req, res) => {
  try {
    const { status, reviewRemark } = req.body;

    const updatedBelt = await Belt.findByIdAndUpdate(
      req.params.id,
      { status, reviewRemark: reviewRemark || "" },
      { new: true }
    );

    res.json(updatedBelt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Approve/Reject competition certificate */
router.patch("/achievements/:id/status", async (req, res) => {
  try {
    const { status, reviewRemark } = req.body;

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { status, reviewRemark: reviewRemark || "" },
      { new: true }
    );

    res.json(updatedAchievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
