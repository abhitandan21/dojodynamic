import { useEffect, useMemo, useState } from "react";

// ==========================================================
// API
// ==========================================================

const API_URL = "http://localhost:4001/api";

// ==========================================================
// TYPES
// ==========================================================

interface FeeRecord {
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

  remark?: string;
}

interface ReportSummary {
  totalFees: number;
  totalPaid: number;
  totalPending: number;
  paidCount: number;
  partialCount: number;
  pendingCount: number;
  totalRecords: number;
}

interface ReportResponse {
  success: boolean;

  filter?: {
    month: number | null;
    year: number | null;
  };

  summary: ReportSummary;

  fees: FeeRecord[];
}

interface PendingResponse {
  success: boolean;
  totalPending: number;
  fees: FeeRecord[];
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

const FeeReports = () => {
  const currentDate = new Date();

  const currentMonth =
    currentDate.getMonth() + 1;

  const currentYear =
    currentDate.getFullYear();

  // ========================================================
  // FILTER
  // ========================================================

  const [selectedMonth, setSelectedMonth] =
    useState<number | "All">(
      currentMonth
    );

  const [selectedYear, setSelectedYear] =
    useState<number>(
      currentYear
    );

  const [reportType, setReportType] =
    useState<
      "Monthly" | "Yearly"
    >("Monthly");

  // ========================================================
  // DATA
  // ========================================================

  const [summary, setSummary] =
    useState<ReportSummary>({
      totalFees: 0,
      totalPaid: 0,
      totalPending: 0,
      paidCount: 0,
      partialCount: 0,
      pendingCount: 0,
      totalRecords: 0,
    });

  const [fees, setFees] =
    useState<FeeRecord[]>([]);

  const [pendingFees, setPendingFees] =
    useState<FeeRecord[]>([]);

  // ========================================================
  // LOADING
  // ========================================================

  const [loadingReport, setLoadingReport] =
    useState(false);

  const [loadingPending, setLoadingPending] =
    useState(false);

  // ========================================================
  // SEARCH
  // ========================================================

  const [search, setSearch] =
    useState("");

  // ========================================================
  // ERROR
  // ========================================================

  const [errorMessage, setErrorMessage] =
    useState("");

  // ========================================================
  // SUCCESS
  // ========================================================

  const [lastUpdated, setLastUpdated] =
    useState("");

  // ========================================================
  // YEARS
  // ========================================================

  const years = Array.from(
    { length: 6 },
    (_, index) =>
      currentYear - 3 + index
  );

  // ========================================================
  // FORMAT MONEY
  // ========================================================

  const money = (value: number) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;
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
  // LOAD REPORT
  // ========================================================

  const loadReport = async () => {
    try {
      setLoadingReport(true);
      setErrorMessage("");

      let url =
        `${API_URL}/fees/report?year=${selectedYear}`;

      /*
        Monthly:
        /fees/report?month=8&year=2026

        Yearly:
        /fees/report?year=2026
      */

      if (
        reportType === "Monthly" &&
        selectedMonth !== "All"
      ) {
        url += `&month=${selectedMonth}`;
      }

      const response =
        await fetch(url);

      const result: ReportResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          (result as any)?.message ||
            "Unable to load fee report."
        );
      }

      setSummary(
        result.summary || {
          totalFees: 0,
          totalPaid: 0,
          totalPending: 0,
          paidCount: 0,
          partialCount: 0,
          pendingCount: 0,
          totalRecords: 0,
        }
      );

      setFees(
        Array.isArray(
          result.fees
        )
          ? result.fees
          : []
      );

      setLastUpdated(
        new Date().toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      );
    } catch (error) {
      console.error(
        "Fee Report Error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load fee report."
      );

      setFees([]);

    } finally {
      setLoadingReport(false);
    }
  };

  // ========================================================
  // LOAD PENDING FEES
  // ========================================================

  const loadPendingFees =
    async () => {
      try {
        setLoadingPending(true);

        const response =
          await fetch(
            `${API_URL}/fees/pending`
          );

        const result: PendingResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            (result as any)?.message ||
              "Unable to load pending fees."
          );
        }

        setPendingFees(
          Array.isArray(
            result.fees
          )
            ? result.fees
            : []
        );

      } catch (error) {
        console.error(
          "Pending Fee Error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load pending fees."
        );

      } finally {
        setLoadingPending(false);
      }
    };

  // ========================================================
  // LOAD ALL
  // ========================================================

  const loadAllReports =
    async () => {
      await Promise.all([
        loadReport(),
        loadPendingFees(),
      ]);
    };

  // ========================================================
  // INITIAL LOAD
  // ========================================================

  useEffect(() => {
    loadAllReports();
  }, [
    selectedMonth,
    selectedYear,
    reportType,
  ]);

  // ========================================================
  // SEARCH FILTER
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
  // PENDING STUDENTS GROUP
  // ========================================================

  const pendingStudents =
    useMemo(() => {
      const grouped =
        new Map<
          string,
          {
            studentId: string;
            studentName: string;
            registrationNo: string;
            pendingAmount: number;
            records: number;
          }
        >();

      pendingFees.forEach(
        (fee) => {
          const existing =
            grouped.get(
              fee.studentId
            );

          if (existing) {
            existing.pendingAmount +=
              Number(
                fee.pendingAmount
              ) || 0;

            existing.records += 1;

          } else {
            grouped.set(
              fee.studentId,
              {
                studentId:
                  fee.studentId,

                studentName:
                  fee.studentName,

                registrationNo:
                  fee.registrationNo,

                pendingAmount:
                  Number(
                    fee.pendingAmount
                  ) || 0,

                records: 1,
              }
            );
          }
        }
      );

      return Array.from(
        grouped.values()
      ).sort(
        (a, b) =>
          b.pendingAmount -
          a.pendingAmount
      );
    }, [pendingFees]);

  // ========================================================
  // FILTERED PENDING STUDENTS
  // ========================================================

  const filteredPendingStudents =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return pendingStudents;
      }

      return pendingStudents.filter(
        (student) =>
          student.studentName
            .toLowerCase()
            .includes(value) ||
          student.registrationNo
            .toLowerCase()
            .includes(value)
      );
    }, [
      pendingStudents,
      search,
    ]);

  // ========================================================
  // MONTHLY COLLECTION BREAKDOWN
  // ========================================================

  const monthlyBreakdown =
    useMemo(() => {
      const result = months.map(
        (month, index) => ({
          monthNumber:
            index + 1,

          monthName:
            month,

          totalFees: 0,
          totalPaid: 0,
          totalPending: 0,
          records: 0,
        })
      );

      fees.forEach(
        (fee) => {
          const index =
            Number(
              fee.month
            ) - 1;

          if (
            index >= 0 &&
            index < 12
          ) {
            result[
              index
            ].totalFees +=
              Number(
                fee.amount
              ) || 0;

            result[
              index
            ].totalPaid +=
              Number(
                fee.paidAmount
              ) || 0;

            result[
              index
            ].totalPending +=
              Number(
                fee.pendingAmount
              ) || 0;

            result[
              index
            ].records += 1;
          }
        }
      );

      return result;
    }, [fees]);

  // ========================================================
  // REPORT TITLE
  // ========================================================

  const reportTitle =
    reportType === "Monthly"
      ? selectedMonth === "All"
        ? `All Months - ${selectedYear}`
        : `${months[
            selectedMonth - 1
          ]} ${selectedYear}`
      : `Year ${selectedYear}`;

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
                📊 Fee Reports
              </h1>

              <p className="text-gray-600 mt-2">
                Monthly, yearly and
                student-wise fee reports.
              </p>

            </div>

            <button
              type="button"
              onClick={
                loadAllReports
              }
              disabled={
                loadingReport ||
                loadingPending
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-extrabold disabled:bg-gray-400"
            >
              {loadingReport ||
              loadingPending
                ? "Refreshing..."
                : "↻ Refresh Reports"}
            </button>

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
            REPORT TYPE
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-end gap-5">

            {/* REPORT TYPE */}

            <div className="flex-1">

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Report Type
              </label>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setReportType(
                      "Monthly"
                    )
                  }
                  className={`px-5 py-3 rounded-lg font-extrabold transition ${
                    reportType ===
                    "Monthly"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📅 Monthly
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setReportType(
                      "Yearly"
                    )
                  }
                  className={`px-5 py-3 rounded-lg font-extrabold transition ${
                    reportType ===
                    "Yearly"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📊 Yearly
                </button>

              </div>

            </div>


            {/* MONTH */}

            <div className="flex-1">

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Month
              </label>

              <select
                value={
                  selectedMonth
                }
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setSelectedMonth(
                    value === "All"
                      ? "All"
                      : Number(
                          value
                        )
                  );
                }}
                disabled={
                  reportType ===
                  "Yearly"
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 font-semibold outline-none focus:border-blue-500 disabled:bg-gray-100"
              >

                <option value="All">
                  All Months
                </option>

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

            <div className="flex-1">

              <label className="block text-sm font-bold text-gray-800 mb-2">
                Year
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
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 font-semibold outline-none focus:border-blue-500"
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
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500"
            />

          </div>

        </div>


        {/* ==================================================
            REPORT TITLE
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 mb-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-bold text-blue-600 uppercase">
                Current Report
              </p>

              <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                {reportTitle}
              </h2>

            </div>

            {lastUpdated && (

              <p className="text-xs text-gray-500">
                Updated:{" "}
                {lastUpdated}
              </p>

            )}

          </div>

        </div>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          {/* TOTAL FEES */}

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-5">

            <p className="text-sm font-bold text-gray-600">
              Total Fees
            </p>

            <p className="text-3xl font-extrabold text-blue-700 mt-2">
              {money(
                summary.totalFees
              )}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {summary.totalRecords}{" "}
              records
            </p>

          </div>


          {/* COLLECTION */}

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-5">

            <p className="text-sm font-bold text-gray-600">
              Total Collection
            </p>

            <p className="text-3xl font-extrabold text-green-700 mt-2">
              {money(
                summary.totalPaid
              )}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {summary.paidCount}{" "}
              paid records
            </p>

          </div>


          {/* PENDING */}

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-5">

            <p className="text-sm font-bold text-gray-600">
              Total Pending
            </p>

            <p className="text-3xl font-extrabold text-red-700 mt-2">
              {money(
                summary.totalPending
              )}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {summary.partialCount +
                summary.pendingCount}{" "}
              due records
            </p>

          </div>


          {/* STATUS */}

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-purple-500 p-5">

            <p className="text-sm font-bold text-gray-600">
              Payment Status
            </p>

            <div className="flex flex-wrap gap-2 mt-3">

              <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-bold">
                Paid{" "}
                {
                  summary.paidCount
                }
              </span>

              <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-bold">
                Partial{" "}
                {
                  summary.partialCount
                }
              </span>

              <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-bold">
                Pending{" "}
                {
                  summary.pendingCount
                }
              </span>

            </div>

          </div>

        </div>


        {/* ==================================================
            YEARLY MONTH BREAKDOWN
        ================================================== */}

        {reportType ===
          "Yearly" && (

          <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden mb-6">

            <div className="p-6 border-b border-gray-200">

              <h2 className="text-xl font-extrabold text-gray-900">
                📅 Monthly Collection Breakdown
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                {selectedYear} month-wise
                fee summary.
              </p>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-gray-900 text-white">

                    <th className="px-4 py-4 text-left text-sm font-bold">
                      Month
                    </th>

                    <th className="px-4 py-4 text-right text-sm font-bold">
                      Total Fee
                    </th>

                    <th className="px-4 py-4 text-right text-sm font-bold">
                      Collected
                    </th>

                    <th className="px-4 py-4 text-right text-sm font-bold">
                      Pending
                    </th>

                    <th className="px-4 py-4 text-center text-sm font-bold">
                      Records
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {monthlyBreakdown.map(
                    (
                      month,
                      index
                    ) => (

                      <tr
                        key={
                          month.monthNumber
                        }
                        className={`border-t border-gray-200 ${
                          index %
                            2 ===
                          0
                            ? "bg-white"
                            : "bg-gray-50"
                        }`}
                      >

                        <td className="px-4 py-4 font-extrabold text-gray-900">
                          {
                            month.monthName
                          }
                        </td>

                        <td className="px-4 py-4 text-right font-bold text-gray-900">
                          {money(
                            month.totalFees
                          )}
                        </td>

                        <td className="px-4 py-4 text-right font-extrabold text-green-700">
                          {money(
                            month.totalPaid
                          )}
                        </td>

                        <td className="px-4 py-4 text-right font-extrabold text-red-700">
                          {money(
                            month.totalPending
                          )}
                        </td>

                        <td className="px-4 py-4 text-center font-bold text-gray-700">
                          {
                            month.records
                          }
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* ==================================================
            FEE RECORDS
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden mb-6">

          <div className="p-6 border-b border-gray-200">

            <h2 className="text-xl font-extrabold text-gray-900">
              📋 Fee Records
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              {filteredFees.length}{" "}
              records found.
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
                    Payment Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {loadingReport ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center"
                    >

                      <p className="text-gray-700 font-bold">
                        Loading report...
                      </p>

                    </td>

                  </tr>

                ) : filteredFees.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center"
                    >

                      <p className="text-gray-800 font-bold">
                        No fee records found.
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        Try another month
                        or year.
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

                        <td className="px-4 py-4 font-bold text-gray-900">
                          {index +
                            1}
                        </td>


                        <td className="px-4 py-4">

                          <p className="font-extrabold text-gray-900 whitespace-nowrap">
                            {
                              fee.studentName
                            }
                          </p>

                          <p className="text-xs text-gray-600 font-semibold mt-1">
                            {
                              fee.registrationNo
                            }
                          </p>

                        </td>


                        <td className="px-4 py-4">

                          <p className="font-bold text-gray-900 whitespace-nowrap">
                            {
                              months[
                                fee.month -
                                  1
                              ]
                            }
                          </p>

                          <p className="text-xs text-gray-600">
                            {
                              fee.year
                            }
                          </p>

                        </td>


                        <td className="px-4 py-4 text-right font-bold text-gray-900 whitespace-nowrap">
                          {money(
                            fee.amount
                          )}
                        </td>


                        <td className="px-4 py-4 text-right font-extrabold text-green-700 whitespace-nowrap">
                          {money(
                            fee.paidAmount
                          )}
                        </td>


                        <td className="px-4 py-4 text-right font-extrabold text-red-700 whitespace-nowrap">
                          {money(
                            fee.pendingAmount
                          )}
                        </td>


                        <td className="px-4 py-4 text-center">

                          {fee.status ===
                            "Paid" && (

                            <span className="bg-green-100 border border-green-300 text-green-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
                              PAID
                            </span>

                          )}

                          {fee.status ===
                            "Partial" && (

                            <span className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
                              PARTIAL
                            </span>

                          )}

                          {fee.status ===
                            "Pending" && (

                            <span className="bg-red-100 border border-red-300 text-red-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
                              PENDING
                            </span>

                          )}

                        </td>


                        <td className="px-4 py-4 font-semibold text-gray-800 whitespace-nowrap">
                          {formatDate(
                            fee.paymentDate
                          )}
                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ==================================================
            STUDENT-WISE PENDING
        ================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden mb-6">

          <div className="p-6 border-b border-gray-200">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

              <div>

                <h2 className="text-xl font-extrabold text-gray-900">
                  🔴 Student-wise Pending Fees
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  Students who currently
                  have pending amounts.
                </p>

              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">

                <p className="text-xs font-bold text-red-600 uppercase">
                  Total Pending
                </p>

                <p className="text-xl font-extrabold text-red-700">
                  {money(
                    pendingFees.reduce(
                      (
                        total,
                        fee
                      ) =>
                        total +
                        (Number(
                          fee.pendingAmount
                        ) || 0),
                      0
                    )
                  )}
                </p>

              </div>

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-900 text-white">

                  <th className="px-4 py-4 text-left text-sm font-bold">
                    S.No
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold">
                    Student
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold">
                    Registration No.
                  </th>

                  <th className="px-4 py-4 text-right text-sm font-bold">
                    Pending
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-bold">
                    Due Records
                  </th>

                </tr>

              </thead>

              <tbody>

                {loadingPending ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center"
                    >

                      <p className="text-gray-700 font-bold">
                        Loading pending fees...
                      </p>

                    </td>

                  </tr>

                ) : filteredPendingStudents.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center"
                    >

                      <div className="text-4xl mb-3">
                        🎉
                      </div>

                      <p className="text-gray-900 font-extrabold">
                        No pending fees found.
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        All currently recorded
                        fees are cleared.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredPendingStudents.map(
                    (
                      student,
                      index
                    ) => (

                      <tr
                        key={
                          student.studentId
                        }
                        className={`border-t border-gray-200 ${
                          index %
                            2 ===
                          0
                            ? "bg-white"
                            : "bg-gray-50"
                        } hover:bg-red-50`}
                      >

                        <td className="px-4 py-4 font-bold text-gray-900">
                          {index +
                            1}
                        </td>

                        <td className="px-4 py-4 font-extrabold text-gray-900 whitespace-nowrap">
                          {
                            student.studentName
                          }
                        </td>

                        <td className="px-4 py-4 font-semibold text-gray-700 whitespace-nowrap">
                          {
                            student.registrationNo
                          }
                        </td>

                        <td className="px-4 py-4 text-right font-extrabold text-red-700 whitespace-nowrap">
                          {money(
                            student.pendingAmount
                          )}
                        </td>

                        <td className="px-4 py-4 text-center">

                          <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
                            {
                              student.records
                            }
                          </span>

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

export default FeeReports;