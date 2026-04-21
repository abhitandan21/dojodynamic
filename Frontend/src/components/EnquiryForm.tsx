import { useState } from "react";
import { toast } from "sonner";

export const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const res = await fetch("http://localhost:4001/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Enquiry submitted successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        program: "",
        message: "",
      });

    } catch (err: any) {
      toast.error(err.message || "Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />

      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />

      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />

      <select name="program" value={formData.program} onChange={handleChange} required className="w-full p-2 border rounded">
        <option value="">Select Type</option>
        <option value="help">Help Desk</option>
        <option value="complaint">Complaint</option>
        <option value="query">General Query</option>
      </select>

      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" required className="w-full p-2 border rounded" />

      <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-primary text-white rounded">
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};