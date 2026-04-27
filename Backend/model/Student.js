import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    registrationNo: { type: String, default: "" },
    dob: { type: String, default: "" },
     fatherName: { type: String, default: "" },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
   
    
    address: { type: String, default: "" },
   
    currentBelt: { type: String, default: "" },
    certificateNo: { type: String, default: "" },
    date: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
