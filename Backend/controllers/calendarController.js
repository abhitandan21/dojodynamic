import ClassCalendar from "../model/ClassCalendar.js";

// ==========================================
// ADD HOLIDAY
// POST /api/calendar/holiday
// ==========================================

export const addHoliday = async (req, res) => {
  try {
    const {
      date,
      reason,
      createdBy,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Holiday date is required.",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Holiday reason is required.",
      });
    }

    // ==========================================
    // CHECK DUPLICATE DATE
    // ==========================================

    const existingHoliday =
      await ClassCalendar.findOne({
        date: date.trim(),
      });

    if (existingHoliday) {
      return res.status(409).json({
        success: false,
        message:
          "Is date par holiday already marked hai.",
        holiday: existingHoliday,
      });
    }

    // ==========================================
    // CREATE HOLIDAY
    // ==========================================

    const holiday =
      await ClassCalendar.create({
        date: date.trim(),
        type: "Holiday",
        reason: reason.trim(),
        createdBy:
          createdBy?.trim() || "Admin",
      });

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Holiday added successfully.",
      holiday,
    });

  } catch (error) {
    console.error(
      "Add Holiday Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL HOLIDAYS
// GET /api/calendar/holidays
// ==========================================

export const getHolidays = async (
  req,
  res
) => {
  try {
    const holidays =
      await ClassCalendar.find().sort({
        date: 1,
      });

    return res.json({
      success: true,
      holidays,
    });

  } catch (error) {
    console.error(
      "Get Holidays Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE HOLIDAY
// DELETE /api/calendar/holiday/:id
// ==========================================

export const deleteHoliday = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const holiday =
      await ClassCalendar.findById(id);

    // ==========================================
    // HOLIDAY NOT FOUND
    // ==========================================

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found.",
      });
    }

    // ==========================================
    // DELETE
    // ==========================================

    await ClassCalendar.findByIdAndDelete(
      id
    );

    return res.json({
      success: true,
      message: "Holiday deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete Holiday Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};