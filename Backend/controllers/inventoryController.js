import Inventory from "../model/Inventory.js";

// ==========================================================
// CREATE INVENTORY
// ==========================================================

export const createInventory = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      registrationNo,
      itemName,
      amount,
      paidAmount,
      issueDate,
      paymentDate,
      paymentMode,
      remark,
    } = req.body;

    if (
      !studentId ||
      !studentName ||
      !registrationNo ||
      !itemName ||
      amount === undefined ||
      !issueDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, studentName, registrationNo, itemName, amount and issueDate are required.",
      });
    }

    const totalAmount = Number(amount);
    const paid = Number(paidAmount || 0);

    if (
      Number.isNaN(totalAmount) ||
      totalAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount.",
      });
    }

    if (
      Number.isNaN(paid) ||
      paid < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid paid amount.",
      });
    }

    if (paid > totalAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Paid amount cannot be greater than amount.",
      });
    }

    const inventory = new Inventory({
      studentId,
      studentName,
      registrationNo,
      itemName,
      amount: totalAmount,
      paidAmount: paid,
      issueDate,
      paymentDate:
        paid > 0
          ? paymentDate || new Date()
          : null,
      paymentMode: paymentMode || "",
      remark: remark || "",
    });

    const savedInventory =
      await inventory.save();

    return res.status(201).json({
      success: true,
      message:
        "Inventory record created successfully.",
      inventory: savedInventory,
    });
  } catch (error) {
    console.error(
      "Create Inventory Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create inventory record.",
      error: error.message,
    });
  }
};

// ==========================================================
// GET ALL INVENTORY
// ==========================================================

export const getAllInventory = async (
  req,
  res
) => {
  try {
    const {
      status,
      studentId,
      search,
      month,
      year,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (studentId) {
      filter.studentId = studentId;
    }

    if (search) {
      filter.$or = [
        {
          studentName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          registrationNo: {
            $regex: search,
            $options: "i",
          },
        },
        {
          itemName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (month && year) {
      const startDate = new Date(
        Number(year),
        Number(month) - 1,
        1
      );

      const endDate = new Date(
        Number(year),
        Number(month),
        1
      );

      filter.issueDate = {
        $gte: startDate,
        $lt: endDate,
      };
    } else if (year) {
      const startDate = new Date(
        Number(year),
        0,
        1
      );

      const endDate = new Date(
        Number(year) + 1,
        0,
        1
      );

      filter.issueDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const records =
      await Inventory.find(filter).sort({
        issueDate: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: records.length,
      inventory: records,
    });
  } catch (error) {
    console.error(
      "Get All Inventory Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch inventory records.",
      error: error.message,
    });
  }
};

// ==========================================================
// GET SINGLE INVENTORY
// ==========================================================

export const getInventoryById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const inventory =
      await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message:
          "Inventory record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error(
      "Get Inventory Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch inventory record.",
      error: error.message,
    });
  }
};

// ==========================================================
// UPDATE INVENTORY
// ==========================================================

export const updateInventory = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const inventory =
      await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message:
          "Inventory record not found.",
      });
    }

    const {
      studentId,
      studentName,
      registrationNo,
      itemName,
      amount,
      paidAmount,
      issueDate,
      paymentDate,
      paymentMode,
      remark,
    } = req.body;

    if (studentId !== undefined) {
      inventory.studentId = studentId;
    }

    if (studentName !== undefined) {
      inventory.studentName =
        studentName;
    }

    if (registrationNo !== undefined) {
      inventory.registrationNo =
        registrationNo;
    }

    if (itemName !== undefined) {
      inventory.itemName = itemName;
    }

    if (amount !== undefined) {
      const newAmount = Number(amount);

      if (
        Number.isNaN(newAmount) ||
        newAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount.",
        });
      }

      inventory.amount = newAmount;
    }

    if (paidAmount !== undefined) {
      const newPaidAmount =
        Number(paidAmount);

      if (
        Number.isNaN(newPaidAmount) ||
        newPaidAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid paid amount.",
        });
      }

      if (
        newPaidAmount >
        Number(inventory.amount)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Paid amount cannot be greater than amount.",
        });
      }

      inventory.paidAmount =
        newPaidAmount;

      if (newPaidAmount === 0) {
        inventory.paymentDate = null;
      } else if (paymentDate !== undefined) {
        inventory.paymentDate =
          paymentDate;
      } else if (!inventory.paymentDate) {
        inventory.paymentDate =
          new Date();
      }
    }

    if (issueDate !== undefined) {
      inventory.issueDate = issueDate;
    }

    if (paymentDate !== undefined) {
      inventory.paymentDate =
        paymentDate;
    }

    if (paymentMode !== undefined) {
      inventory.paymentMode =
        paymentMode;
    }

    if (remark !== undefined) {
      inventory.remark = remark;
    }

    const updatedInventory =
      await inventory.save();

    return res.status(200).json({
      success: true,
      message:
        "Inventory record updated successfully.",
      inventory: updatedInventory,
    });
  } catch (error) {
    console.error(
      "Update Inventory Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update inventory record.",
      error: error.message,
    });
  }
};

