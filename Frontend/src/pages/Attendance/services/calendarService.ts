const API_URL = "http://localhost:4001/api";

// ==========================================
// HOLIDAY TYPE
// ==========================================

export interface Holiday {
  _id: string;
  date: string;
  type: "Holiday";
  reason: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// ADD HOLIDAY
// POST /api/calendar/holiday
// ==========================================

export const addHoliday = async (
  date: string,
  reason: string,
  createdBy: string = "Admin"
) => {
  try {
    const response = await fetch(
      `${API_URL}/calendar/holiday`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          reason,
          createdBy,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Unable to add holiday"
      );
    }

    return result;
  } catch (error) {
    console.error(
      "Add Holiday Error:",
      error
    );

    throw error;
  }
};

// ==========================================
// GET ALL HOLIDAYS
// GET /api/calendar/holidays
// ==========================================

export const getHolidays = async (): Promise<
  Holiday[]
> => {
  try {
    const response = await fetch(
      `${API_URL}/calendar/holidays`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Unable to load holidays"
      );
    }

    return result?.holidays || [];
  } catch (error) {
    console.error(
      "Get Holidays Error:",
      error
    );

    throw error;
  }
};

// ==========================================
// DELETE HOLIDAY
// DELETE /api/calendar/holiday/:id
// ==========================================

export const deleteHoliday = async (
  id: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/calendar/holiday/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Unable to delete holiday"
      );
    }

    return result;
  } catch (error) {
    console.error(
      "Delete Holiday Error:",
      error
    );

    throw error;
  }
};