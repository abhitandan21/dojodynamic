import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: String,
    location: String,

    participants: [
      {
        name: String,
        kata: String,
        kumite: String,
      },
    ],

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
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
    },
  },
  { timestamps: true }
);

export default mongoose.model("Competition", competitionSchema);
