import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({

  session: {
    type: String,
    required: true
  },

  registrationNo: {
    type: String,
    required: true
  },

  studentName: String,

  fatherName: String,

  currentBelt: String,

  examDate: String,

  certificateNo: String,

  writtenTest: {
    max: Number,
    min: Number,
    obtained: Number,
    status: String
  },

  oralTest: {
    max: Number,
    min: Number,
    obtained: Number,
    status: String
  },

  technicalPerformance: {
    max: Number,
    min: Number,
    obtained: Number,
    status: String
  },

  punctuality: Number,
  dojoRules: Number,
  attendance: Number,
  extraPractice: Number,
  competition: Number,
  superAchiever: Number,
  personalGrowth: Number,
  leadership: Number,
  teamwork: Number,
  mentalStrength: Number,

  grandTotal: Number,

  percentage: Number,

  grade: String,

  result: String,

  remarks: String,

  instructorRemarks: String

});

export default mongoose.model(
  "Result",
  resultSchema
);