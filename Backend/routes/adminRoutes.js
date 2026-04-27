import express from "express";
import User from "../model/User.js";
import Belt from "../model/Belt.js";
import Achievement from "../model/Achievement.js";

const router = express.Router();

const ALLOWED_STATUS = ["pending", "approved", "rejected"];

/* All students */
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Single student full details */
router.get("/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId).select("-password");
    const belts = await Belt.find({ studentId }).sort({ createdAt: -1 });
    const achievements = await Achievement.find({ studentId }).sort({ createdAt: -1 });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

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
    const pendingBelts = await Belt.find({ status: "pending" })
      .populate("studentId", "name mobile registrationNo fatherName dob address")
      .sort({ createdAt: -1 });

    const pendingAchievements = await Achievement.find({ status: "pending" })
      .populate("studentId", "name mobile registrationNo fatherName dob address")
      .sort({ createdAt: -1 });

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

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedBelt = await Belt.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewRemark: reviewRemark || "",
      },
      { new: true }
    ).populate("studentId", "name mobile registrationNo");

    if (!updatedBelt) {
      return res.status(404).json({ message: "Belt certificate not found" });
    }

    res.json(updatedBelt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Approve/Reject competition certificate */
router.patch("/achievements/:id/status", async (req, res) => {
  try {
    const { status, reviewRemark } = req.body;

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewRemark: reviewRemark || "",
      },
      { new: true }
    ).populate("studentId", "name mobile registrationNo");

    if (!updatedAchievement) {
      return res.status(404).json({ message: "Competition certificate not found" });
    }

    res.json(updatedAchievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
