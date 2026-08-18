import mongoose from "mongoose";

// ==========================================
// FEE SCHEMA
// ==========================================

const feeSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT DETAILS
    // ==========================================

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNo: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // FEE MONTH
    // ==========================================

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    // ==========================================
    // FEE AMOUNT
    // ==========================================

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "Paid",
        "Partial",
        "Pending",
      ],
      default: "Pending",
    },

    // ==========================================
    // PAYMENT DETAILS
    // ==========================================

    dueDate: {
      type: String,
      default: "",
    },

    paymentDate: {
      type: String,
      default: "",
    },

    paymentMode: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Bank Transfer",
        "Other",
        "",
      ],
      default: "",
    },

    // ==========================================
    // OPTIONAL DETAILS
    // ==========================================

    receiptNo: {
      type: String,
      default: "",
      trim: true,
    },

    remark: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // FUTURE WHATSAPP REMINDER
    // ==========================================

    reminderLastSentAt: {
      type: Date,
      default: null,
    },

    reminderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },

  {
    timestamps: true,
  }
);

// ==========================================
// ONE FEE RECORD PER STUDENT / MONTH / YEAR
// ==========================================

feeSchema.index(
  {
    studentId: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

// ==========================================
// EXPORT
// ==========================================

export default mongoose.model(
  "Fee",
  feeSchema
);