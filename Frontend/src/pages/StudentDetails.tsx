import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    fetch(`https://dojodynamic222.onrender.com/api/students/${id}`)
      .then(res => res.json())
      .then(setStudent);
  }, [id]);

  if (!student) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 pt-24">

      {/* Student Info */}
      <h2 className="text-2xl font-bold">{student.name}</h2>
      <p>Belt: {student.belt}</p>
      <p>Level: {student.level}</p>
      <p>{student.achievements}</p>

      {/* 🔥 BELT RECORD TABLE */}
      <h3 className="mt-6 text-xl font-bold">Belt Records</h3>

      {student?.beltRecords?.length > 0 ? (
        <table className="w-full mt-4 border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Belt</th>
              <th className="border p-2">Certificate No</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {student.beltRecords.map((r: any, i: number) => (
              <tr key={i} className="text-center">
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{r.belt}</td>
                <td className="border p-2">{r.certificateNo}</td>
                <td className="border p-2">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4 text-red-500">No records found</p>
      )}

    </div>
  );
};

export default StudentDetails;