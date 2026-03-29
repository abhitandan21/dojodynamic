import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/certificates")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  const approve = async (id) => {
    await fetch(`http://localhost:4000/api/admin/approve/${id}`, {
      method: "PUT",
    });

    alert("Approved");
    window.location.reload();
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      {data.map((c) => (
        <div key={c._id}>
          <p>{c.title}</p>
          <p>User: {c.userId?.name}</p>
          <button onClick={() => approve(c._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}