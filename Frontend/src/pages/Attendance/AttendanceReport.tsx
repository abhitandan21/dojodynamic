import { useEffect, useMemo, useState } from "react";

// ==========================================
// API
// ==========================================

const API_URL = "http://localhost:4001/api";

// ==========================================
// TYPES
// ==========================================

interface DailyReport {
  date: string;
  type: "Class" | "Sunday" | "Holiday";
  reason?: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface AttendanceReportData {
  success: boolean;

  period: {
    startDate: string;
    endDate: string;
  };

  summary: {
    markedClassDays: number;
    totalPresent: number;
    totalAbsent: number;
    totalAttendance: number;
    percentage: number;
  };

  excluded: {
    sundays: number;
    holidays: number;
  };

  dailyReport: DailyReport[];
}

interface Student {
  _id: string;
  name?: string;
  studentName?: string;
  registrationNo?: string;
  regNo?: string;
}

interface StudentAttendance {
  _id?: string;
  studentId?: string;
  studentName?: string;
  registrationNo?: string;
  date: string;
  status: "Present" | "Absent";
  batch?: string;
}

// ==========================================
// COMPONENT
// ==========================================

const AttendanceReport = () => {
  // ==========================================
  // TODAY
  // ==========================================

  const today = new Date();

  const todayString =
    today.toISOString().split("T")[0];

  // ==========================================
  // REPORT TYPE
  // ==========================================

  const [reportType, setReportType] =
    useState<
      "weekly" | "monthly" | "student"
    >("weekly");

  // ==========================================
  // GENERAL REPORT DATES
  // ==========================================

  const [startDate, setStartDate] =
    useState(todayString);

  const [endDate, setEndDate] =
    useState(todayString);

  const [report, setReport] =
    useState<AttendanceReportData | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // STUDENTS
  // ==========================================

  const [students, setStudents] =
    useState<Student[]>([]);

  const [studentSearch, setStudentSearch] =
    useState("");

  const [selectedStudentId, setSelectedStudentId] =
    useState("");

  // ==========================================
  // STUDENT MONTH / YEAR
  // ==========================================

  const [selectedMonth, setSelectedMonth] =
    useState(
      today.getMonth() + 1
    );

  const [selectedYear, setSelectedYear] =
    useState(
      today.getFullYear()
    );

  // ==========================================
  // STUDENT ATTENDANCE
  // ==========================================

  const [studentAttendance, setStudentAttendance] =
    useState<StudentAttendance[]>([]);

  const [studentLoading, setStudentLoading] =
    useState(false);

  // ==========================================
  // MONTH NAMES
  // ==========================================

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

  // ==========================================
  // YEARS
  // ==========================================

  const years = Array.from(
    {
      length: 5,
    },
    (_, index) =>
      today.getFullYear() - 2 + index
  );

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    dateString: string
  ) => {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // GET STUDENT NAME
  // ==========================================

  const getStudentName = (
    student: Student
  ) => {
    return (
      student.name ||
      student.studentName ||
      "Unknown Student"
    );
  };

  // ==========================================
  // GET REGISTRATION NUMBER
  // ==========================================

  const getRegistrationNo = (
    student: Student
  ) => {
    return (
      student.registrationNo ||
      student.regNo ||
      "N/A"
    );
  };

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  const loadStudents = async () => {
    try {
      const response =
        await fetch(
          `${API_URL}/students`
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load students"
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

      setStudents([]);
    }
  };

  // ==========================================
  // LOAD GENERAL REPORT
  // ==========================================

  const loadReport = async (
    start: string = startDate,
    end: string = endDate
  ) => {
    try {
      if (!start || !end) {
        alert(
          "Please select start and end date."
        );
        return;
      }

      if (start > end) {
        alert(
          "Start date cannot be greater than end date."
        );
        return;
      }

      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/attendance/report?startDate=${start}&endDate=${end}`
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load attendance report."
        );
      }

      setReport(result);

    } catch (error) {
      console.error(
        "Attendance Report Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load attendance report."
      );

      setReport(null);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // WEEKLY REPORT
  // ==========================================

  const loadWeeklyReport = () => {
    const end = new Date();

    const start = new Date();

    start.setDate(
      end.getDate() - 6
    );

    const startString =
      start
        .toISOString()
        .split("T")[0];

    const endString =
      end
        .toISOString()
        .split("T")[0];

    setStartDate(startString);
    setEndDate(endString);

    loadReport(
      startString,
      endString
    );
  };

  // ==========================================
  // MONTHLY REPORT
  // ==========================================

  const loadMonthlyReport = () => {
    const now = new Date();

    const year =
      now.getFullYear();

    const month =
      now.getMonth();

    const start =
      new Date(
        year,
        month,
        1
      );

    const end =
      new Date(
        year,
        month + 1,
        0
      );

    const startString =
      start
        .toISOString()
        .split("T")[0];

    const endString =
      end
        .toISOString()
        .split("T")[0];

    setStartDate(startString);
    setEndDate(endString);

    loadReport(
      startString,
      endString
    );
  };

  // ==========================================
  // LOAD STUDENT ATTENDANCE
  // ==========================================

  const loadStudentAttendance = async () => {
    try {
      if (!selectedStudentId) {
        alert(
          "Please select a student."
        );
        return;
      }

      setStudentLoading(true);

      const response =
        await fetch(
          `${API_URL}/attendance/student/${selectedStudentId}/${selectedMonth}/${selectedYear}`
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load student attendance."
        );
      }

      const records =
        Array.isArray(result)
          ? result
          : result.attendance || [];

      setStudentAttendance(records);

    } catch (error) {
      console.error(
        "Student Attendance Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load student attendance."
      );

      setStudentAttendance([]);

    } finally {
      setStudentLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadWeeklyReport();
    loadStudents();
  }, []);

  // ==========================================
  // FILTER STUDENTS
  // ==========================================

  const filteredStudents =
    useMemo(() => {
      const search =
        studentSearch
          .trim()
          .toLowerCase();

      if (!search) {
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
            name.includes(search) ||
            registration.includes(search)
          );
        }
      );
    }, [
      students,
      studentSearch,
    ]);

  // ==========================================
  // SELECTED STUDENT
  // ==========================================

  const selectedStudent =
    students.find(
      (student) =>
        student._id ===
        selectedStudentId
    );

  // ==========================================
  // STUDENT SUMMARY
  // ==========================================

  const studentSummary =
    useMemo(() => {
      const present =
        studentAttendance.filter(
          (record) =>
            record.status ===
            "Present"
        ).length;

      const absent =
        studentAttendance.filter(
          (record) =>
            record.status ===
            "Absent"
        ).length;

      const total =
        present + absent;

      const percentage =
        total === 0
          ? 0
          : Number(
              (
                (present /
                  total) *
                100
              ).toFixed(2)
            );

      return {
        present,
        absent,
        total,
        percentage,
      };
    }, [studentAttendance]);

  // ==========================================
  // STUDENT HISTORY
  // ==========================================

  const studentHistory =
    useMemo(() => {
      return [
        ...studentAttendance,
      ].sort((a, b) =>
        a.date.localeCompare(
          b.date
        )
      );
    }, [studentAttendance]);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                📊 Attendance Report
              </h1>

              <p className="text-gray-600 mt-2">
                View weekly, monthly and
                student-wise attendance reports.
              </p>

            </div>

            <div className="flex gap-2 flex-wrap">

              <button
                type="button"
                onClick={() => {
                  setReportType(
                    "weekly"
                  );
                  loadWeeklyReport();
                }}
                className={`px-5 py-2.5 rounded-lg font-semibold ${
                  reportType ===
                  "weekly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Weekly
              </button>

              <button
                type="button"
                onClick={() => {
                  setReportType(
                    "monthly"
                  );
                  loadMonthlyReport();
                }}
                className={`px-5 py-2.5 rounded-lg font-semibold ${
                  reportType ===
                  "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => {
                  setReportType(
                    "student"
                  );
                  setReport(null);
                }}
                className={`px-5 py-2.5 rounded-lg font-semibold ${
                  reportType ===
                  "student"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Student-wise
              </button>

            </div>

          </div>

        </div>


        {/* ==================================
            STUDENT-WISE
        ================================== */}

        {reportType ===
        "student" ? (

          <>

            {/* STUDENT FILTER */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

              <h2 className="text-xl font-bold text-gray-900 mb-5">
                👤 Select Student
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* SEARCH */}

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
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />

                </div>

                {/* DROPDOWN */}

                <div>

                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Select Student
                  </label>

                  <select
                    value={
                      selectedStudentId
                    }
                    onChange={(e) => {
                      setSelectedStudentId(
                        e.target.value
                      );

                      setStudentAttendance(
                        []
                      );
                    }}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  >

                    <option value="">
                      -- Select Student --
                    </option>

                    {filteredStudents.map(
                      (student) => (
                        <option
                          key={
                            student._id
                          }
                          value={
                            student._id
                          }
                        >
                          {getStudentName(
                            student
                          )}{" "}
                          -{" "}
                          {getRegistrationNo(
                            student
                          )}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>


              {/* MONTH YEAR */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

                {/* MONTH */}

                <div>

                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Month
                  </label>

                  <select
                    value={
                      selectedMonth
                    }
                    onChange={(e) =>
                      setSelectedMonth(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
                      selectedYear
                    }
                    onChange={(e) =>
                      setSelectedYear(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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

                {/* LOAD */}

                <div className="flex items-end">

                  <button
                    type="button"
                    onClick={
                      loadStudentAttendance
                    }
                    disabled={
                      studentLoading ||
                      !selectedStudentId
                    }
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {studentLoading
                      ? "Loading..."
                      : "Load Attendance"}
                  </button>

                </div>

              </div>

            </div>


            {/* SELECTED STUDENT */}

            {selectedStudent && (

              <>

                {/* STUDENT INFO */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Student
                      </p>

                      <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                        {
                          getStudentName(
                            selectedStudent
                          )
                        }
                      </h2>

                      <p className="text-base text-gray-700 mt-2">
                        <span className="font-bold">
                          Registration No:
                        </span>{" "}
                        {
                          getRegistrationNo(
                            selectedStudent
                          )
                        }
                      </p>

                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 text-center">

                      <p className="text-sm font-semibold text-blue-600">
                        Attendance Month
                      </p>

                      <p className="text-lg font-bold text-blue-900">
                        {
                          months[
                            selectedMonth -
                              1
                          ]
                        }{" "}
                        {
                          selectedYear
                        }
                      </p>

                    </div>

                  </div>

                </div>


                {/* SUMMARY */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-5">

                    <p className="text-sm font-semibold text-gray-600">
                      Total Classes
                    </p>

                    <p className="text-3xl font-extrabold text-blue-700 mt-2">
                      {
                        studentSummary.total
                      }
                    </p>

                  </div>

                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-5">

                    <p className="text-sm font-semibold text-gray-600">
                      Present
                    </p>

                    <p className="text-3xl font-extrabold text-green-700 mt-2">
                      {
                        studentSummary.present
                      }
                    </p>

                  </div>

                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-5">

                    <p className="text-sm font-semibold text-gray-600">
                      Absent
                    </p>

                    <p className="text-3xl font-extrabold text-red-700 mt-2">
                      {
                        studentSummary.absent
                      }
                    </p>

                  </div>

                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-yellow-500 p-5">

                    <p className="text-sm font-semibold text-gray-600">
                      Attendance %
                    </p>

                    <p className="text-3xl font-extrabold text-yellow-700 mt-2">
                      {
                        studentSummary.percentage
                      }%
                    </p>

                  </div>

                </div>


                {/* HISTORY */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">

                  <div className="p-6 border-b-2 border-gray-200">

                    <h2 className="text-xl font-extrabold text-gray-900">
                      📅 Attendance History
                    </h2>

                    <p className="text-sm font-medium text-gray-600 mt-1">
                      {
                        months[
                          selectedMonth -
                            1
                        ]
                      }{" "}
                      {
                        selectedYear
                      }{" "}
                      attendance records
                    </p>

                  </div>

                  {studentLoading ? (

                    <div className="p-12 text-center">

                      <p className="text-gray-700 font-semibold">
                        Loading student
                        attendance...
                      </p>

                    </div>

                  ) : (

                    <div className="overflow-x-auto">

                      <table className="w-full border-collapse">

                        <thead>

                          <tr className="bg-gray-900 text-white">

                            <th className="px-5 py-4 text-left text-sm font-bold">
                              S.No
                            </th>

                            <th className="px-5 py-4 text-left text-sm font-bold">
                              Date
                            </th>

                            <th className="px-5 py-4 text-left text-sm font-bold">
                              Day
                            </th>

                            <th className="px-5 py-4 text-center text-sm font-bold">
                              Status
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {studentHistory.length ===
                          0 ? (

                            <tr>

                              <td
                                colSpan={4}
                                className="px-5 py-12 text-center"
                              >

                                <p className="text-gray-800 font-bold text-base">
                                  No attendance
                                  records found.
                                </p>

                                <p className="text-gray-500 text-sm mt-1">
                                  Try another
                                  month or year.
                                </p>

                              </td>

                            </tr>

                          ) : (

                            studentHistory.map(
                              (
                                record,
                                index
                              ) => {

                                const date =
                                  new Date(
                                    `${record.date}T00:00:00`
                                  );

                                const dayName =
                                  date.toLocaleDateString(
                                    "en-IN",
                                    {
                                      weekday:
                                        "long",
                                    }
                                  );

                                return (

                                  <tr
                                    key={
                                      record._id ||
                                      `${record.date}-${index}`
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

                                    <td className="px-5 py-4 text-gray-900 font-semibold">
                                      {
                                        index +
                                        1
                                      }
                                    </td>

                                    {/* DATE */}

                                    <td className="px-5 py-4 text-gray-900 font-bold whitespace-nowrap">
                                      {formatDate(
                                        record.date
                                      )}
                                    </td>

                                    {/* DAY */}

                                    <td className="px-5 py-4 text-gray-700 font-semibold">
                                      {
                                        dayName
                                      }
                                    </td>

                                    {/* STATUS */}

                                    <td className="px-5 py-4 text-center">

                                      {record.status ===
                                      "Present" ? (

                                        <span className="inline-flex items-center bg-green-100 border border-green-300 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold">
                                          ✓ Present
                                        </span>

                                      ) : (

                                        <span className="inline-flex items-center bg-red-100 border border-red-300 text-red-800 px-4 py-1.5 rounded-full text-sm font-bold">
                                          ✕ Absent
                                        </span>

                                      )}

                                    </td>

                                  </tr>

                                );
                              }
                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

              </>

            )}

          </>

        ) : (

          /* ==================================
             WEEKLY / MONTHLY
          ================================== */

          <>

            {/* DATE FILTER */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

                <div>

                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={
                      startDate
                    }
                    onChange={(e) =>
                      setStartDate(
                        e.target.value
                      )
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 bg-white"
                  />

                </div>

                <div>

                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={
                      endDate
                    }
                    onChange={(e) =>
                      setEndDate(
                        e.target.value
                      )
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 bg-white"
                  />

                </div>

                <button
                  type="button"
                  onClick={() =>
                    loadReport()
                  }
                  disabled={
                    loading
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-bold disabled:bg-gray-400"
                >
                  {loading
                    ? "Loading..."
                    : "Generate Report"}
                </button>

              </div>

            </div>


            {/* SUMMARY */}

            {loading ? (

              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-700 font-semibold">
                  Loading attendance report...
                </p>
              </div>

            ) : report ? (

              <>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-5">

                    <p className="text-sm font-semibold text-gray-600">
                      Class Days
                    </p>

                    <p className="text-3xl font-extrabold text-blue-700 mt-2">
                      {
                        report.summary
                          .markedClassDays
                      }
                    </p>

                  </div>

                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-5">

                    <p className="text-sm font-semibold text-gray-600">
                      Total Present
                    </p>

                    <p className="text-3xl font-extrabold text-green-700 mt-2">
                      {
                        report.summary
                          .totalPresent
                      }
                    </p>

                  </div>

                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-5">

                    <p className="text-sm font-semibold text-gray-600">
                      Total Absent
                    </p>

                    <p className="text-3xl font-extrabold text-red-700 mt-2">
                      {
                        report.summary
                          .totalAbsent
                      }
                    </p>

                  </div>

                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-yellow-500 p-5">

                    <p className="text-sm font-semibold text-gray-600">
                      Attendance %
                    </p>

                    <p className="text-3xl font-extrabold text-yellow-700 mt-2">
                      {
                        report.summary
                          .percentage
                      }%
                    </p>

                  </div>

                </div>


                {/* EXCLUDED */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

                  <div className="flex flex-wrap gap-8">

                    <div>

                      <span className="text-sm font-semibold text-gray-600">
                        Sundays
                      </span>

                      <p className="font-bold text-blue-700 text-lg">
                        {
                          report.excluded
                            .sundays
                        }
                      </p>

                    </div>

                    <div>

                      <span className="text-sm font-semibold text-gray-600">
                        Holidays
                      </span>

                      <p className="font-bold text-orange-700 text-lg">
                        {
                          report.excluded
                            .holidays
                        }
                      </p>

                    </div>

                    <div>

                      <span className="text-sm font-semibold text-gray-600">
                        Report Period
                      </span>

                      <p className="font-bold text-gray-900">
                        {formatDate(
                          report.period
                            .startDate
                        )}{" "}
                        -{" "}
                        {formatDate(
                          report.period
                            .endDate
                        )}
                      </p>

                    </div>

                  </div>

                </div>


                {/* DAILY TABLE */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">

                  <div className="p-5 border-b-2 border-gray-200">

                    <h2 className="text-xl font-extrabold text-gray-900">
                      Daily Attendance
                    </h2>

                  </div>

                  <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                      <thead>

                        <tr className="bg-gray-900 text-white">

                          <th className="px-5 py-4 text-left">
                            Date
                          </th>

                          <th className="px-5 py-4 text-left">
                            Type
                          </th>

                          <th className="px-5 py-4 text-center">
                            Present
                          </th>

                          <th className="px-5 py-4 text-center">
                            Absent
                          </th>

                          <th className="px-5 py-4 text-center">
                            Total
                          </th>

                          <th className="px-5 py-4 text-center">
                            Attendance %
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {report.dailyReport.map(
                          (item) => (

                            <tr
                              key={
                                item.date
                              }
                              className="border-t border-gray-200 hover:bg-blue-50"
                            >

                              <td className="px-5 py-4 text-gray-900 font-bold">
                                {formatDate(
                                  item.date
                                )}
                              </td>

                              <td className="px-5 py-4">

                                {item.type ===
                                "Class" ? (

                                  <span className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                                    Class
                                  </span>

                                ) : item.type ===
                                  "Sunday" ? (

                                  <span className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                                    Sunday
                                  </span>

                                ) : (

                                  <span className="bg-orange-100 border border-orange-300 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
                                    Holiday
                                  </span>

                                )}

                                {item.reason && (
                                  <div className="text-sm font-semibold text-gray-700 mt-1">
                                    {
                                      item.reason
                                    }
                                  </div>
                                )}

                              </td>

                              <td className="px-5 py-4 text-center text-green-700 font-bold">
                                {
                                  item.present
                                }
                              </td>

                              <td className="px-5 py-4 text-center text-red-700 font-bold">
                                {
                                  item.absent
                                }
                              </td>

                              <td className="px-5 py-4 text-center text-gray-900 font-bold">
                                {
                                  item.total
                                }
                              </td>

                              <td className="px-5 py-4 text-center text-gray-900 font-bold">

                                {item.type ===
                                "Class"
                                  ? `${item.percentage}%`
                                  : "-"}

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </>

            ) : (

              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-700 font-semibold">
                  Select a date range and
                  generate the report.
                </p>
              </div>

            )}

          </>

        )}

      </div>

    </div>
  );
};

export default AttendanceReport;