import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://dojodynamic222.onrender.com/api";

const AdminStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/students`);
      const data = await res.json();

      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.log("Students fetch error:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    const filtered = students.filter((student) =>
      `${student.name || ""} ${student.mobile || ""} ${student.registrationNo || ""}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setFilteredStudents(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Students Panel</h1>

        <input
          type="text"
          placeholder="Search by name / mobile / registration no"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border p-3 rounded mb-6"
        />

        <div className="overflow-x-auto">
          <table className="w-full border text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">S.No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Mobile</th>
                <th className="p-3 border">Registration No</th>
                <th className="p-3 border">Father Name</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student._id} className="text-center border-t">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{student.name || "N/A"}</td>
                    <td className="p-3 border">{student.mobile || "N/A"}</td>
                    <td className="p-3 border">{student.registrationNo || "N/A"}</td>
                    <td className="p-3 border">{student.fatherName || "N/A"}</td>
                    <td className="p-3 border">
                      <button
                        onClick={() => navigate(`/admin/students/${student._id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No students found
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

export default AdminStudents;
