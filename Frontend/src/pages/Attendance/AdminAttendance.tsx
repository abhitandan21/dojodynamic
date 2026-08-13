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
  // NEW:
  // CHECK WHETHER ATTENDANCE IS ALREADY SAVED
  // ==========================================

  const [attendanceExists, setAttendanceExists] =
    useState(false);

  // ==========================================
  // LOAD STUDENTS + SAVED ATTENDANCE
  // ==========================================

  const loadStudents = async () => {
    try {
      setLoading(true);

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
      // DEFAULT ALL ACTIVE STUDENTS AS PRESENT
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
        if (students.length === 0) {
          alert(
            "No students available."
          );
          return;
        }

        setSaving(true);

        const selectedDate =
          new Date(date);

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
        if (students.length === 0) {
          alert(
            "No students available."
          );
          return;
        }

        setSaving(true);

        const selectedDate =
          new Date(date);

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
            SUMMARY
        ================================== */}

        <AttendanceSummary
          total={totalStudents}
          present={presentStudents}
          absent={absentStudents}
          percentage={
            attendancePercentage
          }
        />

        {/* ==================================
            ATTENDANCE TABLE
        ================================== */}

        <AttendanceTable
          students={
            filteredStudents
          }
          onAttendanceChange={
            handleAttendance
          }
        />

        {/* ==================================
            SAVE / UPDATE BUTTON
        ================================== */}

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

      </div>

    </div>
  );
};

export default AdminAttendance;