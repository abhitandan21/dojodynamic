import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API =
"http://localhost:4001/api";

const ResultSessions = () => {

  const [sessions, setSessions] =
    useState<string[]>([]);

  useEffect(() => {

    fetch(
      `${API}/result/sessions`
    )
      .then(res => res.json())
      .then(setSessions);

  }, []);

  return (

    <div className="pt-28 p-6">

      <h1 className="text-3xl font-bold mb-8">

        Belt Examination Results

      </h1>

      <div className="space-y-4">

        {sessions.map((s) => (

          <Link
            key={s}
            to={`/result/${encodeURIComponent(s)}`}
            className="
            block
            bg-white
            shadow
            rounded-xl
            p-5
            hover:shadow-lg
            transition
          "
          >

            📄 {s}

          </Link>

        ))}

      </div>

    </div>

  );

};

export default ResultSessions;