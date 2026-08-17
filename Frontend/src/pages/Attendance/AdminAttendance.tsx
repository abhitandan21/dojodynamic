import { useEffect, useMemo, useState } from "react";

import AttendanceHeader from "./component/AttendanceHeader";
import AttendanceSummary from "./component/AttendanceSummary";
import AttendanceTable from "./component/AttendanceTable";

import { getStudents } from "./services/studentService";

import {
  saveAttendance,
  getAttendanceByDate,
  updateAttendanceByDate,
} from "./services/attendanceService";

import HolidayManagement from "./component/HolidayManagement";

import {
  getHolidays,
} from "./services/calendarService";

import type {
  Holiday,
} from "./services/calendarService";

// ==========================================
// STUDENT TYPE
// ==========================================

interface Student {
  _id: string;
  name: string;
  registrationNo: string;
  status: "Present" | "Absent";
}

// ==========================================
// SAVED ATTENDANCE TYPE
// ==========================================

interface SavedAttendance {
  studentId:
    | string
    | {
        _id: string;
      };

  status: "Present" | "Absent";
}

// ==========================================
// ADMIN ATTENDANCE
// ==========================================

const AdminAttendance = () => {
  // ==========================================
  // TODAY DATE
  // ==========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ==========================================
  // STATES
  // ==========================================

  const [date, setDate] = useState(today);

  const [search, setSearch] = useState("");

  const [students, setStudents] =
    useState<Student[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // ==========================================
  // ATTENDANCE EXISTS
  // ==========================================

  const [attendanceExists, setAttendanceExists] =
    useState(false);

  // ==========================================
  // HOLIDAY CHECK
  // ==========================================

  const [holidayForDate, setHolidayForDate] =
    useState<Holiday | null>(null);

  const [isSunday, setIsSunday] =
    useState(false);

  // ==========================================
  // CHECK SELECTED DATE
  // SUNDAY + SPECIAL HOLIDAY
  // ==========================================

  const checkHoliday = async (
    selectedDate: string
  ) => {
    try {
      // ======================================
      // CHECK SUNDAY
      // ======================================

      const day =
        new Date(
          `${selectedDate}T00:00:00`
        ).getDay();

      const sunday = day === 0;

      setIsSunday(sunday);

      // ======================================
      // GET SPECIAL HOLIDAYS
      // ======================================

      const holidays =
        await getHolidays();

      const holiday =
        holidays.find(
          (item) =>
            item.date === selectedDate
        ) || null;

      setHolidayForDate(holiday);

      return {
        isSunday: sunday,
        holiday,
      };

    } catch (error) {
      console.error(
        "Holiday Check Error:",
        error
      );

      setHolidayForDate(null);

      return {
        isSunday: false,
        holiday: null,
      };
    }
  };

  // ==========================================
  // LOAD STUDENTS + SAVED ATTENDANCE
  // ==========================================

  const loadStudents = async () => {
    try {
      setLoading(true);

      // ======================================
      // CHECK SUNDAY / HOLIDAY FIRST
      // ======================================

      const holidayCheck =
        await checkHoliday(date);

      // ======================================
      // HOLIDAY / SUNDAY
      // NO ATTENDANCE
      // ======================================

      if (
        holidayCheck.isSunday ||
        holidayCheck.holiday
      ) {
        setStudents([]);
        setAttendanceExists(false);
        return;
      }

      // ======================================
      // STEP 1
      // GET ACTIVE STUDENTS
      // ======================================

      const data = await getStudents();

      // ======================================
      // SAFETY FILTER
      // ONLY ACTIVE STUDENTS
      // ======================================

      const activeStudents =
        data.filter(
          (student: any) =>
            student.status === "Active"
        );

      // ======================================
      // STEP 2
      // DEFAULT ALL ACTIVE STUDENTS
      // AS PRESENT
      // ======================================

      const formattedStudents: Student[] =
        activeStudents.map(
          (student: any) => ({
            _id: student._id,

            name: student.name,

            registrationNo:
              student.registrationNo,

            status: "Present",
          })
        );

      // ======================================
      // STEP 3
      // GET SAVED ATTENDANCE FOR DATE
      // ======================================

      let savedAttendance:
        SavedAttendance[] = [];

      try {
        const attendanceResult =
          await getAttendanceByDate(
            date
          );

        savedAttendance =
          attendanceResult?.attendance ||
          [];

      } catch (attendanceError) {
        console.log(
          "No saved attendance found for this date.",
          attendanceError
        );

        savedAttendance = [];
      }

      // ======================================
      // STEP 4
      // CHECK SAVED / NEW
      // ======================================

      if (savedAttendance.length > 0) {
        setAttendanceExists(true);
      } else {
        setAttendanceExists(false);
      }

      // ======================================
      // STEP 5
      // APPLY SAVED ATTENDANCE
      // ======================================

      const finalStudents: Student[] =
        formattedStudents.map(
          (student) => {
            const savedRecord =
              savedAttendance.find(
                (record) => {
                  const savedStudentId =
                    typeof record.studentId ===
                    "object"
                      ? record.studentId?._id
                      : record.studentId;

                  return (
                    String(
                      savedStudentId
                    ) ===
                    String(
                      student._id
                    )
                  );
                }
              );

            return {
              ...student,

              status:
                savedRecord?.status ===
                "Absent"
                  ? "Absent"
                  : "Present",
            };
          }
        );

      // ======================================
      // STEP 6
      // UPDATE STATE
      // ======================================

      setStudents(finalStudents);

    } catch (error) {
      console.error(
        "Load Students Error:",
        error
      );

      alert(
        "Unable to load students."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN PAGE OPENS
  // AND WHEN DATE CHANGES
  // ==========================================

  useEffect(() => {
    loadStudents();
  }, [date]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name
          .toLowerCase()
          .includes(searchText) ||
        student.registrationNo
          .toLowerCase()
          .includes(searchText)
    );
  }, [students, search]);

  // ==========================================
  // CHANGE ATTENDANCE
  // ==========================================

  const handleAttendance = (
    id: string,
    status: "Present" | "Absent"
  ) => {
    setStudents(
      (previousStudents) =>
        previousStudents.map(
          (student) =>
            student._id === id
              ? {
                  ...student,
                  status,
                }
              : student
        )
    );
  };

  // ==========================================
  // GET ADMIN NAME
  // ==========================================

  const getMarkedBy = () => {
    const userData =
      localStorage.getItem("user");

    let markedBy = "Admin";

    if (userData) {
      try {
        const user =
          JSON.parse(userData);

        markedBy =
          user.name ||
          user.username ||
          user.email ||
          "Admin";

      } catch {
        markedBy = "Admin";
      }
    }

    return markedBy;
  };

  // ==========================================
  // SAVE NEW ATTENDANCE
  // ==========================================

  const handleSaveAttendance =
    async () => {
      try {
        // ======================================
        // EXTRA SAFETY CHECK
        // ======================================

        const holidayCheck =
          await checkHoliday(date);

        if (
          holidayCheck.isSunday ||
          holidayCheck.holiday
        ) {
          alert(
            holidayCheck.isSunday
              ? "Sunday ko attendance nahi li ja sakti."
              : `Is date par holiday hai: ${holidayCheck.holiday?.reason}`
          );

          return;
        }

        if (students.length === 0) {
          alert(
            "No students available."
          );

          return;
        }

        setSaving(true);

        const selectedDate =
          new Date(
            `${date}T00:00:00`
          );

        // ======================================
        // ATTENDANCE DATA
        // ======================================

        const attendanceData =
          students.map(
            (student) => ({
              studentId:
                student._id,

              studentName:
                student.name,

              registrationNo:
                student.registrationNo,

              status:
                student.status,
            })
          );

        // ======================================
        // SAVE
        // ======================================

        const result =
          await saveAttendance({
            date,

            month:
              selectedDate.getMonth() +
              1,

            year:
              selectedDate.getFullYear(),

            markedBy:
              getMarkedBy(),

            batch: "General",

            attendance:
              attendanceData,
          });

        alert(
          result.message ||
            "Attendance saved successfully."
        );

        // ======================================
        // AFTER SAVE
        // SWITCH TO UPDATE MODE
        // ======================================

        setAttendanceExists(true);

        // Reload from MongoDB
        await loadStudents();

      } catch (error) {
        console.error(
          "Save Attendance Error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to save attendance."
        );

      } finally {
        setSaving(false);
      }
    };

  // ==========================================
  // UPDATE EXISTING ATTENDANCE
  // ==========================================

  const handleUpdateAttendance =
    async () => {
      try {
        // ======================================
        // EXTRA SAFETY CHECK
        // ======================================

        const holidayCheck =
          await checkHoliday(date);

        if (
          holidayCheck.isSunday ||
          holidayCheck.holiday
        ) {
          alert(
            holidayCheck.isSunday
              ? "Sunday ko attendance update nahi ki ja sakti."
              : `Is date par holiday hai: ${holidayCheck.holiday?.reason}`
          );

          return;
        }

        if (students.length === 0) {
          alert(
            "No students available."
          );

          return;
        }

        setSaving(true);

        const selectedDate =
          new Date(
            `${date}T00:00:00`
          );

        // ======================================
        // ATTENDANCE DATA
        // ======================================

        const attendanceData =
          students.map(
            (student) => ({
              studentId:
                student._id,

              studentName:
                student.name,

              registrationNo:
                student.registrationNo,

              status:
                student.status,
            })
          );

        // ======================================
        // UPDATE
        // ======================================

        const result =
          await updateAttendanceByDate({
            date,

            month:
              selectedDate.getMonth() +
              1,

            year:
              selectedDate.getFullYear(),

            markedBy:
              getMarkedBy(),

            batch: "General",

            attendance:
              attendanceData,
          });

        alert(
          result.message ||
            "Attendance updated successfully."
        );

        // ======================================
        // RELOAD UPDATED DATA
        // ======================================

        await loadStudents();

      } catch (error) {
        console.error(
          "Update Attendance Error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to update attendance."
        );

      } finally {
        setSaving(false);
      }
    };

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalStudents =
    students.length;

  const presentStudents =
    students.filter(
      (student) =>
        student.status === "Present"
    ).length;

  const absentStudents =
    students.filter(
      (student) =>
        student.status === "Absent"
    ).length;

  const attendancePercentage =
    totalStudents === 0
      ? 0
      : Math.round(
          (presentStudents /
            totalStudents) *
            100
        );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* ==================================
            ATTENDANCE HEADER
        ================================== */}

        <AttendanceHeader
          date={date}
          setDate={setDate}
          search={search}
          setSearch={setSearch}
          onLoadStudents={
            loadStudents
          }
          loading={loading}
        />

        {/* ==================================
            HOLIDAY MANAGEMENT
        ================================== */}

        <HolidayManagement />

        {/* ==================================
            HOLIDAY / SUNDAY MESSAGE
        ================================== */}

        {(isSunday || holidayForDate) && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-5">

            <div className="flex items-start gap-3">

              <div className="text-3xl">
                {isSunday
                  ? "🔵"
                  : "🟠"}
              </div>

              <div>

                <h3 className="text-lg font-bold text-orange-700">
                  {isSunday
                    ? "Sunday - Holiday"
                    : "Class Holiday"}
                </h3>

                <p className="text-orange-600 mt-1">
                  {isSunday
                    ? "Sunday ko automatically holiday maana gaya hai. Is din attendance nahi li ja sakti."
                    : holidayForDate?.reason}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Attendance marking is disabled for this date.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* ==================================
            SUMMARY
        ================================== */}

        {!isSunday &&
          !holidayForDate && (
            <AttendanceSummary
              total={totalStudents}
              present={
                presentStudents
              }
              absent={
                absentStudents
              }
              percentage={
                attendancePercentage
              }
            />
          )}

        {/* ==================================
            ATTENDANCE TABLE
        ================================== */}

        {!isSunday &&
          !holidayForDate && (
            <AttendanceTable
              students={
                filteredStudents
              }
              onAttendanceChange={
                handleAttendance
              }
            />
          )}

        {/* ==================================
            SAVE / UPDATE BUTTON
        ================================== */}

        {!isSunday &&
          !holidayForDate && (
            <div className="mt-5 flex justify-end">

              <button
                type="button"
                onClick={
                  attendanceExists
                    ? handleUpdateAttendance
                    : handleSaveAttendance
                }
                disabled={
                  saving ||
                  loading ||
                  students.length === 0
                }
                className={`
                  px-7
                  py-3
                  text-white
                  rounded-lg
                  font-semibold
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  ${
                    attendanceExists
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                `}
              >
                {saving
                  ? attendanceExists
                    ? "Updating Attendance..."
                    : "Saving Attendance..."
                  : attendanceExists
                    ? "Update Attendance"
                    : "Save Attendance"}
              </button>

            </div>
          )}

      </div>

    </div>
  );
};

export default AdminAttendance;