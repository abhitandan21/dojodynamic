import { useState } from "react";

type CourseVideo = {
  title: string;
  video: string;
};

type CourseCategory = {
  title: string;
  videos: CourseVideo[];
};

const courseCategories: CourseCategory[] = [
  {
    title: "Blocks",
    videos: [
      {
        title: "Basic Blocks",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
      {
        title: "Advanced Blocks",
        video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
      },
    ],
  },
  {
    title: "Kicks",
    videos: [
      {
        title: "Front Kick",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
      {
        title: "Round Kick",
        video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
      },
    ],
  },
  {
    title: "Kata",
    videos: [
      {
        title: "Kata 1",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
      {
        title: "Kata 2",
        video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
      },
    ],
  },
  {
    title: "Punch",
    videos: [
      {
        title: "Basic Punch",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
    ],
  },
  {
    title: "Belt Training",
    videos: [
      {
        title: "White Belt",
        video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
      },
      {
        title: "Yellow Belt",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
  },
];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(
    courseCategories[0]
  );
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">Courses</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {courseCategories.map((category) => (
          <button
            key={category.title}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedVideo(null);
            }}
            className={`p-4 rounded-xl font-bold ${
              selectedCategory?.title === category.title
                ? "bg-purple-600 text-white"
                : "bg-white text-black shadow"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-5">{selectedCategory.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {selectedCategory.videos.map((item) => (
              <button
                key={item.title}
                onClick={() => setSelectedVideo(item)}
                className="bg-gray-900 text-white p-4 rounded-lg font-semibold hover:bg-gray-700"
              >
                {item.title}
              </button>
            ))}
          </div>

          {selectedVideo ? (
            <div>
              <h3 className="text-xl font-bold mb-4">{selectedVideo.title}</h3>

              {selectedVideo.video.includes("youtube.com") ? (
                <iframe
                  width="100%"
                  height="450"
                  src={selectedVideo.video}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl border"
                ></iframe>
              ) : (
                <video width="100%" controls className="rounded-xl border">
                  <source src={selectedVideo.video} type="video/mp4" />
                </video>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Video select karein.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
