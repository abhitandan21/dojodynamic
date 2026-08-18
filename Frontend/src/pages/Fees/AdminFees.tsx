import {
  useEffect,
  useMemo,
  useState,
} from "react";

// ==========================================================
// API
// ==========================================================

const API_URL =
  "http://localhost:4001/api";

// ==========================================================
// TYPES
// ==========================================================

interface Student {
  _id: string;
  name?: string;
  studentName?: string;
  registrationNo?: string;
  regNo?: string;
}

interface Fee {
  _id: string;

  studentId: string;
  studentName: string;
  registrationNo: string;

  month: number;
  year: number;

  amount: number;
  paidAmount: number;
  pendingAmount: number;

  status:
    | "Paid"
    | "Partial"
    | "Pending";

  dueDate?: string;
  paymentDate?: string;

  paymentMode?:
    | "Cash"
    | "UPI"
    | "Bank Transfer"
    | "Other"
    | "";

  receiptNo?: string;
  remark?: string;

  reminderLastSentAt?: string | null;
  reminderCount?: number;

  createdAt?: string;
  updatedAt?: string;
}

// ==========================================================
// FORM TYPE
// ==========================================================

interface FeeForm {
  studentId: string;
  studentName: string;
  registrationNo: string;

  month: number;
  year: number;

  amount: string;
  paidAmount: string;

  dueDate: string;
  paymentDate: string;

  paymentMode:
    | "Cash"
    | "UPI"
    | "Bank Transfer"
    | "Other"
    | "";

  receiptNo: string;
  remark: string;
}

// ==========================================================
// MONTHS
// ==========================================================

const months = [
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
];

// ==========================================================
// COMPONENT
// ==========================================================

