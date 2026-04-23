import mongoose from "mongoose";

const beltSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    beltName: {
      type: String,
      required: true,
    },
    certNo: {
      type: String,
      required: true,
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

const Belt = mongoose.model("Belt", beltSchema);

export default Belt;
