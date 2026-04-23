import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock3, Shield, Users } from "lucide-react";

const API_URL = "http://localhost:4001/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [pendingBelts, setPendingBelts] = useState([]);
  const [pendingAchievements, setPendingAchievements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const studentsRes = await fetch(`${API_URL}/admin/students`);
      const pendingRes = await fetch(`${API_URL}/admin/certificates/pending`);

      const studentsData = await studentsRes.json();
      const pendingData = await pendingRes.json();

      setStudents(studentsData || []);
      setPendingBelts(pendingData.belts || []);
      setPendingAchievements(pendingData.achievements || []);
    } catch (error) {
      console.log("Admin dashboard fetch error:", error);
    }
  };

  const totalPending = pendingBelts.length + pendingAchievements.length;

  return (
    <div className="min-h-screen bg-gray-100 pt-28 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Admin Panel
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">
              Students, certificates aur review activity ek jagah.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin/students")}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-red-700 transition"
            >
              View Students
            </button>

            <button
              onClick={() => navigate("/admin/students")}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              Review Certificates
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total
              </span>
            </div>
            <h2 className="text-sm font-semibold text-gray-600">Registered Students</h2>
            <p className="mt-3 text-4xl font-bold text-gray-900">{students.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-amber-100 p-3">
                <Clock3 className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pending
              </span>
            </div>
            <h2 className="text-sm font-semibold text-gray-600">Belt Certificates</h2>
            <p className="mt-3 text-4xl font-bold text-gray-900">{pendingBelts.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-rose-100 p-3">
                <Shield className="h-6 w-6 text-rose-600" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pending
              </span>
            </div>
            <h2 className="text-sm font-semibold text-gray-600">Competition Certificates</h2>
            <p className="mt-3 text-4xl font-bold text-gray-900">
              {pendingAchievements.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </span>
            </div>
            <h2 className="text-sm font-semibold text-gray-600">Total Pending Reviews</h2>
            <p className="mt-3 text-4xl font-bold text-gray-900">{totalPending}</p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Pending Belt Certificates
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Recent belt submissions waiting for review
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {pendingBelts.length} Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-black">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Student</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Belt</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Cert No</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBelts.length > 0 ? (
                    pendingBelts.slice(0, 5).map((belt) => (
                      <tr key={belt._id} className="border-t border-gray-100">
                        <td className="px-4 py-4">{belt.studentId?.name || "N/A"}</td>
                        <td className="px-4 py-4">{belt.beltName || "N/A"}</td>
                        <td className="px-4 py-4">{belt.certNo || "N/A"}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            {belt.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                        No pending belt certificates
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Pending Competition Certificates
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Recent competition submissions waiting for review
                </p>
              </div>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                {pendingAchievements.length} Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-black">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Student</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Competition</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Kata</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Kumite</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAchievements.length > 0 ? (
                    pendingAchievements.slice(0, 5).map((item) => (
                      <tr key={item._id} className="border-t border-gray-100">
                        <td className="px-4 py-4">{item.studentId?.name || "N/A"}</td>
                        <td className="px-4 py-4">{item.title || "N/A"}</td>
                        <td className="px-4 py-4">{item.kata || "N/A"}</td>
                        <td className="px-4 py-4">{item.kumite || "N/A"}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                            {item.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                        No pending competition certificates
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
