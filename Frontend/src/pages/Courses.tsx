

import { useState } from "react";

type CourseVideo = {
  title: string;
  video: string;
};

type CourseFolder = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  videos: CourseVideo[];
};

const courseFolders: CourseFolder[] = [
  {
  id: "personality-development",
  title: "Personality Development",
  subtitle: "Confidence, discipline and communication skills",
  color: "bg-red-100 text-red-900 border-red-300",
  videos: [
    {
      title: "Core Principles of Personality Development Part 1g",
      video: "https://www.youtube.com/embed/WQId4YdlxTQ?si=2OvN8-3_O-ZfPdvE",
    },
    {
      title: "How to Develop communication skill ",
      video: "https://www.youtube.com/embed/pG7v_mPEKD4?si=C5Cb8YMgPvUdXvox",
    },
    {
      title: "How to Improve Communication Skill",
      video: "https://www.youtube.com/embed/BiXFG91Eews?si=vJwT9OQIFfSy-CFP",
    },
    {
      title: "How to Minimise mobile screen time",
      video:"https://www.youtube.com/embed/nCFlBSz6sAA?si=3-Fv5Urwks_ESSFr",
    },
  ],
},

  {
    id: "white-belt",
    title: "01. White Belt",
    subtitle: "Beginner foundation training",
    color: "bg-white text-gray-900 border-gray-200",
    videos: [
      {
        title: "White Belt Syllabus Topic one Karate Stances (Dachi)",
        video: "https://www.youtube.com/embed/AAnbrlWFT5E?si=lGlmgZUTzX_R8wmE",
      },
      {
        title: "Chudan Zuki in Heiko Dachi and Hachiji Dachi Topic 2.1",
        video:"https://www.youtube.com/embed/pcbB5Ybmplg?si=JaA1SSAR2YAdeJxJ",
      },
       {
        title: "Jodan Zuki in Heiko Dachi and Hachiji Dachi White Belt Syllabus Topic 2.2",
        video:"https://www.youtube.com/embed/_YqPc3kwayU?si=RghkWCs7QPJll09F",
      },
       {
        title: "Gedan Barai in Heiko and Hachiji Dachi white Belt Syllabus Topic 2.3",
        video:"https://www.youtube.com/embed/R4gQwbrQf4g?si=gjbEFP59iXP-qO4d",
      },
       {
        title:"Chudan Yoko Uke in Heiko and Hachiji Dachi white Belt Syllabus Topic 2.4",
        video:"https://www.youtube.com/embed/vqHSTBWJ7jU?si=5Jptk97-mPo16kbB",
      },
       {
        title: "Jodan Age Uke in Heiko and Hachiji Dachi white Belt Syllabus Topic 2.5",
        video:"https://www.youtube.com/embed/GJThYbmvMWc?si=bKxXuUjYCVwVOHuw",
      },
       {
        title: " Mae Geri in Heisoku Dachi white Belt Syllabus Topic 3.1",
        video:"https://www.youtube.com/embed/tJ3rn_ctNuE?si=aKbXrfps26YztVoO" ,
      },
       {
        title: "Mae te Zuki in Moto and Zenkutsu Dachi white Belt Syllabus Topic 4.1",
        video:"https://www.youtube.com/embed/-AGRgRrjLGw?si=_med_LB7zO1RikNl",
      },
       {
        title: "Gyaku Zuki in Moto and Zenkutsu Dachi white Belt Syllabus Topic 4.2",
        video:"https://www.youtube.com/embed/mTBoMhfzA1Y?si=fE9C_VjUaDLcx0nl",
      },
       {
        title: "Chudan Yoko Uke in Moto Dachi and Zenkutsu Dachi white Belt Syllabus Topic 4.4",
        video:"https://www.youtube.com/embed/WJOSYJLuvj4?si=dZjEWkAAIdIfAU5o",
      },
       {
        title: "Jodan Age Uke in Moto Dachi and Zenkutsu Dachi white Belt Syllabus Topic 4.5",
        video:"https://www.youtube.com/embed/7jqF3GUcPjE?si=aqy3qO6ztpgDE7wU",
      },
       {
        title: "Oi Zuki in Moto Dachi and Zenkutsu Dachi Part 1 Ido kihon ( Moving Techniques)",
        video:"https://www.youtube.com/embed/7jqF3GUcPjE?si=Kjp5_plQfcJLHRI3",
      },
       {
        title: "Oi Zuki in Moto and Zenkutsu Dachi using Moving Techniques Part 2",
        video:"https://www.youtube.com/embed/FNwU_oWzoL8?si=rhs_nxFoX-a9xYu8",
      },
       {
        title: "Gedan Barai in Moto and Zenkutsu Dachi Ido kihon Moving Techniques white Belt Syllabus Topic 5.2",
        video:"https://www.youtube.com/embed/twNmxFIbhlI?si=I38UxJyR0hhkhDsv",
      },
        {
        title: "Chudan Yoko Uke in Moto and Zenkutsu Dachi using Moving Techniques Topic 5.3",
        video:"https://www.youtube.com/embed/lgsKe53zp90?si=Vz0xyA9nL3OPb2wo",
      },
       {
        title: "Jodan Age Uke in Moto and Zenkutsu Dachi Moving Technique white Belt Syllabus Topic 5.4",
        video:"https://www.youtube.com/embed/xAtEDHn-wsg?si=hYn-hrvINM1BAAuy",
      },
       {
        title: "Ayumi Ashi (Stepping) using Moto and Zenkutso Dachi",
        video:"https://www.youtube.com/embed/5VKfQuPp4AA?si=kiwImeEVLLgYxzrQ",
      },
       {
        title: "Mawari Ashi ( Turning) in Moto and Zenkutso Dachi",
        video:"https://www.youtube.com/embed/cR72PKPUj5s?si=9wK5kKtYnBNdLMQ2",
      },
       {
        title: "Shiho Uke Kata Form",
        video:"https://www.youtube.com/embed/-mMeNo2wQ9E?si=AWTScxX7h9reUx-j",
      },
       {
        title: "Juni No Kata",
        video:"https://www.youtube.com/embed/-g3nqBtUn-k?si=hXIab1cHmsn-FNQd",
      },


    ],
  },
  {
    id: "yellow-belt",
    title: "02. Yellow Belt",
    subtitle: "Basic movement and control",
    color: "bg-yellow-100 text-yellow-900 border-yellow-300",
    videos: [
      {
        title: "Yellow Belt Training",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
      {
        title: "Yellow Belt Practice",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
  },
  {
    id: "orange-belt",
    title: "03. Orange Belt",
    subtitle: "Power and balance training",
    color: "bg-orange-100 text-orange-900 border-orange-300",
    videos: [
      {
        title: "Orange Belt Basics",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
    ],
  },
  {
    id: "green-belt",
    title: "04. Green Belt",
    subtitle: "Intermediate skill building",
    color: "bg-green-100 text-green-900 border-green-300",
    videos: [
      {
        title: "Green Belt Training",
        video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
      },
    ],
  },
  {
    id: "blue-belt",
    title: "05. Blue Belt",
    subtitle: "Speed and technique control",
    color: "bg-blue-100 text-blue-900 border-blue-300",
    videos: [
      {
        title: "Blue Belt Training",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
    ],
  },
  {
    id: "purple-belt",
    title: "06. Purple Belt",
    subtitle: "Advanced combinations",
    color: "bg-purple-100 text-purple-900 border-purple-300",
    videos: [
      {
        title: "Purple Belt Training",
        video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
      },
    ],
  },
  {
    id: "brown-belt-2",
    title: "07. Brown Belt II",
    subtitle: "Senior level preparation",
    color: "bg-amber-100 text-amber-950 border-amber-400",
    videos: [
      {
        title: "Brown Belt II Training",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
    ],
  },
  {
    id: "brown-belt-1",
    title: "08. Brown Belt I",
    subtitle: "High level discipline",
    color: "bg-yellow-900 text-white border-yellow-950",
    videos: [
      {
        title: "Brown Belt I Training",
        video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
      },
    ],
  },
  {
    id: "plain-brown-belt",
    title: "09. Plain Brown Belt",
    subtitle: "Pre-black belt training",
    color: "bg-stone-800 text-white border-stone-900",
    videos: [
      {
        title: "Plain Brown Belt Training",
        video: "https://www.youtube.com/embed/WQId4YdlxTQ",
      },
    ],
  },
  {
    id: "black-belt",
    title: "10. Black Belt",
    subtitle: "Master level training",
    color: "bg-black text-white border-black",
    videos: [
      {
        title: "Black Belt Training",
        video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
      },
    ],
  },
];

const Courses = () => {
  const [openFolder, setOpenFolder] = useState<CourseFolder | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);

  const handleOpenFolder = (folder: CourseFolder) => {
    setOpenFolder(folder);
    setSelectedVideo(folder.videos[0] ?? null);
  };

  const isYoutubeVideo = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-950 md:text-4xl">
            Karate Belt Courses
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-600 md:text-base">
            Select a belt folder to open training videos
          </p>
        </div>

        {!openFolder ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {courseFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleOpenFolder(folder)}
                className={`group min-h-44 rounded-lg border p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${folder.color}`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-14 items-center justify-center rounded-md bg-black/10">
                    <span className="text-3xl">📁</span>
                  </div>

                  <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-bold">
                    {folder.videos.length} Videos
                  </span>
                </div>

                <h2 className="text-lg font-extrabold leading-snug">
                  {folder.title}
                </h2>

                <p className="mt-2 text-sm font-medium opacity-80">
                  {folder.subtitle}
                </p>

                <div className="mt-5 text-sm font-bold opacity-80 group-hover:opacity-100">
                  Open Folder →
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white shadow-lg">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <button
                  onClick={() => {
                    setOpenFolder(null);
                    setSelectedVideo(null);
                  }}
                  className="mb-3 rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  ← Back to Folders
                </button>

                <h2 className="text-2xl font-extrabold text-slate-950">
                  {openFolder.title}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {openFolder.subtitle}
                </p>
              </div>

              <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                {openFolder.videos.length} Training Videos
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                  Video List
                </h3>

                <div className="space-y-3">
                  {openFolder.videos.map((item, index) => (
                    <button
                      key={item.title}
                      onClick={() => setSelectedVideo(item)}
                      className={`w-full rounded-lg border p-4 text-left transition ${
                        selectedVideo?.title === item.title
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block text-xs font-bold opacity-70">
                        Video {index + 1}
                      </span>
                      <span className="mt-1 block text-base font-extrabold">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8">
                {selectedVideo ? (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-xl font-extrabold text-slate-950">
                        {selectedVideo.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Watch your selected training video
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-black shadow">
                      {isYoutubeVideo(selectedVideo.video) ? (
                        <iframe
                          width="100%"
                          height="460"
                          src={selectedVideo.video}
                          title={selectedVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="block w-full"
                        />
                      ) : (
                        <video controls className="block w-full">
                          <source src={selectedVideo.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                    <p className="font-semibold text-slate-500">
                      Please select a video
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;