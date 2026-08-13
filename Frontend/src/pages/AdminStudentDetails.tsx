import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

//const API_URL = "https://api.amaasa.com/api";
const BACKEND_URL = "https://api.amaasa.com";
const API_URL = "http://localhost:4001/api";

type StudentStatus =
  | "Active"
  | "Inactive"
  | "Dropped"
  | "Completed";

const AdminStudentDetails = () => {
  const { studentId } = useParams();

  const [student, setStudent] =
    useState<any>(null);

  const [belts, setBelts] =
    useState<any[]>([]);

  const [achievements, setAchievements] =
    useState<any[]>([]);

  // ==========================================
  // STUDENT STATUS
  // ==========================================

  const [status, setStatus] =
    useState<StudentStatus>("Active");

  const [inactiveFrom, setInactiveFrom] =
    useState("");

  const [inactiveReason, setInactiveReason] =
    useState("");

  const [savingStatus, setSavingStatus] =
    useState(false);

  // ==========================================
  // FETCH STUDENT DETAILS
  // ==========================================

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      const res = await fetch(
        `${API_URL}/admin/students/${studentId}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Unable to load student details."
        );
      }

      setStudent(data.student);
      setBelts(data.belts || []);
      setAchievements(
        data.achievements || []
      );

      // ========================================
      // LOAD STUDENT STATUS
      // ========================================

      setStatus(
        data.student?.status ||
          "Active"
      );

      setInactiveFrom(
        data.student?.inactiveFrom ||
          ""
      );

      setInactiveReason(
        data.student?.inactiveReason ||
          ""
      );

    } catch (error) {
      console.log(
        "Student details fetch error:",
        error
      );
    }
  };

  // ==========================================
  // UPDATE STUDENT STATUS
  // ==========================================

  const updateStudentStatus =
    async () => {
      try {
        if (!studentId) {
          alert("Student ID not found.");
          return;
        }

        setSavingStatus(true);

        const res = await fetch(
          `${API_URL}/admin/students/${studentId}/status`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status,
              inactiveFrom,
              inactiveReason,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "Unable to update student status."
          );
        }

        // Update local student data
        setStudent(data.student);

        setStatus(
          data.student?.status ||
            status
        );

        setInactiveFrom(
          data.student?.inactiveFrom ||
            ""
        );

        setInactiveReason(
          data.student?.inactiveReason ||
            ""
        );

        alert(
          data.message ||
            "Student status updated successfully."
        );

      } catch (error) {
        console.error(
          "Student status update error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to update student status."
        );

      } finally {
        setSavingStatus(false);
      }
    };

  // ==========================================
  // UPDATE BELT STATUS
  // ==========================================

  const updateBeltStatus = async (
    id: string,
    status: string
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/admin/belts/${id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      if (res.ok) {
        fetchStudentDetails();
      }
    } catch (error) {
      console.log(
        "Belt status update error:",
        error
      );
    }
  };

  // ==========================================
  // UPDATE ACHIEVEMENT STATUS
  // ==========================================

  const updateAchievementStatus =
    async (
      id: string,
      status: string
    ) => {
      try {
        const res = await fetch(
          `${API_URL}/admin/achievements/${id}/status`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

        if (res.ok) {
          fetchStudentDetails();
        }
      } catch (error) {
        console.log(
          "Achievement status update error:",
          error
        );
      }
    };

  // ==========================================
  // GENERATE PDF REPORT
  // ==========================================

  const generatePdfReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);

    doc.text(
      "Abhishek Martial Arts and Sports Academy",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Student Name: ${
        student?.name || "N/A"
      }`,
      20,
      35
    );

    doc.text(
      `Mobile: ${
        student?.mobile || "N/A"
      }`,
      20,
      45
    );

    doc.text(
      `Registration No: ${
        student?.registrationNo ||
        "N/A"
      }`,
      20,
      55
    );

    doc.text(
      `Father Name: ${
        student?.fatherName || "N/A"
      }`,
      20,
      65
    );

    doc.text(
      `Address: ${
        student?.address || "N/A"
      }`,
      20,
      75
    );

    doc.text(
      `Student Status: ${
        student?.status || "Active"
      }`,
      20,
      85
    );

    let y = 105;

    doc.setFontSize(14);

    doc.text(
      "Belt Details",
      20,
      y
    );

    y += 10;

    belts.forEach(
      (belt, index) => {
        doc.setFontSize(11);

        doc.text(
          `${index + 1}. ${
            belt.beltName
          } | Cert No: ${
            belt.certNo
          } | Status: ${
            belt.status || "pending"
          }`,
          20,
          y
        );

        y += 10;
      }
    );

    y += 10;

    doc.setFontSize(14);

    doc.text(
      "Competition Achievements",
      20,
      y
    );

    y += 10;

    achievements.forEach(
      (item, index) => {
        doc.setFontSize(11);

        doc.text(
          `${index + 1}. ${
            item.title || "N/A"
          } | Kata: ${
            item.kata || "N/A"
          } | Kumite: ${
            item.kumite || "N/A"
          } | Status: ${
            item.status || "pending"
          }`,
          20,
          y
        );

        y += 10;
      }
    );

    y += 20;

    doc.setFontSize(12);

    doc.text(
      "Verified by Abhishek Martial Arts and Sports Academy",
      20,
      y
    );

    doc.save(
      `${
        student?.name || "student"
      }-admin-report.pdf`
    );
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusClass = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Inactive":
        return "bg-yellow-100 text-yellow-700";

      case "Dropped":
        return "bg-red-100 text-red-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-500 p-6 mt-20">

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">
            Student Details
          </h1>

          <button
            onClick={
              generatePdfReport
            }
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Generate PDF Report
          </button>

        </div>

        {/* =====================================
            STUDENT BASIC DETAILS
        ===================================== */}

        {student && (
          <div className="grid grid-cols-2 gap-4 bg-white text-black p-4 rounded mb-8 shadow border">

            <p>
              <b>Name:</b>{" "}
              {student.name || "N/A"}
            </p>

            <p>
              <b>Mobile:</b>{" "}
              {student.mobile || "N/A"}
            </p>

            <p>
              <b>Registration No:</b>{" "}
              {student.registrationNo ||
                "N/A"}
            </p>

            <p>
              <b>Father Name:</b>{" "}
              {student.fatherName ||
                "N/A"}
            </p>

            <p className="col-span-2">
              <b>Address:</b>{" "}
              {student.address || "N/A"}
            </p>

          </div>
        )}

        {/* =====================================
            STUDENT STATUS MANAGEMENT
        ===================================== */}

        <div className="border rounded-xl p-5 mb-8 bg-gray-50">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold text-gray-800">
              Student Status
            </h2>

            <span
              className={`px-4 py-2 rounded-full font-semibold ${getStatusClass()}`}
            >
              {status}
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* STATUS */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target
                      .value as StudentStatus
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Dropped">
                  Dropped
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>

            {/* DATE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status From
              </label>

              <input
                type="date"
                value={
                  inactiveFrom
                }
                onChange={(e) =>
                  setInactiveFrom(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />

            </div>

            {/* REASON */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason / Note
              </label>

              <textarea
                value={
                  inactiveReason
                }
                onChange={(e) =>
                  setInactiveReason(
                    e.target.value
                  )
                }
                placeholder="Example: School exams, personal reason, course completed..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />

            </div>

          </div>

          {/* SAVE STATUS */}

          <div className="flex justify-end mt-5">

            <button
              type="button"
              onClick={
                updateStudentStatus
              }
              disabled={
                savingStatus
              }
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingStatus
                ? "Saving..."
                : "Save Status"}
            </button>

          </div>

        </div>

        {/* =====================================
            BELT CERTIFICATES
        ===================================== */}

        <h2 className="text-xl font-bold mb-4">
          Belt Certificates
        </h2>

        <div className="overflow-x-auto mb-8">

          <table className="w-full border text-black">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-3 border">
                  S.No
                </th>

                <th className="p-3 border">
                  Belt Name
                </th>

                <th className="p-3 border">
                  Certificate No
                </th>

                <th className="p-3 border">
                  Status
                </th>

                <th className="p-3 border">
                  View
                </th>

                <th className="p-3 border">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {belts.length > 0 ? (

                belts.map(
                  (belt, index) => (

                    <tr
                      key={belt._id}
                      className="text-center border-t"
                    >

                      <td className="p-3 border">
                        {index + 1}
                      </td>

                      <td className="p-3 border">
                        {belt.beltName ||
                          "N/A"}
                      </td>

                      <td className="p-3 border">
                        {belt.certNo ||
                          "N/A"}
                      </td>

                      <td className="p-3 border">
                        {belt.status ||
                          "pending"}
                      </td>

                      <td className="p-3 border">

                        {belt.fileUrl && (
                          <a
                            href={`${BACKEND_URL}${belt.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            View
                          </a>
                        )}

                      </td>

                      <td className="p-3 border">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              updateBeltStatus(
                                belt._id,
                                "approved"
                              )
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateBeltStatus(
                                belt._id,
                                "rejected"
                              )
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>

                        </div>

                      </td>

                    </tr>

                  )

                )

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="p-4 text-center text-gray-500"
                  >
                    No belt certificates found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =====================================
            COMPETITION ACHIEVEMENTS
        ===================================== */}

        <h2 className="text-xl font-bold mb-4">
          Competition Achievements
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border text-black">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-3 border">
                  S.No
                </th>

                <th className="p-3 border">
                  Competition Name
                </th>

                <th className="p-3 border">
                  Kata
                </th>

                <th className="p-3 border">
                  Kumite
                </th>

                <th className="p-3 border">
                  Status
                </th>

                <th className="p-3 border">
                  View
                </th>

                <th className="p-3 border">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {achievements.length > 0 ? (

                achievements.map(
                  (item, index) => (

                    <tr
                      key={item._id}
                      className="text-center border-t"
                    >

                      <td className="p-3 border">
                        {index + 1}
                      </td>

                      <td className="p-3 border">
                        {item.title ||
                          "N/A"}
                      </td>

                      <td className="p-3 border">
                        {item.kata ||
                          "N/A"}
                      </td>

                      <td className="p-3 border">
                        {item.kumite ||
                          "N/A"}
                      </td>

                      <td className="p-3 border">
                        {item.status ||
                          "pending"}
                      </td>

                      <td className="p-3 border">

                        {item.fileUrl && (
                          <a
                            href={`${BACKEND_URL}${item.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            View
                          </a>
                        )}

                      </td>

                      <td className="p-3 border">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              updateAchievementStatus(
                                item._id,
                                "approved"
                              )
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateAchievementStatus(
                                item._id,
                                "rejected"
                              )
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>

                        </div>

                      </td>

                    </tr>

                  )

                )

              ) : (

                <tr>

                  <td
                    colSpan={7}
                    className="p-4 text-center text-gray-500"
                  >
                    No competition achievements found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminStudentDetails;