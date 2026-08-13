interface Student {
  _id: string;
  name: string;
  registrationNo: string;
  status: "Present" | "Absent";
}

interface AttendanceTableProps {
  students: Student[];
  onAttendanceChange: (
    id: string,
    status: "Present" | "Absent"
  ) => void;
}

const AttendanceTable = ({
  students,
  onAttendanceChange,
}: AttendanceTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">

      <div className="overflow-x-auto">

        <table className="w-full text-gray-900">

          <thead className="bg-gray-100 text-gray-900">

            <tr>

              <th className="px-5 py-4 border-b border-gray-300 text-center font-bold">
                S.No
              </th>

              <th className="px-5 py-4 border-b border-gray-300 text-left font-bold">
                Student Name
              </th>

              <th className="px-5 py-4 border-b border-gray-300 text-center font-bold">
                Registration No
              </th>

              <th className="px-5 py-4 border-b border-gray-300 text-center font-bold">
                Attendance
              </th>

            </tr>

          </thead>

          <tbody>

            {students.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="py-12 text-center text-gray-500"
                >
                  No Students Found
                </td>

              </tr>

            ) : (

              students.map((student, index) => (

                <tr
                  key={student._id}
                  className="hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4 border-b border-gray-200 text-center text-gray-700">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4 border-b border-gray-200 font-semibold text-gray-900">
                    {student.name}
                  </td>

                  <td className="px-5 py-4 border-b border-gray-200 text-center text-gray-700">
                    {student.registrationNo}
                  </td>

                  <td className="px-5 py-4 border-b border-gray-200">

                    <div className="flex justify-center gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          onAttendanceChange(
                            student._id,
                            "Present"
                          )
                        }
                        className={`px-5 py-2 rounded-lg font-semibold transition ${
                          student.status === "Present"
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-gray-200 text-gray-600 hover:bg-green-100"
                        }`}
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onAttendanceChange(
                            student._id,
                            "Absent"
                          )
                        }
                        className={`px-5 py-2 rounded-lg font-semibold transition ${
                          student.status === "Absent"
                            ? "bg-red-600 text-white shadow-sm"
                            : "bg-gray-200 text-gray-600 hover:bg-red-100"
                        }`}
                      >
                        Absent
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AttendanceTable;