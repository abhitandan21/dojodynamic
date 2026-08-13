const API_URL = "http://localhost:4001/api";

/**
 * Get All Active Students
 */
export const getStudents = async () => {
  try {
    const response = await fetch(`${API_URL}/students`);

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    const data = await response.json();

    console.log("Attendance Students:", data);

    return data;
  } catch (error) {
    console.error("Student Fetch Error:", error);
    return [];
  }
};