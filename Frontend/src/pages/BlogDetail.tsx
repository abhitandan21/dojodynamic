import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:4001/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => setBlog(data));
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <img src={blog.image} className="w-full h-64 object-cover mb-4" />

      <h1 className="text-3xl font-bold">{blog.title}</h1>

      <p className="text-gray-500 mb-4">{blog.description}</p>

      <p style={{ whiteSpace: "pre-line" }}>
  {blog.content}
</p>

    </div>
  );
}