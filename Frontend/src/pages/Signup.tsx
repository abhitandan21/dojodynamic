import { useState } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:4001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Signup failed");
      }

      alert("Signup successful ✅");
      window.location.href = "/login";

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="bg-white p-6 shadow-xl rounded-xl w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 mb-2" />
        <input name="mobile" placeholder="Mobile" onChange={handleChange} className="w-full border p-2 mb-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 mb-3" />

        <button onClick={handleSignup} className="bg-green-500 text-white w-full p-2 rounded">
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;