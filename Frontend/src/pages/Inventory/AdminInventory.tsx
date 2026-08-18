import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:4001/api";

type InventoryStatus = "Paid" | "Partial" | "Unpaid";

interface Student {
  _id: string;
  name?: string;
  mobile?: string;
  registrationNo?: string;
  fatherName?: string;
}

interface InventoryRecord {
  _id: string;
  studentId: string;
  studentName: string;
  registrationNo: string;
  itemName: string;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  status: InventoryStatus;
  issueDate: string;
  paymentDate?: string | null;
  paymentMode?: string;
  remark?: string;
}

interface InventoryForm {
  studentId: string;
  studentName: string;
  registrationNo: string;
  itemName: string;
  amount: string;
  paidAmount: string;
  issueDate: string;
  paymentDate: string;
  paymentMode: string;
  remark: string;
}

const emptyForm: InventoryForm = {
  studentId: "",
  studentName: "",
  registrationNo: "",
  itemName: "",
  amount: "",
  paidAmount: "0",
  issueDate: new Date().toISOString().split("T")[0],
  paymentDate: "",
  paymentMode: "",
  remark: "",
};

const AdminInventory = () => {
  // ==========================================================
  // INVENTORY STATES
  // ==========================================================

  const [records, setRecords] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // STUDENT STATES
  // ==========================================================

  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);
  const [showStudentResults, setShowStudentResults] =
    useState(false);

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | InventoryStatus>("All");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // ==========================================================
  // FORM
  // ==========================================================

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InventoryForm>(emptyForm);

  // ==========================================================
  // FETCH STUDENTS
  // ==========================================================

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `${API_URL}/admin/students`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          "Failed to fetch students."
        );
      }

      setStudents(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Students fetch error:",
        err
      );
    }
  };

  // ==========================================================
  // FETCH INVENTORY
  // ==========================================================

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append(
          "search",
          search.trim()
        );
      }

      if (statusFilter !== "All") {
        params.append(
          "status",
          statusFilter
        );
      }

      if (month && year) {
        params.append("month", month);
        params.append("year", year);
      } else if (year) {
        params.append("year", year);
      }

      const query = params.toString();

      const response = await fetch(
        `${API_URL}/inventory${
          query ? `?${query}` : ""
        }`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch inventory."
        );
      }

      setRecords(
        data.inventory || []
      );
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchInventory();
    fetchStudents();
  }, []);

  // ==========================================================
  // FILTER LOAD
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 400);

    return () => clearTimeout(timer);
  }, [
    search,
    statusFilter,
    month,
    year,
  ]);

  // ==========================================================
  // STUDENT SEARCH
  // ==========================================================

  const filteredStudents = useMemo(() => {
    const value =
      studentSearch
        .trim()
        .toLowerCase();

    if (!value) {
      return [];
    }

    return students
      .filter((student) => {
        const name =
          student.name || "";

        const mobile =
          student.mobile || "";

        const registrationNo =
          student.registrationNo || "";

        return `${name} ${mobile} ${registrationNo}`
          .toLowerCase()
          .includes(value);
      })
      .slice(0, 10);
  }, [
    students,
    studentSearch,
  ]);

  // ==========================================================
  // SELECT STUDENT
  // ==========================================================

  const handleStudentSelect = (
    student: Student
  ) => {
    setSelectedStudent(student);

    setForm((prev) => ({
      ...prev,
      studentId: student._id,
      studentName: student.name || "",
      registrationNo:
        student.registrationNo || "",
    }));

    setStudentSearch(
      student.name || ""
    );

    setShowStudentResults(false);
  };

  // ==========================================================
  // CLEAR STUDENT
  // ==========================================================

  const clearStudent = () => {
    setSelectedStudent(null);
    setStudentSearch("");

    setForm((prev) => ({
      ...prev,
      studentId: "",
      studentName: "",
      registrationNo: "",
    }));
  };

  // ==========================================================
  // SUMMARY
  // ==========================================================

  const summary = useMemo(() => {
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

    return {
      totalRecords: records.length,
      totalAmount,
      totalPaid,
      totalPending,
      paidCount,
      partialCount,
      unpaidCount,
    };
  }, [records]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // OPEN ADD
  // ==========================================================

  const openAddForm = () => {
    setEditingId(null);
    setSelectedStudent(null);
    setStudentSearch("");

    setForm({
      ...emptyForm,
      issueDate: new Date()
        .toISOString()
        .split("T")[0],
    });

    setError("");
    setShowForm(true);
  };

  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const openEditForm = (
    record: InventoryRecord
  ) => {
    setEditingId(record._id);

    const student =
      students.find(
        (s) =>
          s._id === record.studentId
      );

    if (student) {
      setSelectedStudent(student);

      setStudentSearch(
        student.name || ""
      );
    } else {
      setSelectedStudent({
        _id: record.studentId,
        name: record.studentName,
        registrationNo:
          record.registrationNo,
      });

      setStudentSearch(
        record.studentName
      );
    }

    setForm({
      studentId:
        record.studentId || "",

      studentName:
        record.studentName || "",

      registrationNo:
        record.registrationNo || "",

      itemName:
        record.itemName || "",

      amount:
        String(record.amount ?? ""),

      paidAmount:
        String(record.paidAmount ?? 0),

      issueDate:
        record.issueDate
          ? record.issueDate.split("T")[0]
          : "",

      paymentDate:
        record.paymentDate
          ? record.paymentDate.split("T")[0]
          : "",

      paymentMode:
        record.paymentMode || "",

      remark:
        record.remark || "",
    });

    setError("");
    setShowForm(true);
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.studentId) {
        setError(
          "Please select a student."
        );
        setSaving(false);
        return;
      }

      if (!form.itemName.trim()) {
        setError(
          "Please enter item name."
        );
        setSaving(false);
        return;
      }

      if (!form.amount) {
        setError(
          "Please enter amount."
        );
        setSaving(false);
        return;
      }

      const amount =
        Number(form.amount);

      const paidAmount =
        Number(
          form.paidAmount || 0
        );

      if (
        Number.isNaN(amount) ||
        amount < 0
      ) {
        setError(
          "Please enter a valid amount."
        );
        setSaving(false);
        return;
      }

      if (
        Number.isNaN(paidAmount) ||
        paidAmount < 0
      ) {
        setError(
          "Please enter a valid paid amount."
        );
        setSaving(false);
        return;
      }

      if (paidAmount > amount) {
        setError(
          "Paid amount cannot be greater than total amount."
        );
        setSaving(false);
        return;
      }

      const payload = {
        studentId:
          form.studentId,

        studentName:
          form.studentName,

        registrationNo:
          form.registrationNo,

        itemName:
          form.itemName.trim(),

        amount,

        paidAmount,

        issueDate:
          form.issueDate,

        paymentDate:
          paidAmount > 0
            ? form.paymentDate ||
              new Date()
                .toISOString()
                .split("T")[0]
            : null,

        paymentMode:
          form.paymentMode,

        remark:
          form.remark.trim(),
      };

      const url = editingId
        ? `${API_URL}/inventory/${editingId}`
        : `${API_URL}/inventory`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to save inventory."
        );
      }

      setShowForm(false);
      setEditingId(null);
      setSelectedStudent(null);
      setStudentSearch("");
      setForm(emptyForm);

      await fetchInventory();
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save inventory."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this inventory record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/inventory/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete record."
        );
      }

      await fetchInventory();
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete record."
      );
    }
  };

  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatCurrency = (
    amount: number
  ) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const statusBadge = (
    status: InventoryStatus
  ) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-800 border border-green-300";
    }

    if (status === "Partial") {
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    }

    return "bg-red-100 text-red-800 border border-red-300";
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-extrabold text-gray-950">
              📦 Inventory Management
            </h1>

            <p className="text-base font-medium text-gray-700 mt-1">
              Manage student items, payments and pending amounts.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-base shadow-sm"
          >
            + Add Inventory
          </button>

        </div>

      </div>

      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (
        <div className="mb-5 rounded-lg border-2 border-red-200 bg-red-50 text-red-800 px-4 py-3 font-semibold">
          {error}
        </div>
      )}

      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-5">
          <p className="text-sm font-bold text-gray-700">
            Total Records
          </p>

          <p className="text-3xl font-extrabold text-gray-950 mt-1">
            {summary.totalRecords}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-5">
          <p className="text-sm font-bold text-gray-700">
            Total Amount
          </p>

          <p className="text-3xl font-extrabold text-blue-700 mt-1">
            {formatCurrency(
              summary.totalAmount
            )}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-green-200 p-5">
          <p className="text-sm font-bold text-gray-700">
            Total Paid
          </p>

          <p className="text-3xl font-extrabold text-green-700 mt-1">
            {formatCurrency(
              summary.totalPaid
            )}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-5">
          <p className="text-sm font-bold text-gray-700">
            Total Pending
          </p>

          <p className="text-3xl font-extrabold text-red-700 mt-1">
            {formatCurrency(
              summary.totalPending
            )}
          </p>
        </div>

      </div>

      {/* ====================================================
          STATUS
      ==================================================== */}

      <div className="grid grid-cols-3 gap-3 mb-6">

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm font-bold text-green-800">
            Paid
          </p>

          <p className="text-2xl font-extrabold text-green-800">
            {summary.paidCount}
          </p>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-bold text-yellow-800">
            Partial
          </p>

          <p className="text-2xl font-extrabold text-yellow-800">
            {summary.partialCount}
          </p>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-sm font-bold text-red-800">
            Unpaid
          </p>

          <p className="text-2xl font-extrabold text-red-800">
            {summary.unpaidCount}
          </p>
        </div>

      </div>

      {/* ====================================================
          FILTERS
      ==================================================== */}

      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="lg:col-span-1">

            <label className="block text-sm font-extrabold text-gray-900 mb-2">
              Search Inventory
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Student / Registration / Item"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base font-medium text-gray-900 placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
            />

          </div>

          <div>

            <label className="block text-sm font-extrabold text-gray-900 mb-2">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | InventoryStatus
                )
              }
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base font-semibold text-gray-900 bg-white focus:border-red-500 outline-none"
            >
              <option value="All">
                All Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Partial">
                Partial
              </option>

              <option value="Unpaid">
                Unpaid
              </option>
            </select>

          </div>

          <div>

            <label className="block text-sm font-extrabold text-gray-900 mb-2">
              Month
            </label>

            <select
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base font-semibold text-gray-900 bg-white focus:border-red-500 outline-none"
            >
              <option value="">
                All Months
              </option>

              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map(
                (name, index) => (
                  <option
                    key={name}
                    value={index + 1}
                  >
                    {name}
                  </option>
                )
              )}
            </select>

          </div>

          <div>

            <label className="block text-sm font-extrabold text-gray-900 mb-2">
              Year
            </label>

            <select
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base font-semibold text-gray-900 bg-white focus:border-red-500 outline-none"
            >
              <option value="">
                All Years
              </option>

              <option value="2025">
                2025
              </option>

              <option value="2026">
                2026
              </option>

              <option value="2027">
                2027
              </option>

              <option value="2028">
                2028
              </option>
            </select>

          </div>

        </div>

        {(search ||
          statusFilter !== "All" ||
          month ||
          year) && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setMonth("");
              setYear("");
            }}
            className="mt-4 text-sm font-bold text-red-700 hover:text-red-900"
          >
            Clear Filters
          </button>
        )}

      </div>

      {/* ====================================================
          ADD / EDIT FORM
      ==================================================== */}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 mb-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-extrabold text-gray-950">
                {editingId
                  ? "Edit Inventory"
                  : "Add Inventory"}
              </h2>

              <p className="text-base font-medium text-gray-700 mt-1">
                Select student and enter item payment details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setSelectedStudent(null);
                setStudentSearch("");
              }}
              className="text-2xl font-bold text-gray-600 hover:text-red-600"
            >
              ✕
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ==================================================
                STUDENT SEARCH
            ================================================== */}

            <div className="relative">

              <label className="block text-base font-extrabold text-gray-950 mb-2">
                🔍 Search Student *
              </label>

              <input
                type="text"
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(
                    e.target.value
                  );
                  setShowStudentResults(true);

                  if (
                    !e.target.value
                  ) {
                    clearStudent();
                  }
                }}
                onFocus={() =>
                  setShowStudentResults(true)
                }
                placeholder="Search by student name, mobile or registration number..."
                className="w-full border-2 border-gray-400 rounded-lg px-4 py-3.5 text-base font-semibold text-gray-950 placeholder:text-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
              />

              {/* SEARCH RESULTS */}

              {showStudentResults &&
                studentSearch.trim() &&
                filteredStudents.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-2xl max-h-72 overflow-y-auto">

                    {filteredStudents.map(
                      (student) => (
                        <button
                          type="button"
                          key={student._id}
                          onClick={() =>
                            handleStudentSelect(
                              student
                            )
                          }
                          className="w-full text-left px-5 py-4 hover:bg-red-50 border-b border-gray-200 last:border-b-0"
                        >

                          <p className="text-base font-extrabold text-gray-950">
                            {student.name ||
                              "N/A"}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-1">

                            <span className="text-sm font-semibold text-gray-700">
                              📋{" "}
                              {student.registrationNo ||
                                "No Registration"}
                            </span>

                            <span className="text-sm font-semibold text-gray-700">
                              📱{" "}
                              {student.mobile ||
                                "No Mobile"}
                            </span>

                          </div>

                        </button>
                      )
                    )}

                  </div>
                )}

              {showStudentResults &&
                studentSearch.trim() &&
                filteredStudents.length ===
                  0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-5">
                    <p className="text-base font-semibold text-gray-700">
                      No student found.
                    </p>
                  </div>
                )}

            </div>

            {/* ==================================================
                SELECTED STUDENT
            ================================================== */}

            {selectedStudent && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">

                <div className="flex items-center justify-between mb-4">

                  <h3 className="text-lg font-extrabold text-gray-950">
                    ✓ Selected Student
                  </h3>

                  <button
                    type="button"
                    onClick={
                      clearStudent
                    }
                    className="text-sm font-extrabold text-red-700 hover:text-red-900"
                  >
                    Change Student
                  </button>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  <div>
                    <p className="text-xs font-extrabold text-gray-600 uppercase">
                      Student Name
                    </p>

                    <p className="text-lg font-extrabold text-gray-950 mt-1">
                      {selectedStudent.name ||
                        form.studentName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-gray-600 uppercase">
                      Registration No.
                    </p>

                    <p className="text-lg font-extrabold text-gray-950 mt-1">
                      {selectedStudent.registrationNo ||
                        form.registrationNo}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-gray-600 uppercase">
                      Mobile
                    </p>

                    <p className="text-lg font-extrabold text-gray-950 mt-1">
                      {selectedStudent.mobile ||
                        "N/A"}
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* ==================================================
                ITEM + PAYMENT
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

              <div>

                <label className="block text-sm font-extrabold text-gray-950 mb-2">
                  Item Name *
                </label>

                <input
                  name="itemName"
                  value={
                    form.itemName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Karate Gi / Belt / T-Shirt"
                  className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-semibold text-gray-950 placeholder:text-gray-500 focus:border-red-600 outline-none"
                />

              </div>

              <div>

                <label className="block text-sm font-extrabold text-gray-950 mb-2">
                  Amount *
                </label>

                <input
                  type="number"
                  min="0"
                  name="amount"
                  value={
                    form.amount
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="1200"
                  className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-semibold text-gray-950 placeholder:text-gray-500 focus:border-red-600 outline-none"
                />

              </div>

              <div>

                <label className="block text-sm font-extrabold text-gray-950 mb-2">
                  Paid Amount
                </label>

                <input
                  type="number"
                  min="0"
                  name="paidAmount"
                  value={
                    form.paidAmount
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="0"
                  className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-semibold text-gray-950 placeholder:text-gray-500 focus:border-red-600 outline-none"
                />

              </div>

              <div>

                <label className="block text-sm font-extrabold text-gray-950 mb-2">
                  Payment Mode
                </label>

                <select
                  name="paymentMode"
                  value={
                    form.paymentMode
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-semibold text-gray-950 bg-white focus:border-red-600 outline-none"
                >
                  <option value="">
                    Select Mode
                  </option>

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

            </div>

            {/* ==================================================
                DATES + REMARK
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <div>

                <label className="block text-sm font-extrabold text-gray-950 mb-2">
                  Issue Date *
                </label>

                <input
                  type="date"
                  name="issueDate"
                  value={
                    form.issueDate
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-semibold text-gray-950 focus:border-red-600 outline-none"
                />

              </div>

              <div>

                <label className="block text-sm font-extrabold text-gray-950 mb-2">
                  Payment Date
                </label>

                <input
                  type="date"
                  name="paymentDate"
                  value={
                    form.paymentDate
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    Number(
                      form.paidAmount
                    ) <= 0
                  }
                  className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-semibold text-gray-950 disabled:bg-gray-100 focus:border-red-600 outline-none"
                />

              </div>

              <div>

                <label className="block text-sm font-extrabold text-gray-950 mb-2">
                  Remark
                </label>

                <input
                  name="remark"
                  value={
                    form.remark
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Optional - e.g. Partial payment"
                  className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-semibold text-gray-950 placeholder:text-gray-500 focus:border-red-600 outline-none"
                />

              </div>

            </div>

            {/* ==================================================
                PAYMENT SUMMARY
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">

                <p className="text-sm font-bold text-gray-700">
                  Total Amount
                </p>

                <p className="text-2xl font-extrabold text-gray-950 mt-1">
                  {formatCurrency(
                    Number(
                      form.amount || 0
                    )
                  )}
                </p>

              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">

                <p className="text-sm font-bold text-green-800">
                  Paid
                </p>

                <p className="text-2xl font-extrabold text-green-800 mt-1">
                  {formatCurrency(
                    Number(
                      form.paidAmount ||
                        0
                    )
                  )}
                </p>

              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">

                <p className="text-sm font-bold text-red-800">
                  Pending
                </p>

                <p className="text-2xl font-extrabold text-red-800 mt-1">
                  {formatCurrency(
                    Math.max(
                      Number(
                        form.amount || 0
                      ) -
                        Number(
                          form.paidAmount ||
                            0
                        ),
                      0
                    )
                  )}
                </p>

              </div>

            </div>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setSelectedStudent(null);
                  setStudentSearch("");
                }}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-800 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-7 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-extrabold disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Inventory"
                  : "Save Inventory"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ====================================================
          INVENTORY TABLE
      ==================================================== */}

      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">

        <div className="px-6 py-5 border-b-2 border-gray-200 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-extrabold text-gray-950">
              📦 Inventory Records
            </h2>

            <p className="text-sm font-semibold text-gray-600 mt-1">
              {records.length} record
              {records.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <button
            onClick={fetchInventory}
            className="px-4 py-2 border-2 border-blue-200 rounded-lg text-blue-700 font-bold hover:bg-blue-50"
          >
            ↻ Refresh
          </button>

        </div>

        {loading ? (

          <div className="p-12 text-center">

            <p className="text-lg font-bold text-gray-800">
              Loading Inventory...
            </p>

          </div>

        ) : records.length === 0 ? (

          <div className="p-12 text-center">

            <div className="text-5xl mb-4">
              📦
            </div>

            <p className="text-xl font-extrabold text-gray-900">
              No Inventory Records Found
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1700px] border-collapse">

              <thead>

                <tr className="bg-gray-100 border-b-2 border-gray-300">

                  <th className="px-5 py-4 text-left text-sm font-extrabold text-gray-950">
                    Student
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-extrabold text-gray-950">
                    Registration No.
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-extrabold text-gray-950">
                    Item
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-extrabold text-gray-950">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-extrabold text-green-800">
                    Paid
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-extrabold text-red-800">
                    Pending
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-extrabold text-gray-950">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-extrabold text-gray-950">
                    Issue Date
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-extrabold text-gray-950">
                    Payment Date
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-extrabold text-gray-950">
                    Payment Mode
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-extrabold text-gray-950">
                    Remark
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-extrabold text-gray-950">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {records.map(
                  (record) => (

                    <tr
                      key={record._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >

                      <td className="px-5 py-5">

                        <p className="text-base font-extrabold text-gray-950">
                          {record.studentName}
                        </p>

                        <p className="text-xs font-semibold text-gray-600 mt-1">
                          {record.registrationNo}
                        </p>

                      </td>

                      <td className="px-5 py-5">

                        <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
                          {record.registrationNo}
                        </span>

                      </td>

                      <td className="px-5 py-5">

                        <span className="text-base font-extrabold text-gray-950 whitespace-nowrap">
                          {record.itemName}
                        </span>

                      </td>

                      <td className="px-5 py-5 text-right">

                        <span className="text-base font-extrabold text-blue-700 whitespace-nowrap">
                          {formatCurrency(
                            record.amount
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-5 text-right">

                        <span className="text-base font-extrabold text-green-700 whitespace-nowrap">
                          {formatCurrency(
                            record.paidAmount
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-5 text-right">

                        <span
                          className={`text-base font-extrabold whitespace-nowrap ${
                            record.pendingAmount >
                            0
                              ? "text-red-700"
                              : "text-gray-600"
                          }`}
                        >
                          {formatCurrency(
                            record.pendingAmount
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-5 text-center">

                        <span
                          className={`inline-flex px-3 py-2 rounded-full text-sm font-extrabold ${statusBadge(
                            record.status
                          )}`}
                        >
                          {record.status ===
                            "Paid" &&
                            "✓ "}

                          {record.status ===
                            "Partial" &&
                            "◐ "}

                          {record.status ===
                            "Unpaid" &&
                            "⚠ "}

                          {record.status}
                        </span>

                      </td>

                      <td className="px-5 py-5">

                        <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
                          {formatDate(
                            record.issueDate
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-5">

                        <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
                          {formatDate(
                            record.paymentDate
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-5">

                        {record.paymentMode ? (

                          <span className="inline-flex px-3 py-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-sm font-extrabold whitespace-nowrap">
                            {
                              record.paymentMode
                            }
                          </span>

                        ) : (

                          <span className="text-sm font-semibold text-gray-500">
                            —
                          </span>

                        )}

                      </td>

                      <td className="px-5 py-5">

                        <div className="min-w-[220px]">

                          {record.remark ? (

                            <span className="text-sm font-semibold text-gray-800 break-words">
                              {record.remark}
                            </span>

                          ) : (

                            <span className="text-sm font-semibold text-gray-500">
                              —
                            </span>

                          )}

                        </div>

                      </td>

                      <td className="px-5 py-5">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() =>
                              openEditForm(
                                record
                              )
                            }
                            className="px-3 py-2 text-sm font-extrabold text-blue-700 border-2 border-blue-200 rounded-lg hover:bg-blue-50 whitespace-nowrap"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                record._id
                              )
                            }
                            className="px-3 py-2 text-sm font-extrabold text-red-700 border-2 border-red-200 rounded-lg hover:bg-red-50 whitespace-nowrap"
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminInventory;