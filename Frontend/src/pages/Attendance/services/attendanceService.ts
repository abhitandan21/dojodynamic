const API_URL = "http://localhost:4001/api";

// ==========================================
// ATTENDANCE STUDENT TYPE
// ==========================================

interface AttendanceStudent {
  studentId: string;
  studentName: string;
  registrationNo: string;
  status: "Present" | "Absent";
}

// ==========================================
// SAVE ATTENDANCE DATA
// ==========================================

interface SaveAttendanceData {
  date: string;
  month: number;
  year: number;
  markedBy: string;
  batch?: string;
  attendance: AttendanceStudent[];
}

// ==========================================
// UPDATE ATTENDANCE DATA
// ==========================================

interface UpdateAttendanceData {
  date: string;
  month: number;
  year: number;
  markedBy: string;
  batch?: string;
  attendance: AttendanceStudent[];
}

// ==========================================
// GET ACTIVE STUDENTS
// GET /api/students
// ==========================================

export const getStudents = async () => {
  try {
    const response = await fetch(
      `${API_URL}/students`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Unable to load students"
      );
    }

    return result;

  } catch (error) {
    console.error(
      "Get Students Error:",
      error
    );

    throw error;
  }
};

// ==========================================
// SAVE ATTENDANCE
// POST /api/attendance
// ==========================================

export const saveAttendance = async (
  data: SaveAttendanceData
) => {
  try {
    const response = await fetch(
      `${API_URL}/attendance`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Unable to save attendance"
      );
    }

    return result;

  } catch (error) {
    console.error(
      "Save Attendance Error:",
      error
    );

    throw error;
  }
};

// ==========================================
// GET ATTENDANCE BY DATE
// GET /api/attendance/date/:date
// ==========================================

export const getAttendanceByDate =
  async (date: string) => {
    try {
      const response = await fetch(
        `${API_URL}/attendance/date/${date}`
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load attendance"
        );
      }

      return result;

    } catch (error) {
      console.error(
        "Get Attendance Error:",
        error
      );

      throw error;
    }
  };

// ==========================================
// UPDATE ATTENDANCE BY DATE
// PUT /api/attendance/date/:date
// ==========================================

export const updateAttendanceByDate =
  async (
    data: UpdateAttendanceData
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/attendance/date/${data.date}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            month: data.month,
            year: data.year,
            markedBy: data.markedBy,
            batch:
              data.batch || "General",
            attendance:
              data.attendance,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update attendance"
        );
      }

      return result;

    } catch (error) {
      console.error(
        "Update Attendance Error:",
        error
      );

      throw error;
    }
  };