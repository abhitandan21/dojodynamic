import Fee from "../model/Fee.js";

// ==========================================================
// HELPER FUNCTIONS
// ==========================================================

// Calculate pending amount and status
const calculateFeeStatus = (
  amount,
  paidAmount
) => {
  const feeAmount = Number(amount) || 0;
  const paid = Number(paidAmount) || 0;

  // Paid amount cannot exceed fee amount
  const safePaid = Math.min(
    Math.max(paid, 0),
    feeAmount
  );

  const pendingAmount =
    feeAmount - safePaid;

  let status = "Pending";

  if (pendingAmount <= 0) {
    status = "Paid";
  } else if (safePaid > 0) {
    status = "Partial";
  }

  return {
    paidAmount: safePaid,
    pendingAmount,
    status,
  };
};

// ==========================================================
// CREATE FEE
// POST /api/fees
// ==========================================================

export const createFee = async (
  req,
  res
) => {
  try {
    const {
      studentId,
      studentName,
      registrationNo,
      month,
      year,
      amount,
      paidAmount = 0,
      dueDate = "",
      paymentDate = "",
      paymentMode = "",
      receiptNo = "",
      remark = "",
    } = req.body;

    // ------------------------------------------
    // REQUIRED FIELDS
    // ------------------------------------------

    if (
      !studentId ||
      !studentName ||
      !registrationNo ||
      !month ||
      !year ||
      amount === undefined ||
      amount === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, studentName, registrationNo, month, year and amount are required.",
      });
    }

    // ------------------------------------------
    // VALIDATE MONTH
    // ------------------------------------------

    if (
      Number(month) < 1 ||
      Number(month) > 12
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Month must be between 1 and 12.",
      });
    }

    // ------------------------------------------
    // VALIDATE AMOUNT
    // ------------------------------------------

    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Fee amount cannot be negative.",
      });
    }

    if (Number(paidAmount) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Paid amount cannot be negative.",
      });
    }

    // ------------------------------------------
    // CHECK DUPLICATE MONTHLY FEE
    // ------------------------------------------

    const existingFee =
      await Fee.findOne({
        studentId,
        month: Number(month),
        year: Number(year),
      });

    if (existingFee) {
      return res.status(409).json({
        success: false,
        message:
          "Fee record already exists for this student and month.",
        fee: existingFee,
      });
    }

    // ------------------------------------------
    // CALCULATE PAYMENT
    // ------------------------------------------

    const {
      paidAmount: finalPaidAmount,
      pendingAmount,
      status,
    } = calculateFeeStatus(
      amount,
      paidAmount
    );

    // ------------------------------------------
    // CREATE FEE
    // ------------------------------------------

    const fee =
      await Fee.create({
        studentId,
        studentName,
        registrationNo,

        month: Number(month),
        year: Number(year),

        amount: Number(amount),
        paidAmount: finalPaidAmount,
        pendingAmount,

        status,

        dueDate,
        paymentDate,
        paymentMode,

        receiptNo,
        remark,

        reminderLastSentAt: null,
        reminderCount: 0,
      });

    return res.status(201).json({
      success: true,
      message:
        "Fee record created successfully.",
      fee,
    });

  } catch (error) {
    console.error(
      "Create Fee Error:",
      error
    );

    // MongoDB duplicate index protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Fee record already exists for this student and month.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to create fee record.",
      error: error.message,
    });
  }
};

// ==========================================================
// GET ALL FEES
// GET /api/fees
// ==========================================================

export const getAllFees = async (
  req,
  res
) => {
  try {
    const {
      month,
      year,
      status,
    } = req.query;

    const filter = {};

    if (month) {
      filter.month = Number(month);
    }

    if (year) {
      filter.year = Number(year);
    }

    if (status) {
      filter.status = status;
    }

    const fees =
      await Fee.find(filter)
        .sort({
          year: -1,
          month: -1,
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: fees.length,
      fees,
    });

  } catch (error) {
    console.error(
      "Get All Fees Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load fee records.",
      error: error.message,
    });
  }
};

// ==========================================================
// GET FEE BY ID
// GET /api/fees/:id
// ==========================================================

export const getFeeById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const fee =
      await Fee.findById(id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message:
          "Fee record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      fee,
    });

  } catch (error) {
    console.error(
      "Get Fee By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load fee record.",
      error: error.message,
    });
  }
};

// ==========================================================
// GET STUDENT FEE HISTORY
// GET /api/fees/student/:studentId
// ==========================================================

export const getStudentFees =
  async (req, res) => {
    try {
      const {
        studentId,
      } = req.params;

      const {
        year,
        month,
      } = req.query;

      const filter = {
        studentId,
      };

      if (year) {
        filter.year = Number(year);
      }

      if (month) {
        filter.month = Number(month);
      }

      const fees =
        await Fee.find(filter)
          .sort({
            year: -1,
            month: -1,
          });

      return res.status(200).json({
        success: true,
        count: fees.length,
        fees,
      });

    } catch (error) {
      console.error(
        "Get Student Fees Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load student fee history.",
        error: error.message,
      });
    }
  };

// ==========================================================
// UPDATE FEE / PAYMENT
// PUT /api/fees/:id
// ==========================================================

