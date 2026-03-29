import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:4000/api";

export default function Dashboard() {
  const [certs, setCerts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${BASE_URL}/certificates/${user._id}`)
      .then((res) => res.json())
      .then((data) => setCerts(data));
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>

      <a href="/add">Add Certificate</a>

      {certs.map((c) => (
        <div key={c._id}>
          <p>{c.title}</p>
          <p>Status: {c.status}</p>
        </div>
      ))}
    </div>
  );
}