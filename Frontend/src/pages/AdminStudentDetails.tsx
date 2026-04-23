import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const API_URL = "http://localhost:4001/api";
const BACKEND_URL = "http://localhost:4001";

const AdminStudentDetails = () => {
  const { studentId } = useParams();

  const [student, setStudent] = useState<any>(null);
  const [belts, setBelts] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/students/${studentId}`);
      const data = await res.json();

      setStudent(data.student);
      setBelts(data.belts || []);
      setAchievements(data.achievements || []);
    } catch (error) {
      console.log("Student details fetch error:", error);
    }
  };

  const updateBeltStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/belts/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchStudentDetails();
      }
    } catch (error) {
      console.log("Belt status update error:", error);
    }
  };

  const updateAchievementStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/achievements/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchStudentDetails();
      }
    } catch (error) {
      console.log("Achievement status update error:", error);
    }
  };

  const generatePdfReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Abhishek Martial Arts and Sports Academy", 20, 20);

    doc.setFontSize(12);
    doc.text(`Student Name: ${student?.name || "N/A"}`, 20, 35);
    doc.text(`Mobile: ${student?.mobile || "N/A"}`, 20, 45);
    doc.text(`Registration No: ${student?.registrationNo || "N/A"}`, 20, 55);
    doc.text(`Father Name: ${student?.fatherName || "N/A"}`, 20, 65);
    doc.text(`Address: ${student?.address || "N/A"}`, 20, 75);

    let y = 95;

    doc.setFontSize(14);
    doc.text("Belt Details", 20, y);
    y += 10;

    belts.forEach((belt, index) => {
      doc.setFontSize(11);
      doc.text(
        `${index + 1}. ${belt.beltName} | Cert No: ${belt.certNo} | Status: ${
          belt.status || "pending"
        }`,
        20,
        y
      );
      y += 10;
    });

    y += 10;
    doc.setFontSize(14);
    doc.text("Competition Achievements", 20, y);
    y += 10;

    achievements.forEach((item, index) => {
      doc.setFontSize(11);
      doc.text(
        `${index + 1}. ${item.title || "N/A"} | Kata: ${item.kata || "N/A"} | Kumite: ${
          item.kumite || "N/A"
        } | Status: ${item.status || "pending"}`,
        20,
        y
      );
      y += 10;
    });

    y += 20;
    doc.setFontSize(12);
    doc.text("Verified by Abhishek Martial Arts and Sports Academy", 20, y);

    doc.save(`${student?.name || "student"}-admin-report.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-500 p-6 mt-20">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Details</h1>
          <button
            onClick={generatePdfReport}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Generate PDF Report
          </button>
        </div>

        {student && (
        <div className="grid grid-cols-2 gap-4 bg-white text-black p-4 rounded mb-8 shadow border">
            <p><b>Name:</b> {student.name || "N/A"}</p>
            <p><b>Mobile:</b> {student.mobile || "N/A"}</p>
            <p><b>Registration No:</b> {student.registrationNo || "N/A"}</p>
            <p><b>Father Name:</b> {student.fatherName || "N/A"}</p>
            <p className="col-span-2"><b>Address:</b> {student.address || "N/A"}</p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Belt Certificates</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">S.No</th>
                <th className="p-3 border">Belt Name</th>
                <th className="p-3 border">Certificate No</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">View</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {belts.length > 0 ? (
                belts.map((belt, index) => (
                  <tr key={belt._id} className="text-center border-t">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{belt.beltName || "N/A"}</td>
                    <td className="p-3 border">{belt.certNo || "N/A"}</td>
                    <td className="p-3 border">{belt.status || "pending"}</td>
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
                          onClick={() => updateBeltStatus(belt._id, "approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateBeltStatus(belt._id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No belt certificates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold mb-4">Competition Achievements</h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">S.No</th>
                <th className="p-3 border">Competition Name</th>
                <th className="p-3 border">Kata</th>
                <th className="p-3 border">Kumite</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">View</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {achievements.length > 0 ? (
                achievements.map((item, index) => (
                  <tr key={item._id} className="text-center border-t">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{item.title || "N/A"}</td>
                    <td className="p-3 border">{item.kata || "N/A"}</td>
                    <td className="p-3 border">{item.kumite || "N/A"}</td>
                    <td className="p-3 border">{item.status || "pending"}</td>
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
                            updateAchievementStatus(item._id, "approved")
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            updateAchievementStatus(item._id, "rejected")
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
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