export const updateFee = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const fee =
      await Fee.findById(id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message:
          "Fee record not found.",
      });
    }

    const {
      amount,
      paidAmount,
      dueDate,
      paymentDate,
      paymentMode,
      receiptNo,
      remark,
    } = req.body;

    // ------------------------------------------
    // AMOUNT
    // ------------------------------------------

    const finalAmount =
      amount !== undefined
        ? Number(amount)
        : fee.amount;

    const finalPaidAmount =
      paidAmount !== undefined
        ? Number(paidAmount)
        : fee.paidAmount;

    if (finalAmount < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Fee amount cannot be negative.",
      });
    }

    if (finalPaidAmount < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Paid amount cannot be negative.",
      });
    }

    // ------------------------------------------
    // CALCULATE STATUS
    // ------------------------------------------

    const {
      paidAmount: safePaidAmount,
      pendingAmount,
      status,
    } = calculateFeeStatus(
      finalAmount,
      finalPaidAmount
    );

    // ------------------------------------------
    // UPDATE
    // ------------------------------------------

    fee.amount =
      finalAmount;

    fee.paidAmount =
      safePaidAmount;

    fee.pendingAmount =
      pendingAmount;

    fee.status =
      status;

    if (dueDate !== undefined) {
      fee.dueDate =
        dueDate;
    }

    if (
      paymentDate !==
      undefined
    ) {
      fee.paymentDate =
        paymentDate;
    }

    if (
      paymentMode !==
      undefined
    ) {
      fee.paymentMode =
        paymentMode;
    }

    if (
      receiptNo !==
      undefined
    ) {
      fee.receiptNo =
        receiptNo;
    }

    if (
      remark !==
      undefined
    ) {
      fee.remark =
        remark;
    }

    // ------------------------------------------
    // IF FULLY PAID
    // RESET REMINDER TRACKING
    // ------------------------------------------

    if (status === "Paid") {
      fee.reminderLastSentAt =
        null;

      fee.reminderCount =
        0;
    }

    await fee.save();

    return res.status(200).json({
      success: true,
      message:
        "Fee record updated successfully.",
      fee,
    });

  } catch (error) {
    console.error(
      "Update Fee Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update fee record.",
      error: error.message,
    });
  }
};

// ==========================================================
// DELETE FEE
// DELETE /api/fees/:id
// ==========================================================

export const deleteFee = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const fee =
      await Fee.findByIdAndDelete(
        id
      );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message:
          "Fee record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Fee record deleted successfully.",
      fee,
    });

  } catch (error) {
    console.error(
      "Delete Fee Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete fee record.",
      error: error.message,
    });
  }
};

// ==========================================================
// GET PENDING FEES
// GET /api/fees/pending
// ==========================================================

export const getPendingFees =
  async (req, res) => {
    try {
      const {
        month,
        year,
      } = req.query;

      const filter = {
        pendingAmount: {
          $gt: 0,
        },
        status: {
          $in: [
            "Pending",
            "Partial",
          ],
        },
      };

      if (month) {
        filter.month =
          Number(month);
      }

      if (year) {
        filter.year =
          Number(year);
      }

      const fees =
        await Fee.find(filter)
          .sort({
            year: -1,
            month: -1,
            studentName: 1,
          });

      const totalPending =
        fees.reduce(
          (sum, fee) =>
            sum +
            Number(
              fee.pendingAmount
            ),
          0
        );

      return res.status(200).json({
        success: true,
        count: fees.length,
        totalPending,
        fees,
      });

    } catch (error) {
      console.error(
        "Get Pending Fees Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load pending fees.",
        error: error.message,
      });
    }
  };

// ==========================================================
// FEES REPORT
// GET /api/fees/report
// ==========================================================

export const getFeesReport =
  async (req, res) => {
    try {
      const {
        month,
        year,
      } = req.query;

      const filter = {};

      if (month) {
        filter.month =
          Number(month);
      }

      if (year) {
        filter.year =
          Number(year);
      }

      const fees =
        await Fee.find(filter);

      const summary =
        fees.reduce(
          (result, fee) => {
            result.totalFees +=
              Number(
                fee.amount
              );

            result.totalPaid +=
              Number(
                fee.paidAmount
              );

            result.totalPending +=
              Number(
                fee.pendingAmount
              );

            if (
              fee.status ===
              "Paid"
            ) {
              result.paidCount++;
            }

            if (
              fee.status ===
              "Partial"
            ) {
              result.partialCount++;
            }

            if (
              fee.status ===
              "Pending"
            ) {
              result.pendingCount++;
            }

            return result;
          },
          {
            totalFees: 0,
            totalPaid: 0,
            totalPending: 0,
            paidCount: 0,
            partialCount: 0,
            pendingCount: 0,
          }
        );

      return res.status(200).json({
        success: true,

        filter: {
          month:
            month
              ? Number(month)
              : null,

          year:
            year
              ? Number(year)
              : null,
        },

        summary: {
          ...summary,
          totalRecords:
            fees.length,
        },

        fees,
      });

    } catch (error) {
      console.error(
        "Get Fees Report Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to generate fees report.",
        error: error.message,
      });
    }
  };