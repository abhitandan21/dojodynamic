import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    // ======================================================
    // STUDENT DETAILS
    // ======================================================

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

    // ======================================================
    // ITEM DETAILS
    // ======================================================

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    // ======================================================
    // PAYMENT DETAILS
    // ======================================================

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

    status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid"],
      default: "Unpaid",
    },

    // ======================================================
    // DATES
    // ======================================================

    issueDate: {
      type: Date,
      required: true,
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    // ======================================================
    // PAYMENT MODE
    // ======================================================

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

    // ======================================================
    // REMARK
    // ======================================================

    remark: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================================
// AUTOMATIC PAYMENT CALCULATION
// ==========================================================

// ==========================================================
// AUTOMATIC PAYMENT CALCULATION
// ==========================================================

inventorySchema.pre("save", function () {
  const amount = Number(this.amount) || 0;

  let paidAmount =
    Number(this.paidAmount) || 0;

  if (paidAmount < 0) {
    paidAmount = 0;
  }

  if (paidAmount > amount) {
    paidAmount = amount;
  }

  this.paidAmount = paidAmount;

  this.pendingAmount = Math.max(
    amount - paidAmount,
    0
  );

  if (
    amount > 0 &&
    paidAmount >= amount
  ) {
    this.status = "Paid";
  } else if (
    paidAmount > 0 &&
    paidAmount < amount
  ) {
    this.status = "Partial";
  } else {
    this.status = "Unpaid";
  }

  if (paidAmount === 0) {
    this.paymentDate = null;
  }
});

export default mongoose.model(
  "Inventory",
  inventorySchema
);