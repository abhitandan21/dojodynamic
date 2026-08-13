import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC DETAILS
    // ==========================================

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

    // ==========================================
    // KARATE DETAILS
    // ==========================================

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
    },

    // ==========================================
    // STUDENT STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Dropped",
        "Completed"
      ],
      default: "Active"
    },

    // ==========================================
    // STATUS DETAILS
    // ==========================================

    joinedDate: {
      type: String,
      default: ""
    },

    inactiveFrom: {
      type: String,
      default: ""
    },

    inactiveReason: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Student",
  studentSchema
);