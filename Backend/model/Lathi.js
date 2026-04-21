import mongoose from "mongoose";

const lathiSchema = new mongoose.Schema({
  title: String,
  description: String,

  // 🔥 ADD THIS
  records: [
    {
      
      registrationNo: String,
      name: String,
      father: String
    }
  ]
});

export default mongoose.model("Lathi", lathiSchema);