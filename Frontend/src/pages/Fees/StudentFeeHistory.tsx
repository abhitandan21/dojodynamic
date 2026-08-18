import { useEffect, useMemo, useState } from "react";

// ==========================================================
// API
// ==========================================================

const API_URL = "http://localhost:4001/api";

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

  status: "Paid" | "Partial" | "Pending";

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

const StudentFeeHistory = () => {
  const currentYear = new Date().getFullYear();

  // ========================================================
  // STATE
  // ========================================================

  const [students, setStudents] = useState<Student[]>([]);

  const [selectedStudentId, setSelectedStudentId] =
    useState("");

  const [selectedYear, setSelectedYear] =
    useState(currentYear);

  const [searchStudent, setSearchStudent] =
    useState("");

  const [fees, setFees] = useState<Fee[]>([]);

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const [loadingFees, setLoadingFees] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // ========================================================
  // YEAR OPTIONS
  // ========================================================

  const years = Array.from(
    { length: 6 },
    (_, index) => currentYear - 3 + index
  );

  // ========================================================
  // STUDENT NAME
  // ========================================================

  const getStudentName = (student: Student) => {
    return (
      student.name ||
      student.studentName ||
      "Unknown Student"
    );
  };

  // ========================================================
  // REGISTRATION NUMBER
  // ========================================================

  const getRegistrationNo = (student: Student) => {
    return (
      student.registrationNo ||
      student.regNo ||
      "N/A"
    );
  };

  // ========================================================
  // LOAD STUDENTS
  // ========================================================

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/students`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load students."
        );
      }

      const list = Array.isArray(result)
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
  // LOAD STUDENT FEES
  // ========================================================

  const loadStudentFees = async (
    studentId: string
  ) => {
    if (!studentId) {
      setFees([]);
      return;
    }

    try {
      setLoadingFees(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/fees/student/${studentId}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load fee history."
        );
      }

      const list = Array.isArray(
        result.fees
      )
        ? result.fees
        : [];

      setFees(list);
    } catch (error) {
      console.error(
        "Load Fee History Error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load fee history."
      );

      setFees([]);
    } finally {
      setLoadingFees(false);
    }
  };

  // ========================================================
  // INITIAL STUDENTS
  // ========================================================

  useEffect(() => {
    loadStudents();
  }, []);

  // ========================================================
  // LOAD FEES WHEN STUDENT CHANGES
  // ========================================================

  useEffect(() => {
    loadStudentFees(
      selectedStudentId
    );
  }, [selectedStudentId]);

  // ========================================================
  // FILTER STUDENTS
  // ========================================================

  const filteredStudents = useMemo(() => {
    const value =
      searchStudent
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
    searchStudent,
  ]);

  // ========================================================
  // SELECTED STUDENT
  // ========================================================

  const selectedStudent =
    students.find(
      (student) =>
        student._id ===
        selectedStudentId
    );

  // ========================================================
  // YEAR FILTERED FEES
  // ========================================================

  const yearFees = useMemo(() => {
    return fees.filter(
      (fee) =>
        Number(fee.year) ===
        Number(selectedYear)
    );
  }, [
    fees,
    selectedYear,
  ]);

  // ========================================================
  // CREATE 12 MONTH HISTORY
  // ========================================================

  const monthlyHistory = useMemo(() => {
    return months.map(
      (monthName, index) => {
        const monthNumber =
          index + 1;

        const fee =
          yearFees.find(
            (item) =>
              Number(
                item.month
              ) === monthNumber
          );

        return {
          monthNumber,
          monthName,
          fee: fee || null,
        };
      }
    );
  }, [yearFees]);

  // ========================================================
  // SUMMARY
  // ========================================================

  const summary = useMemo(() => {
    let totalFee = 0;
    let totalPaid = 0;
    let totalPending = 0;

    let paidCount = 0;
    let partialCount = 0;
    let pendingCount = 0;

    yearFees.forEach(
      (fee) => {
        totalFee +=
          Number(
            fee.amount
          ) || 0;

        totalPaid +=
          Number(
            fee.paidAmount
          ) || 0;

        totalPending +=
          Number(
            fee.pendingAmount
          ) || 0;

        if (
          fee.status ===
          "Paid"
        ) {
          paidCount++;
        }

        if (
          fee.status ===
          "Partial"
        ) {
          partialCount++;
        }

        if (
          fee.status ===
          "Pending"
        ) {
          pendingCount++;
        }
      }
    );

    return {
      totalFee,
      totalPaid,
      totalPending,
      paidCount,
      partialCount,
      pendingCount,
    };
  }, [yearFees]);

  // ========================================================
  // CURRENCY
  // ========================================================

  const money = (value: number) => {
    return `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    )}`;
  };

  // ========================================================
  // DATE FORMAT
  // ========================================================

  const formatDate = (
    value?: string
  ) => {
    if (!value) {
      return "-";
    }

    const date = new Date(
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
  // STATUS BADGE
  // ========================================================

  const StatusBadge = ({
    status,
  }: {
    status:
      | "Paid"
      | "Partial"
      | "Pending"
      | "Not Entered";
  }) => {
    if (
      status ===
      "Paid"
    ) {
      return (
        <span className="inline-flex bg-green-100 border border-green-300 text-green-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
          ✓ PAID
        </span>
      );
    }

    if (
      status ===
      "Partial"
    ) {
      return (
        <span className="inline-flex bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
          PARTIAL
        </span>
      );
    }

    if (
      status ===
      "Pending"
    ) {
      return (
        <span className="inline-flex bg-red-100 border border-red-300 text-red-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
          PENDING
        </span>
      );
    }

    return (
      <span className="inline-flex bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full text-xs font-extrabold">
        NOT ENTERED
      </span>
    );
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

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <h1 className="text-3xl font-extrabold text-gray-900">
                👤 Student Fee History
              </h1>

              <p className="text-gray-600 mt-2">
                View complete yearly fee
                history of an individual
                student.
              </p>

            </div>

            <div>

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Year
              </label>

              <select
                value={
                  selectedYear
                }
                onChange={(e) =>
                  setSelectedYear(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                className="border-2 border-gray-300 rounded-lg px-5 py-2.5 bg-white text-gray-900 font-bold outline-none focus:border-blue-500"
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

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {errorMessage && (

          <div className="bg-red-100 border border-red-300 text-red-800 px-5 py-3 rounded-lg mb-6 font-semibold">
            ✕ {errorMessage}
          </div>

        )}


        {/* ==================================================
            STUDENT SELECTION
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

          <div className="flex items-center gap-2 mb-5">

            <span className="text-2xl">
              👤
            </span>

            <div>

              <h2 className="text-xl font-extrabold text-gray-900">
                Select Student
              </h2>

              <p className="text-sm text-gray-600">
                Search by student name
                or registration number.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* SEARCH */}

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Search Student
              </label>

              <input
                type="text"
                value={
                  searchStudent
                }
                onChange={(e) =>
                  setSearchStudent(
                    e.target
                      .value
                  )
                }
                placeholder="e.g. Advika or AMAASA/2025/061"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500"
              />

            </div>


            {/* SELECT */}

            <div>

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Select Student
              </label>

              <select
                value={
                  selectedStudentId
                }
                onChange={(e) =>
                  setSelectedStudentId(
                    e.target
                      .value
                  )
                }
                disabled={
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

        </div>


        {/* ==================================================
            NO STUDENT
        ================================================== */}

        {!selectedStudentId && (

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">

            <div className="text-5xl mb-4">
              👤
            </div>

            <h2 className="text-xl font-extrabold text-gray-900">
              Select a Student
            </h2>

            <p className="text-gray-600 mt-2">
              Choose a student above to
              view their complete fee
              history.
            </p>

          </div>

        )}


        {/* ==================================================
            STUDENT DETAILS
        ================================================== */}

        {selectedStudentId &&
          selectedStudent && (

            <>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                      Student
                    </p>

                    <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                      {
                        getStudentName(
                          selectedStudent
                        )
                      }
                    </h2>

                    <p className="text-gray-600 font-semibold mt-1">
                      Registration No.:{" "}
                      {
                        getRegistrationNo(
                          selectedStudent
                        )
                      }
                    </p>

                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-3">

                    <p className="text-xs font-bold text-blue-600 uppercase">
                      Report Year
                    </p>

                    <p className="text-xl font-extrabold text-blue-800">
                      {
                        selectedYear
                      }
                    </p>

                  </div>

                </div>

              </div>


              {/* ==================================================
                  SUMMARY
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-5">

                  <p className="text-sm font-bold text-gray-600">
                    Total Fee
                  </p>

                  <p className="text-3xl font-extrabold text-blue-700 mt-2">
                    {money(
                      summary.totalFee
                    )}
                  </p>

                </div>


                <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-5">

                  <p className="text-sm font-bold text-gray-600">
                    Total Paid
                  </p>

                  <p className="text-3xl font-extrabold text-green-700 mt-2">
                    {money(
                      summary.totalPaid
                    )}
                  </p>

                </div>


                <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-5">

                  <p className="text-sm font-bold text-gray-600">
                    Total Pending
                  </p>

                  <p className="text-3xl font-extrabold text-red-700 mt-2">
                    {money(
                      summary.totalPending
                    )}
                  </p>

                </div>


                <div className="bg-white rounded-xl shadow-sm border-l-4 border-purple-500 p-5">

                  <p className="text-sm font-bold text-gray-600">
                    Paid Months
                  </p>

                  <p className="text-3xl font-extrabold text-purple-700 mt-2">
                    {
                      summary.paidCount
                    }
                  </p>

                </div>

              </div>


              {/* ==================================================
                  STATUS SUMMARY
              ================================================== */}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

                <div className="flex flex-wrap gap-3">

                  <span className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                    Paid:{" "}
                    {
                      summary.paidCount
                    }
                  </span>

                  <span className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">
                    Partial:{" "}
                    {
                      summary.partialCount
                    }
                  </span>

                  <span className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-full text-sm font-bold">
                    Pending:{" "}
                    {
                      summary.pendingCount
                    }
                  </span>

                  <span className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-bold">
                    Not Entered:{" "}
                    {
                      12 -
                      yearFees.length
                    }
                  </span>

                </div>

              </div>


              {/* ==================================================
                  MONTHLY HISTORY
              ================================================== */}

              <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">

                <div className="p-6 border-b border-gray-200">

                  <h2 className="text-xl font-extrabold text-gray-900">
                    📅 {selectedYear} Fee History
                  </h2>

                  <p className="text-sm text-gray-600 mt-1">
                    Complete monthly fee
                    status for{" "}
                    {
                      getStudentName(
                        selectedStudent
                      )
                    }
                  </p>

                </div>


                <div className="overflow-x-auto">

                  <table className="w-full border-collapse">

                    <thead>

                      <tr className="bg-gray-900 text-white">

                        <th className="px-4 py-4 text-left text-sm font-bold whitespace-nowrap">
                          S.No
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
                          Due Date
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-bold whitespace-nowrap">
                          Payment Date
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-bold whitespace-nowrap">
                          Mode
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-bold whitespace-nowrap">
                          Remark
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {loadingFees ? (

                        <tr>

                          <td
                            colSpan={10}
                            className="px-5 py-12 text-center"
                          >

                            <p className="text-gray-700 font-bold">
                              Loading fee history...
                            </p>

                          </td>

                        </tr>

                      ) : (

                        monthlyHistory.map(
                          (
                            item,
                            index
                          ) => {

                            const fee =
                              item.fee;

                            return (

                              <tr
                                key={
                                  item.monthNumber
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


                                {/* MONTH */}

                                <td className="px-4 py-4">

                                  <p className="text-gray-900 font-extrabold">
                                    {
                                      item.monthName
                                    }
                                  </p>

                                  <p className="text-gray-500 text-xs font-semibold">
                                    {
                                      selectedYear
                                    }
                                  </p>

                                </td>


                                {/* FEE */}

                                <td className="px-4 py-4 text-right text-gray-900 font-bold whitespace-nowrap">
                                  {fee
                                    ? money(
                                        fee.amount
                                      )
                                    : "-"}
                                </td>


                                {/* PAID */}

                                <td className="px-4 py-4 text-right text-green-700 font-extrabold whitespace-nowrap">
                                  {fee
                                    ? money(
                                        fee.paidAmount
                                      )
                                    : "-"}
                                </td>


                                {/* PENDING */}

                                <td className="px-4 py-4 text-right font-extrabold whitespace-nowrap">

                                  {fee ? (

                                    <span
                                      className={
                                        fee.pendingAmount >
                                        0
                                          ? "text-red-700"
                                          : "text-gray-700"
                                      }
                                    >
                                      {money(
                                        fee.pendingAmount
                                      )}
                                    </span>

                                  ) : (
                                    "-"
                                  )}

                                </td>


                                {/* STATUS */}

                                <td className="px-4 py-4 text-center">

                                  <StatusBadge
                                    status={
                                      fee
                                        ? fee.status
                                        : "Not Entered"
                                    }
                                  />

                                </td>


                                {/* DUE DATE */}

                                <td className="px-4 py-4 text-gray-800 font-semibold whitespace-nowrap">
                                  {fee
                                    ? formatDate(
                                        fee.dueDate
                                      )
                                    : "-"}
                                </td>


                                {/* PAYMENT DATE */}

                                <td className="px-4 py-4 text-gray-800 font-semibold whitespace-nowrap">
                                  {fee
                                    ? formatDate(
                                        fee.paymentDate
                                      )
                                    : "-"}
                                </td>


                                {/* MODE */}

                                <td className="px-4 py-4 text-gray-800 font-semibold whitespace-nowrap">
                                  {fee
                                    ? fee.paymentMode ||
                                      "-"
                                    : "-"}
                                </td>


                                {/* REMARK */}

                                <td className="px-4 py-4 text-gray-700 text-sm min-w-[180px]">
                                  {fee
                                    ? fee.remark ||
                                      "-"
                                    : "-"}
                                </td>

                              </tr>

                            );
                          }
                        )

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </>

          )}

      </div>

    </div>
  );
};

export default StudentFeeHistory;