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

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "registrationNo"
          ? value.toUpperCase()
          : value
    });
  };

  const handleSignup = async () => {

    // REGISTRATION VALIDATION
    const regRegex = /^AMAASA\/\d{4}\/\d{3}$/;

    if (!regRegex.test(form.registrationNo)) {
      return alert(
        "Registration number format should be AMAASA/2025/034"
      );
    }

    // MOBILE VALIDATION
    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(form.mobile)) {
      return alert(
        "Mobile number must be 10 digits"
      );
    }

    try {

      const res = await fetch(
        "https://api.amaasa.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

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

        <h2 className="text-xl font-bold mb-4 text-black">
          Signup
        </h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className={inputClass}
          required
        />

        <input
          name="mobile"
          type="tel"
          placeholder="Enter 10 digit mobile"
          onChange={handleChange}
          className={inputClass}
          maxLength={10}
          pattern="[0-9]{10}"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className={inputClass}
          required
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
          placeholder="AMAASA/2025/034"
          onChange={handleChange}
          className={inputClass}
          required
          pattern="^AMAASA\/\d{4}\/\d{3}$"
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className={inputClass}
        />

        <button
          onClick={handleSignup}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          Signup
        </button>

      </div>
    </div>
  );
};

export default Signup;