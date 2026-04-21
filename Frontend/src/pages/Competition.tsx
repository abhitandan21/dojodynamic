import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Competition = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4001/api/competition")
      .then(res => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 pt-24 min-h-screen bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Competition</h2>

      {/* 🔄 Loading */}
      {loading && <p>Loading...</p>}

      {/* ❌ No data */}
      {!loading && data.length === 0 && (
        <p className="text-gray-400">No competition data found</p>
      )}

      {/* ✅ Data */}
      {!loading &&
        data.map((item) => (
          <Link
            key={item._id}
            to={`/competition/${item._id}`}
            className="bg-gray-800 p-4 mb-3 rounded-lg block hover:bg-gray-700 transition"
          >
            <h3 className="text-lg font-semibold">
              {item.title || "No Title"}
            </h3>
            <p className="text-gray-400">
              {item.description || "No Description"}
            </p>
          </Link>
        ))}
    </div>
  );
};

export default Competition;