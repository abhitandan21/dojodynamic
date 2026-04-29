import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4001/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-10 p-20 bg-black min-h-screen">

      {blogs.map((blog: any) => (
        <Link to={`/blog/${blog._id}`} key={blog._id}>
          <div className="border border-gray-700 rounded-lg overflow-hidden hover:scale-105 transition duration-300 shadow-lg bg-[#111]">

            {/* Image Updated */}
            <div className="w-full h-55 overflow-hidden rounded-t-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-white uppercase">
                {blog.title}
              </h2>

              <p className="text-gray-400 mt-2">
                {blog.description}
              </p>
            </div>

          </div>
        </Link>
      ))}

    </div>
  );
}