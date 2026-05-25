import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    registrationNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,

      match: [
        /^AMAASA\/\d{4}\/\d{3}$/,
        "Registration number must be like AMAASA/2025/034"
      ]
    },

    dob: {
      type: String,
      default: ""
    },

    fatherName: {
      type: String,
      default: ""
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,

      match: [
        /^[0-9]{10}$/,
        "Mobile number must be 10 digits"
      ]
    },

    password: {
      type: String,
      required: true
    },

    address: {
      type: String,
      default: ""
    },

    currentBelt: {
      type: String,
      default: ""
    },

    certificateNo: {
      type: String,
      default: ""
    },

    date: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);