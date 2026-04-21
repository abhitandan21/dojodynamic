import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Students = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:4001/api/students")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-6 pt-24">
      <h2 className="text-2xl font-bold mb-4">Students</h2>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">S.No</th>
            <th className="border p-2">Registration No</th>
            <th className="border p-2">Student Name</th>
            <th className="border p-2">Current Belt</th>
            <th className="border p-2">Certificate No</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map((s, i) => (
            <tr key={s._id} className="text-center hover:bg-gray-100">

              <td className="border p-2">{i + 1}</td>

              <td className="border p-2">{s.registrationNo}</td>

              <td className="border p-2 text-blue-600 underline">
                <Link to={`/students/${s._id}`}>
                  {s.name}
                </Link>
              </td>

              <td className="border p-2">{s.currentBelt}</td>

              {/* 🔥 latest belt record show */}
              <td className="border p-2">
                {s.beltRecords?.[s.beltRecords.length - 1]?.certificateNo || "-"}
              </td>

              <td className="border p-2">
                {s.beltRecords?.[s.beltRecords.length - 1]?.date || "-"}
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Students;