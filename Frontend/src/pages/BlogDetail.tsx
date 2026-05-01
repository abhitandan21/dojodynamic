import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    fetch(`https://dojodynamic222.onrender.com/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data));
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  const currentUrl = window.location.href;

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    blog.title + " " + currentUrl
  )}`;

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;

  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    blog.title
  )}&url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="p-20 max-w-3xl mx-auto">

      <img src={blog.image} className="w-full h-74 object-cover mb-4" />

      <h1 className="text-3xl font-bold">{blog.title}</h1>

      <p className="text-gray-500 mb-4">{blog.description}</p>

      <p className="mb-8" style={{ whiteSpace: "pre-line" }}>
        {blog.content}
      </p>

      {/* Share Section */}
      <div className="border-t pt-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">Share this Blog</h3>

        <div className="flex gap-4 flex-wrap">

          <a
            href={whatsappShare}
            target="_blank"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            WhatsApp
          </a>

          <a
            href={facebookShare}
            target="_blank"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Facebook
          </a>

          <a
            href={twitterShare}
            target="_blank"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Twitter
          </a>

          <button
            onClick={() => navigator.clipboard.writeText(currentUrl)}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Copy Link
          </button>

        </div>
      </div>

    </div>
  );
}