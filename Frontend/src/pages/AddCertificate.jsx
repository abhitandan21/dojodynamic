import { useState } from "react";

export default function AddCertificate() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async () => {
    await fetch("https://dojodynamic222.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        title,
        type,
      }),
    });

    alert("Submitted for approval");
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h2>Add Certificate</h2>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Type (national/international)"
        onChange={(e) => setType(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}