// ==========================================================
// DELETE INVENTORY
// ==========================================================

export const deleteInventory = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const inventory =
      await Inventory.findByIdAndDelete(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message:
          "Inventory record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Inventory record deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Inventory Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete inventory record.",
      error: error.message,
    });
  }
};

// ==========================================================
// STUDENT-WISE INVENTORY HISTORY
// ==========================================================

export const getStudentInventory = async (
  req,
  res
) => {
  try {
    const { studentId } = req.params;
    const { year } = req.query;

    const filter = {
      studentId,
    };

    if (year) {
      const startDate = new Date(
        Number(year),
        0,
        1
      );

      const endDate = new Date(
        Number(year) + 1,
        0,
        1
      );

      filter.issueDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const records =
      await Inventory.find(filter).sort({
        issueDate: -1,
        createdAt: -1,
      });

    let totalAmount = 0;
    let totalPaid = 0;
    let totalPending = 0;

    records.forEach((record) => {
      totalAmount +=
        Number(record.amount) || 0;

      totalPaid +=
        Number(record.paidAmount) || 0;

      totalPending +=
        Number(record.pendingAmount) || 0;
    });

    return res.status(200).json({
      success: true,
      studentId,

      year: year
        ? Number(year)
        : null,

      summary: {
        totalItems:
          records.length,
        totalAmount,
        totalPaid,
        totalPending,
      },

      inventory: records,
    });
  } catch (error) {
    console.error(
      "Student Inventory Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch student inventory history.",
      error: error.message,
    });
  }
};

// ==========================================================
// PENDING INVENTORY
// ==========================================================

export const getPendingInventory = async (
  req,
  res
) => {
  try {
    const records =
      await Inventory.find({
        pendingAmount: {
          $gt: 0,
        },
      }).sort({
        issueDate: -1,
      });

    const totalPending =
      records.reduce(
        (total, record) =>
          total +
          (Number(
            record.pendingAmount
          ) || 0),
        0
      );

    const studentMap = new Map();

    records.forEach((record) => {
      const key = String(
        record.studentId
      );

      if (studentMap.has(key)) {
        const existing =
          studentMap.get(key);

        existing.pendingAmount +=
          Number(
            record.pendingAmount
          ) || 0;

        existing.records += 1;
      } else {
        studentMap.set(key, {
          studentId:
            record.studentId,
          studentName:
            record.studentName,
          registrationNo:
            record.registrationNo,
          pendingAmount:
            Number(
              record.pendingAmount
            ) || 0,
          records: 1,
        });
      }
    });

    const studentWisePending =
      Array.from(
        studentMap.values()
      ).sort(
        (a, b) =>
          b.pendingAmount -
          a.pendingAmount
      );

    return res.status(200).json({
      success: true,
      totalPending,
      pendingCount:
        records.length,
      studentCount:
        studentWisePending.length,
      inventory: records,
      studentWisePending,
    });
  } catch (error) {
    console.error(
      "Pending Inventory Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch pending inventory.",
      error: error.message,
    });
  }
};

// ==========================================================
// INVENTORY REPORT
// ==========================================================

export const getInventoryReport = async (
  req,
  res
) => {
  try {
    const {
      month,
      year,
    } = req.query;

    const filter = {};

    if (month && year) {
      const startDate = new Date(
        Number(year),
        Number(month) - 1,
        1
      );

      const endDate = new Date(
        Number(year),
        Number(month),
        1
      );

      filter.issueDate = {
        $gte: startDate,
        $lt: endDate,
      };
    } else if (year) {
      const startDate = new Date(
        Number(year),
        0,
        1
      );

      const endDate = new Date(
        Number(year) + 1,
        0,
        1
      );

      filter.issueDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const records =
      await Inventory.find(filter).sort({
        issueDate: -1,
      });

    let totalAmount = 0;
    let totalPaid = 0;
    let totalPending = 0;

    let paidCount = 0;
    let partialCount = 0;
    let unpaidCount = 0;

    records.forEach((record) => {
      totalAmount +=
        Number(record.amount) || 0;

      totalPaid +=
        Number(record.paidAmount) || 0;

      totalPending +=
        Number(record.pendingAmount) || 0;

      if (record.status === "Paid") {
        paidCount++;
      }

      if (record.status === "Partial") {
        partialCount++;
      }

      if (record.status === "Unpaid") {
        unpaidCount++;
      }
    });

    return res.status(200).json({
      success: true,

      filter: {
        month: month
          ? Number(month)
          : null,

        year: year
          ? Number(year)
          : null,
      },

      summary: {
        totalRecords:
          records.length,

        totalAmount,
        totalPaid,
        totalPending,

        paidCount,
        partialCount,
        unpaidCount,
      },

      inventory: records,
    });
  } catch (error) {
    console.error(
      "Inventory Report Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate inventory report.",
      error: error.message,
    });
  }
};