import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/blogs")
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">

      {blogs.map((blog: any) => (
        <Link to={`/blog/${blog._id}`} key={blog._id}>
          <div className="border p-4 rounded">

            <img src={blog.image} className="w-full h-48 object-cover" />

            <h2 className="text-xl mt-2">{blog.title}</h2>
            <p className="text-gray-500">{blog.description}</p>

          </div>
        </Link>
      ))}

    </div>
  );
}