import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  registrationNo: String,
  currentBelt: String,
  certificateNo: String,
   date: String

 // beltRecords: [
   // {
      //belt: String,
      //certificateNo: String,
     // date: String
  // }
  //]
});

export default mongoose.model("Student", studentSchema);