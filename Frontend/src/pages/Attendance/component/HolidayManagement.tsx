import { useEffect, useState } from "react";

import {
  addHoliday,
  getHolidays,
  deleteHoliday,
} from "../services/calendarService";

import type { Holiday } from "../services/calendarService";

// ==========================================
// HOLIDAY MANAGEMENT
// ==========================================

const HolidayManagement = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [date, setDate] = useState("");

  const [reason, setReason] =
    useState("");

  const [holidays, setHolidays] =
    useState<Holiday[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // ==========================================
  // LOAD HOLIDAYS
  // ==========================================

  const loadHolidays = async () => {
    try {
      setLoading(true);

      const data =
        await getHolidays();

      setHolidays(data);

    } catch (error) {
      console.error(
        "Load Holidays Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load holidays."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadHolidays();
  }, []);

  // ==========================================
  // ADD HOLIDAY
  // ==========================================

  const handleAddHoliday = async () => {
    try {
      // ======================================
      // VALIDATION
      // ======================================

      if (!date) {
        alert(
          "Please select holiday date."
        );
        return;
      }

      if (!reason.trim()) {
        alert(
          "Please enter holiday reason."
        );
        return;
      }

      // ======================================
      // PREVENT SUNDAY
      // ======================================

      const selectedDate =
        new Date(`${date}T00:00:00`);

      if (
        selectedDate.getDay() === 0
      ) {
        alert(
          "Sunday already automatically holiday hai. Sunday ko manually add karne ki zarurat nahi hai."
        );
        return;
      }

      // ======================================
      // SAVE
      // ======================================

      setSaving(true);

      const userData =
        localStorage.getItem("user");

      let createdBy = "Admin";

      if (userData) {
        try {
          const user =
            JSON.parse(userData);

          createdBy =
            user.name ||
            user.username ||
            user.email ||
            "Admin";
        } catch {
          createdBy = "Admin";
        }
      }

      const result =
        await addHoliday(
          date,
          reason.trim(),
          createdBy
        );

      alert(
        result.message ||
          "Holiday added successfully."
      );

      // ======================================
      // RESET FORM
      // ======================================

      setDate("");
      setReason("");

      // ======================================
      // RELOAD LIST
      // ======================================

      await loadHolidays();

    } catch (error) {
      console.error(
        "Add Holiday Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add holiday."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE HOLIDAY
  // ==========================================

  const handleDeleteHoliday = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Kya aap is holiday ko delete karna chahte hain?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const result =
        await deleteHoliday(id);

      alert(
        result.message ||
          "Holiday deleted successfully."
      );

      await loadHolidays();

    } catch (error) {
      console.error(
        "Delete Holiday Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete holiday."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    dateString: string
  ) => {
    const date =
      new Date(
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
  // UI
  // ==========================================

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          🗓️ Class Holiday Management
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Sunday automatically holiday maana
          jayega. Yahan sirf special holidays
          add karein.
        </p>
      </div>

      {/* ======================================
          ADD HOLIDAY FORM
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

        {/* DATE */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Holiday Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* REASON */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Holiday Reason
          </label>

          <input
            type="text"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            placeholder="e.g. Rakhi Festival"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BUTTON */}

        <button
          type="button"
          onClick={
            handleAddHoliday
          }
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? "Adding Holiday..."
            : "+ Add Holiday"}
        </button>
      </div>

      {/* ======================================
          HOLIDAY LIST
      ====================================== */}

      <div className="mt-7">

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">
            Marked Holidays
          </h3>

          <span className="text-sm text-gray-500">
            {holidays.length} holiday
            {holidays.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="text-center py-6 text-gray-500">
            Loading holidays...
          </div>
        ) : holidays.length === 0 ? (
          /* EMPTY */

          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
            No special holidays marked yet.
          </div>
        ) : (
          /* TABLE */

          <div className="overflow-x-auto border border-gray-200 rounded-lg">

            <table className="w-full text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    #
                  </th>

                  <th className="px-4 py-3 text-left">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left">
                    Reason
                  </th>

                  <th className="px-4 py-3 text-left">
                    Added By
                  </th>

                  <th className="px-4 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {holidays.map(
                  (holiday, index) => (
                    <tr
                      key={holiday._id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-4 py-3">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 font-semibold text-gray-700">
                        {formatDate(
                          holiday.date
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {holiday.reason}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {holiday.createdBy ||
                          "Admin"}
                      </td>

                      <td className="px-4 py-3 text-center">

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteHoliday(
                              holiday._id
                            )
                          }
                          disabled={
                            deletingId ===
                            holiday._id
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId ===
                          holiday._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

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

export default HolidayManagement;