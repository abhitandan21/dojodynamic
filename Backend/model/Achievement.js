import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      default: "competition",
    },
    title: {
      type: String,
      required: true,
    },
    kata: {
      type: String,
      default: "",
    },
    kumite: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewRemark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
