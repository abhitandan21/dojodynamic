import mongoose from "mongoose";

const classCalendarSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Holiday"],
      default: "Holiday",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: String,
      default: "Admin",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ClassCalendar",
  classCalendarSchema
);