import { useState } from "react";

export default function AdminBlog() {
  const [form, setForm] = useState({
    title: "",
    image: "",
    description: "",
    content: ""
  });

  const handleSubmit = async () => {
    await fetch("https://dojodynamic222.onrender.com/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Blog Added ✅");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <input placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} className="w-full mb-3 p-2 border" />

      <input placeholder="Image URL" onChange={e => setForm({...form, image: e.target.value})} className="w-full mb-3 p-2 border" />

      <textarea placeholder="Short Description" onChange={e => setForm({...form, description: e.target.value})} className="w-full mb-3 p-2 border" />

      <textarea placeholder="Full Content" onChange={e => setForm({...form, content: e.target.value})} className="w-full mb-3 p-2 border h-32" />

      <button onClick={handleSubmit} className="bg-red-500 text-white px-4 py-2">
        Add Blog
      </button>

    </div>
  );
}