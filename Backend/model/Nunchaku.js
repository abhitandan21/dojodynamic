

import mongoose from "mongoose";

const nunchakuSchema = new mongoose.Schema({
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

export default mongoose.model("Nunchaku", nunchakuSchema);