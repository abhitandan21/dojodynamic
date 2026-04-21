import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CompetitionDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:4001/api/competition/${id}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, [id]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-black text-white pt-24">

      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

      <p className="text-gray-300 mb-4">{data.description}</p>

      {data.date && <p>Date: {data.date}</p>}
      {data.location && <p>Location: {data.location}</p>}

      {/* 🔥 ADD THIS TABLE */}
      <h2 className="mt-6 text-xl font-bold">Participants & Results</h2>

      {data?.participants?.length > 0 ? (
        <table className="w-full mt-4 border border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Kata</th>
              <th className="border p-2">Kumite</th>
            </tr>
          </thead>

          <tbody>
            {data.participants.map((p: any, i: number) => (
              <tr key={i} className="text-center">
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.kata || "-"}</td>
                <td className="border p-2">{p.kumite || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4 text-gray-400">No participants data</p>
      )}

    </div>
  );
};

export default CompetitionDetails;