const AdminFees = () => {
  const today = new Date();

  const currentMonth =
    today.getMonth() + 1;

  const currentYear =
    today.getFullYear();

  // ========================================================
  // DATA
  // ========================================================

  const [students, setStudents] =
    useState<Student[]>([]);

  const [fees, setFees] =
    useState<Fee[]>([]);

  // ========================================================
  // LOADING
  // ========================================================

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const [loadingFees, setLoadingFees] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // ========================================================
  // FILTERS
  // ========================================================

  const [filterMonth, setFilterMonth] =
    useState<number>(currentMonth);

  const [filterYear, setFilterYear] =
    useState<number>(currentYear);

  const [filterStatus, setFilterStatus] =
    useState<
      "All" | "Paid" | "Partial" | "Pending"
    >("All");

  const [search, setSearch] =
    useState("");

  // ========================================================
  // FORM
  // ========================================================

  const emptyForm: FeeForm = {
    studentId: "",
    studentName: "",
    registrationNo: "",

    month: currentMonth,
    year: currentYear,

    amount: "",
    paidAmount: "0",

    dueDate: "",
    paymentDate: "",

    paymentMode: "",

    receiptNo: "",
    remark: "",
  };

  const [form, setForm] =
    useState<FeeForm>(
      emptyForm
    );

  // ========================================================
  // EDIT MODE
  // ========================================================

  const [editingFeeId, setEditingFeeId] =
    useState<string | null>(null);

  // ========================================================
  // STUDENT SEARCH
  // ========================================================

  const [studentSearch, setStudentSearch] =
    useState("");

  // ========================================================
  // DELETE LOADING
  // ========================================================

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // ========================================================
  // SUCCESS / ERROR MESSAGE
  // ========================================================

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // ========================================================
  // YEAR OPTIONS
  // ========================================================

  const years = Array.from(
    { length: 5 },
    (_, index) =>
      currentYear - 2 + index
  );

  // ========================================================
  // CLEAR MESSAGE
  // ========================================================

  const clearMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  // ========================================================
  // GET STUDENT NAME
  // ========================================================

  const getStudentName = (
    student: Student
  ) => {
    return (
      student.name ||
      student.studentName ||
      "Unknown Student"
    );
  };

  // ========================================================
  // GET REGISTRATION NO
  // ========================================================

  const getRegistrationNo = (
    student: Student
  ) => {
    return (
      student.registrationNo ||
      student.regNo ||
      "N/A"
    );
  };

  // ========================================================
  // LOAD STUDENTS
  // ========================================================

  const loadStudents =
    async () => {
      try {
        setLoadingStudents(true);

        const response =
          await fetch(
            `${API_URL}/students`
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to load students."
          );
        }

        const list =
          Array.isArray(result)
            ? result
            : result.students || [];

        setStudents(list);

      } catch (error) {
        console.error(
          "Load Students Error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load students."
        );

      } finally {
        setLoadingStudents(false);
      }
    };

  // ========================================================
  // LOAD FEES
  // ========================================================

  const loadFees =
    async () => {
      try {
        setLoadingFees(true);

        let url =
          `${API_URL}/fees?month=${filterMonth}&year=${filterYear}`;

        if (
          filterStatus !==
          "All"
        ) {
          url += `&status=${filterStatus}`;
        }

        const response =
          await fetch(url);

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to load fees."
          );
        }

        setFees(
          result.fees || []
        );

      } catch (error) {
        console.error(
          "Load Fees Error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load fees."
        );

      } finally {
        setLoadingFees(false);
      }
    };

  // ========================================================
  // INITIAL LOAD
  // ========================================================

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadFees();
  }, [
    filterMonth,
    filterYear,
    filterStatus,
  ]);

  // ========================================================
  // FILTERED STUDENTS
  // ========================================================

  const filteredStudents =
    useMemo(() => {
      const value =
        studentSearch
          .trim()
          .toLowerCase();

      if (!value) {
        return students;
      }

      return students.filter(
        (student) => {
          const name =
            getStudentName(
              student
            ).toLowerCase();

          const registration =
            getRegistrationNo(
              student
            ).toLowerCase();

          return (
            name.includes(value) ||
            registration.includes(value)
          );
        }
      );
    }, [
      students,
      studentSearch,
    ]);

  // ========================================================
  // TABLE SEARCH
  // ========================================================

  const filteredFees =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return fees;
      }

      return fees.filter(
        (fee) =>
          fee.studentName
            .toLowerCase()
            .includes(value) ||
          fee.registrationNo
            .toLowerCase()
            .includes(value)
      );
    }, [
      fees,
      search,
    ]);

  // ========================================================
  // SUMMARY
  // ========================================================

  const summary =
    useMemo(() => {
      return fees.reduce(
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
    }, [fees]);

  // ========================================================
  // FORM PENDING
  // ========================================================

  const formAmount =
    Number(form.amount) || 0;

  const formPaid =
    Number(form.paidAmount) || 0;

  const formPending =
    Math.max(
      formAmount -
        Math.min(
          Math.max(
            formPaid,
            0
          ),
          formAmount
        ),
      0
    );

  const formStatus =
    formAmount <= 0
      ? "Pending"
      : formPaid >=
        formAmount
      ? "Paid"
      : formPaid > 0
      ? "Partial"
      : "Pending";

  // ========================================================
  // SELECT STUDENT
  // ========================================================

  const handleStudentSelect = (
    studentId: string
  ) => {
    const student =
      students.find(
        (item) =>
          item._id ===
          studentId
      );

    if (!student) {
      setForm((prev) => ({
        ...prev,
        studentId: "",
        studentName: "",
        registrationNo: "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,

      studentId:
        student._id,

      studentName:
        getStudentName(
          student
        ),

      registrationNo:
        getRegistrationNo(
          student
        ),
    }));
  };

  // ========================================================
  // RESET FORM
  // ========================================================

  const resetForm =
    () => {
      setForm(
        emptyForm
      );

      setEditingFeeId(
        null
      );

      setStudentSearch("");

      clearMessages();
    };

  // ========================================================
  // CREATE FEE
  // ========================================================

  const createFee =
    async () => {
      try {
        clearMessages();

        if (
          !form.studentId
        ) {
          setErrorMessage(
            "Please select a student."
          );
          return;
        }

        if (
          !form.amount ||
          Number(
            form.amount
          ) <= 0
        ) {
          setErrorMessage(
            "Please enter a valid fee amount."
          );
          return;
        }

        if (
          Number(
            form.paidAmount
          ) < 0
        ) {
          setErrorMessage(
            "Paid amount cannot be negative."
          );
          return;
        }

        if (
          Number(
            form.paidAmount
          ) >
          Number(
            form.amount
          )
        ) {
          setErrorMessage(
            "Paid amount cannot be greater than fee amount."
          );
          return;
        }

        setSaving(true);

        const response =
          await fetch(
            `${API_URL}/fees`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  studentId:
                    form.studentId,

                  studentName:
                    form.studentName,

                  registrationNo:
                    form.registrationNo,

                  month:
                    form.month,

                  year:
                    form.year,

                  amount:
                    Number(
                      form.amount
                    ),

                  paidAmount:
                    Number(
                      form.paidAmount
                    ),

                  dueDate:
                    form.dueDate,

                  paymentDate:
                    form.paymentDate,

                  paymentMode:
                    form.paymentMode,

                  receiptNo:
                    form.receiptNo,

                  remark:
                    form.remark,
                }
              ),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to create fee."
          );
        }

        setMessage(
          "Fee record created successfully."
        );

        resetForm();

        await loadFees();

      } catch (error) {
        console.error(
          "Create Fee Error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to create fee."
        );

      } finally {
        setSaving(false);
      }
    };

  // ========================================================
  // START EDIT
  // ========================================================

  const startEdit =
    (fee: Fee) => {
      clearMessages();

      setEditingFeeId(
        fee._id
      );

      setForm({
        studentId:
          fee.studentId,

        studentName:
          fee.studentName,

        registrationNo:
          fee.registrationNo,

        month:
          fee.month,

        year:
          fee.year,

        amount:
          String(
            fee.amount
          ),

        paidAmount:
          String(
            fee.paidAmount
          ),

        dueDate:
          fee.dueDate || "",

        paymentDate:
          fee.paymentDate ||
          "",

        paymentMode:
          fee.paymentMode ||
          "",

        receiptNo:
          fee.receiptNo ||
          "",

        remark:
          fee.remark ||
          "",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // ========================================================
  // UPDATE FEE
  // ========================================================

  const updateFee =
    async () => {
      try {
        clearMessages();

        if (
          !editingFeeId
        ) {
          return;
        }

        if (
          !form.amount ||
          Number(
            form.amount
          ) <= 0
        ) {
          setErrorMessage(
            "Please enter a valid fee amount."
          );
          return;
        }

        if (
          Number(
            form.paidAmount
          ) < 0
        ) {
          setErrorMessage(
            "Paid amount cannot be negative."
          );
          return;
        }

        if (
          Number(
            form.paidAmount
          ) >
          Number(
            form.amount
          )
        ) {
          setErrorMessage(
            "Paid amount cannot be greater than fee amount."
          );
          return;
        }

        setSaving(true);

        const response =
          await fetch(
            `${API_URL}/fees/${editingFeeId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  amount:
                    Number(
                      form.amount
                    ),

                  paidAmount:
                    Number(
                      form.paidAmount
                    ),

                  dueDate:
                    form.dueDate,

                  paymentDate:
                    form.paymentDate,

                  paymentMode:
                    form.paymentMode,

                  receiptNo:
                    form.receiptNo,

                  remark:
                    form.remark,
                }
              ),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to update fee."
          );
        }

        setMessage(
          "Fee record updated successfully."
        );

        resetForm();

        await loadFees();

      } catch (error) {
        console.error(
          "Update Fee Error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update fee."
        );

      } finally {
        setSaving(false);
      }
    };

  // ========================================================
  // DELETE FEE
  // ========================================================

  const deleteFee =
    async (id: string) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this fee record?"
        );

      if (!confirmed) {
        return;
      }

      try {
        clearMessages();

        setDeletingId(
          id
        );

        const response =
          await fetch(
            `${API_URL}/fees/${id}`,
            {
              method: "DELETE",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to delete fee."
          );
        }

        setMessage(
          "Fee record deleted successfully."
        );

        await loadFees();

      } catch (error) {
        console.error(
          "Delete Fee Error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to delete fee."
        );

      } finally {
        setDeletingId(
          null
        );
      }
    };

  // ========================================================
  // FORMAT DATE
  // ========================================================

  const formatDate = (
    value?: string
  ) => {
    if (!value) {
      return "-";
    }

    const date =
      new Date(
        `${value}T00:00:00`
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================================
  // FORMAT CURRENCY
  // ========================================================

  const money = (
    value: number
  ) => {
    return `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    )}`;
  };

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-extrabold text-gray-900">
                💰 Fees Management
              </h1>

              <p className="text-gray-600 mt-2">
                Manage student fees,
                payments and pending
                amounts.
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm font-semibold text-gray-500">
                Current Month
              </p>

              <p className="text-lg font-bold text-gray-900">
                {
                  months[
                    currentMonth -
                      1
                  ]
                }{" "}
                {currentYear}
              </p>

            </div>

          </div>

        </div>


        {/* ==================================================
            MESSAGES
        ================================================== */}

        {message && (

          <div className="bg-green-100 border border-green-300 text-green-800 px-5 py-3 rounded-lg mb-5 font-semibold">
            ✓ {message}
          </div>

        )}

        {errorMessage && (

          <div className="bg-red-100 border border-red-300 text-red-800 px-5 py-3 rounded-lg mb-5 font-semibold">
            ✕ {errorMessage}
          </div>

        )}


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-5">

            <p className="text-sm font-bold text-gray-600">
              Total Fees
            </p>

            <p className="text-3xl font-extrabold text-blue-700 mt-2">
              {money(
                summary.totalFees
              )}
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-5">

            <p className="text-sm font-bold text-gray-600">
              Collected
            </p>

            <p className="text-3xl font-extrabold text-green-700 mt-2">
              {money(
                summary.totalPaid
              )}
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-5">

            <p className="text-sm font-bold text-gray-600">
              Pending
            </p>

            <p className="text-3xl font-extrabold text-red-700 mt-2">
              {money(
                summary.totalPending
              )}
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-sm border-l-4 border-purple-500 p-5">

            <p className="text-sm font-bold text-gray-600">
              Paid Records
            </p>

            <p className="text-3xl font-extrabold text-purple-700 mt-2">
              {
                summary.paidCount
              }
            </p>

          </div>

        </div>


        {/* ==================================================
            ADD / EDIT FEE FORM
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-extrabold text-gray-900">
                {editingFeeId
                  ? "✏️ Edit Fee / Payment"
                  : "➕ Add Fee"}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                Enter the actual fee
                amount applicable to
                this student.
              </p>

            </div>

            {editingFeeId && (

              <button
                type="button"
                onClick={
                  resetForm
                }
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-bold"
              >
                Cancel Edit
              </button>

            )}

          </div>


          {/* STUDENT */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Search Student
              </label>

              <input
                type="text"
                value={
                  studentSearch
                }
                onChange={(e) =>
                  setStudentSearch(
                    e.target.value
                  )
                }
                placeholder="Search by name or registration number..."
                disabled={
                  !!editingFeeId
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white placeholder-gray-400 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />

            </div>


            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Select Student
              </label>

              <select
                value={
                  form.studentId
                }
                onChange={(e) =>
                  handleStudentSelect(
                    e.target.value
                  )
                }
                disabled={
                  !!editingFeeId ||
                  loadingStudents
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500 disabled:bg-gray-100"
              >

                <option value="">
                  {loadingStudents
                    ? "Loading students..."
                    : "-- Select Student --"}
                </option>

                {filteredStudents.map(
                  (
                    student
                  ) => (

                    <option
                      key={
                        student._id
                      }
                      value={
                        student._id
                      }
                    >
                      {
                        getStudentName(
                          student
                        )
                      }{" "}
                      —{" "}
                      {
                        getRegistrationNo(
                          student
                        )
                      }
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          {/* STUDENT INFORMATION */}

          {form.studentId && (

            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div>

                  <p className="text-xs font-bold text-blue-600 uppercase">
                    Student
                  </p>

                  <p className="text-base font-extrabold text-gray-900">
                    {
                      form.studentName
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs font-bold text-blue-600 uppercase">
                    Registration No.
                  </p>

                  <p className="text-base font-extrabold text-gray-900">
                    {
                      form.registrationNo
                    }
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* MONTH YEAR */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Fee Month
              </label>

              <select
                value={
                  form.month
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      month: Number(
                        e.target
                          .value
                      ),
                    })
                  )
                }
                disabled={
                  !!editingFeeId
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500 disabled:bg-gray-100"
              >

                {months.map(
                  (
                    month,
                    index
                  ) => (

                    <option
                      key={
                        index
                      }
                      value={
                        index + 1
                      }
                    >
                      {month}
                    </option>

                  )
                )}

              </select>

            </div>


            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Fee Year
              </label>

              <select
                value={
                  form.year
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      year: Number(
                        e.target
                          .value
                      ),
                    })
                  )
                }
                disabled={
                  !!editingFeeId
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500 disabled:bg-gray-100"
              >

                {years.map(
                  (year) => (

                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          {/* AMOUNTS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Fee Amount ₹
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.amount
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      amount:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="e.g. 600"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              />

            </div>


            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Paid Amount ₹
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.paidAmount
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      paidAmount:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="e.g. 300"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              />

            </div>


            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Pending Amount ₹
              </label>

              <input
                type="number"
                value={
                  formPending
                }
                readOnly
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-gray-100 font-bold"
              />

            </div>

          </div>


          {/* STATUS */}

          <div className="mt-4">

            <span className="text-sm font-bold text-gray-700">
              Status:{" "}
            </span>

            {formStatus ===
              "Paid" && (

              <span className="inline-flex bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-xs font-extrabold">
                PAID
              </span>

            )}

            {formStatus ===
              "Partial" && (

              <span className="inline-flex bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-xs font-extrabold">
                PARTIAL
              </span>

            )}

            {formStatus ===
              "Pending" && (

              <span className="inline-flex bg-red-100 border border-red-300 text-red-800 px-3 py-1 rounded-full text-xs font-extrabold">
                PENDING
              </span>

            )}

          </div>


          {/* PAYMENT DETAILS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Due Date
              </label>

              <input
                type="date"
                value={
                  form.dueDate
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      dueDate:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              />

            </div>


            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Payment Date
              </label>

              <input
                type="date"
                value={
                  form.paymentDate
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      paymentDate:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              />

            </div>


            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Payment Mode
              </label>

              <select
                value={
                  form.paymentMode
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      paymentMode:
                        e.target
                          .value as FeeForm["paymentMode"],
                    })
                  )
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              >

                <option value="">
                  -- Select Mode --
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


          {/* OPTIONAL */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Receipt No.{" "}
                <span className="text-gray-400 font-normal">
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                value={
                  form.receiptNo
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      receiptNo:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="Optional"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              />

            </div>


            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Remark{" "}
                <span className="text-gray-400 font-normal">
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                value={
                  form.remark
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      remark:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="e.g. Advance, discount, adjustment..."
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              />

            </div>

          </div>


          {/* ACTION */}

          <div className="flex gap-3 mt-6">

            <button
              type="button"
              onClick={
                editingFeeId
                  ? updateFee
                  : createFee
              }
              disabled={
                saving
              }
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-extrabold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving
                ? "Saving..."
                : editingFeeId
                ? "Update Fee"
                : "Save Fee"}
            </button>

            {!editingFeeId && (

              <button
                type="button"
                onClick={
                  resetForm
                }
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold"
              >
                Clear
              </button>

            )}

          </div>

        </div>


        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-xl font-extrabold text-gray-900">
                📋 Fee Records
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                View and manage monthly
                fee records.
              </p>

            </div>

            <button
              type="button"
              onClick={
                loadFees
              }
              disabled={
                loadingFees
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold disabled:bg-gray-400"
            >
              {loadingFees
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* MONTH */}

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Month
              </label>

              <select
                value={
                  filterMonth
                }
                onChange={(e) =>
                  setFilterMonth(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              >

                {months.map(
                  (
                    month,
                    index
                  ) => (

                    <option
                      key={
                        index
                      }
                      value={
                        index + 1
                      }
                    >
                      {month}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* YEAR */}

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Year
              </label>

              <select
                value={
                  filterYear
                }
                onChange={(e) =>
                  setFilterYear(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              >

                {years.map(
                  (year) => (

                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* STATUS */}

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Status
              </label>

              <select
                value={
                  filterStatus
                }
                onChange={(e) =>
                  setFilterStatus(
                    e.target
                      .value as
                      | "All"
                      | "Paid"
                      | "Partial"
                      | "Pending"
                  )
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:border-blue-500"
              >

                <option value="All">
                  All
                </option>

                <option value="Paid">
                  Paid
                </option>

                <option value="Partial">
                  Partial
                </option>

                <option value="Pending">
                  Pending
                </option>

              </select>

            </div>

          </div>


          {/* SEARCH */}

          <div className="mt-5">

            <label className="block text-sm font-bold text-gray-800 mb-2">
              Search Student
            </label>

            <input
              type="text"
              value={
                search
              }
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search by student name or registration number..."
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white placeholder-gray-400 outline-none focus:border-blue-500"
            />

          </div>

        </div>


        {/* ==================================================
            FEE TABLE
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-900 text-white">

                  <th className="px-4 py-4 text-left text-sm font-bold whitespace-nowrap">
                    S.No
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold whitespace-nowrap">
                    Student
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold whitespace-nowrap">
                    Month
                  </th>

                  <th className="px-4 py-4 text-right text-sm font-bold whitespace-nowrap">
                    Fee
                  </th>

                  <th className="px-4 py-4 text-right text-sm font-bold whitespace-nowrap">
                    Paid
                  </th>

                  <th className="px-4 py-4 text-right text-sm font-bold whitespace-nowrap">
                    Pending
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-bold whitespace-nowrap">
                    Status
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold whitespace-nowrap">
                    Payment
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-bold whitespace-nowrap">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {loadingFees ? (

                  <tr>

                    <td
                      colSpan={9}
                      className="px-5 py-12 text-center"
                    >

                      <p className="text-gray-700 font-bold">
                        Loading fee records...
                      </p>

                    </td>

                  </tr>

                ) : filteredFees.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan={9}
                      className="px-5 py-12 text-center"
                    >

                      <p className="text-gray-800 font-bold text-base">
                        No fee records found.
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        Try another month,
                        year or status.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredFees.map(
                    (
                      fee,
                      index
                    ) => (

                      <tr
                        key={
                          fee._id
                        }
                        className={`border-t border-gray-200 ${
                          index %
                            2 ===
                          0
                            ? "bg-white"
                            : "bg-gray-50"
                        } hover:bg-blue-50`}
                      >

                        {/* S.NO */}

                        <td className="px-4 py-4 text-gray-900 font-bold">
                          {index +
                            1}
                        </td>


                        {/* STUDENT */}

                        <td className="px-4 py-4">

                          <p className="text-gray-900 font-extrabold whitespace-nowrap">
                            {
                              fee.studentName
                            }
                          </p>

                          <p className="text-gray-600 text-xs font-semibold mt-1">
                            {
                              fee.registrationNo
                            }
                          </p>

                        </td>


                        {/* MONTH */}

                        <td className="px-4 py-4">

                          <p className="text-gray-900 font-bold whitespace-nowrap">
                            {
                              months[
                                fee.month -
                                  1
                              ]
                            }
                          </p>

                          <p className="text-gray-600 text-xs font-semibold">
                            {
                              fee.year
                            }
                          </p>

                        </td>


                        {/* FEE */}

                        <td className="px-4 py-4 text-right text-gray-900 font-bold whitespace-nowrap">
                          {money(
                            fee.amount
                          )}
                        </td>


                        {/* PAID */}

                        <td className="px-4 py-4 text-right text-green-700 font-extrabold whitespace-nowrap">
                          {money(
                            fee.paidAmount
                          )}
                        </td>


                        {/* PENDING */}

                        <td className="px-4 py-4 text-right text-red-700 font-extrabold whitespace-nowrap">
                          {money(
                            fee.pendingAmount
                          )}
                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-4 text-center">

                          {fee.status ===
                            "Paid" && (

                            <span className="inline-flex bg-green-100 border border-green-300 text-green-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
                              PAID
                            </span>

                          )}

                          {fee.status ===
                            "Partial" && (

                            <span className="inline-flex bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
                              PARTIAL
                            </span>

                          )}

                          {fee.status ===
                            "Pending" && (

                            <span className="inline-flex bg-red-100 border border-red-300 text-red-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
                              PENDING
                            </span>

                          )}

                        </td>


                        {/* PAYMENT */}

                        <td className="px-4 py-4">

                          <p className="text-gray-900 font-semibold whitespace-nowrap">
                            {
                              fee.paymentMode ||
                              "-"
                            }
                          </p>

                          <p className="text-gray-600 text-xs font-medium mt-1 whitespace-nowrap">
                            {formatDate(
                              fee.paymentDate
                            )}
                          </p>

                        </td>


                        {/* ACTIONS */}

                        <td className="px-4 py-4">

                          <div className="flex items-center justify-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                startEdit(
                                  fee
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                            >
                              Edit
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                deleteFee(
                                  fee._id
                                )
                              }
                              disabled={
                                deletingId ===
                                fee._id
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold disabled:bg-gray-400"
                            >
                              {deletingId ===
                              fee._id
                                ? "..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminFees;