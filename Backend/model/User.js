import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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

    address: {
      type: String,
      default: ""
    },

    fatherName: {
      type: String,
      default: ""
    },

    dob: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);