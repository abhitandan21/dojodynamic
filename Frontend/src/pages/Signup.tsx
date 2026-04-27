import { useState } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    registrationNo: "",
    fatherName: "",
    dob: "",
    mobile: "",
    password: "",
    address: "",
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

  const inputClass =
    "w-full border border-gray-300 p-2 mb-2 text-black placeholder-gray-500 bg-white rounded outline-none focus:ring-2 focus:ring-green-400";

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="bg-white p-6 shadow-xl rounded-xl w-80">
        <h2 className="text-xl font-bold mb-4 text-black">Signup</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="mobile"
          placeholder="Mobile"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="fatherName"
          placeholder="Father Name"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="dob"
          type="date"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="registrationNo"
          placeholder="Registration No"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 mb-3 text-black placeholder-gray-500 bg-white rounded outline-none focus:ring-2 focus:ring-green-400"
        />

        <button onClick={handleSignup} className="bg-green-500 text-white w-full p-2 rounded">
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
