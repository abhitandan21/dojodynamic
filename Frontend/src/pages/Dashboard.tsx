import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const API_URL = "http://localhost:4001/api";

type User = {
  _id?: string;
  name?: string;
  mobile?: string;
  registrationNo?: string;
  fatherName?: string;
  address?: string;
  dob?: string;
};

type BeltForm = {
  beltName: string;
  certNo: string;
  file: File | null;
};

type CompForm = {
  name: string;
  kata: string;
  kumite: string;
  file: File | null;
};

const MAX_FILE_SIZE = 90 * 1024;

const Dashboard = () => {
  const [tab, setTab] = useState("competition");
  const [user, setUser] = useState<User | null>(null);

  const [beltData, setBeltData] = useState<any[]>([]);
  const [beltForm, setBeltForm] = useState<BeltForm>({
    beltName: "",
    certNo: "",
    file: null,
  });

  const [compData, setCompData] = useState<any[]>([]);
  const [compForm, setCompForm] = useState<CompForm>({
    name: "",
    kata: "",
    kumite: "",
    file: null,
  });

  const [beltError, setBeltError] = useState("");
  const [compError, setCompError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const courses = [
    {
      title: "Personality Development",
      video: "https://www.youtube.com/embed/WQId4YdlxTQ",
    },
    {
      title: "White Belt",
      video: "https://www.youtube.com/embed/pcbB5Ybmplg?si=facc4P_0TAXIQvTh",
    },
    {
      title: "Yellow Belt",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Orange Belt",
      video: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      title: "Green Belt",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Blue Belt",
      video: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      title: "Purple Belt",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Brown II",
      video: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      title: "Brown I",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Plain Brown",
      video: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      title: "Black Belt",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];



  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const loggedInUser = parsed.user || parsed;
      setUser(loggedInUser);

      if (loggedInUser?._id) {
        fetchStudentData(loggedInUser._id);
      }
    }
  }, []);

  const fetchStudentData = async (studentId: string) => {
    try {
      const beltRes = await fetch(`${API_URL}/belts/${studentId}`);
      const achievementRes = await fetch(`${API_URL}/achievements/student/${studentId}`);

      const belts = await beltRes.json();
      const achievements = await achievementRes.json();

      setBeltData(belts);
      setCompData(achievements);
    } catch (error) {
      console.log("Data load error:", error);
    }
  };



  const validateFile = (file: File | null) => {
    if (!file) return "PDF ya image upload karna required hai.";

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      return "Sirf PDF, JPG, JPEG ya PNG file allowed hai.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Warning: File 90KB se jyada nahi honi chahiye.";
    }

    return "";
  };

  const handleBeltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      const error = validateFile(file);
      setBeltError(error);

      setBeltForm({
        ...beltForm,
        file: error ? null : file,
      });

      if (error) e.target.value = "";
      return;
    }

    setBeltForm({
      ...beltForm,
      [name]: value,
    });
  };

  const addBelt = async () => {
    const fileError = validateFile(beltForm.file);

    if (!beltForm.beltName || !beltForm.certNo || fileError) {
      setBeltError(fileError || "Belt name aur certificate number required hai.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("studentId", user?._id || "");
      formData.append("beltName", beltForm.beltName);
      formData.append("certNo", beltForm.certNo);
      formData.append("file", beltForm.file);

      const res = await fetch(`${API_URL}/belts`, {
        method: "POST",
        body: formData,
      });


      const savedBelt = await res.json();

      setBeltData([...beltData, savedBelt]);
      setBeltForm({ beltName: "", certNo: "", file: null });
      setBeltError("");
    } catch (error) {
      setBeltError("Belt details save nahi ho paya.");
    }
  };

  const handleCompChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;

    if (files) {
      const file = files[0];
      const error = validateFile(file);
      setCompError(error);

      setCompForm({
        ...compForm,
        file: error ? null : file,
      });

      if (error) target.value = "";
      return;
    }

    setCompForm({
      ...compForm,
      [name]: value,
    });
  };

  const addCompetition = async () => {
    const fileError = validateFile(compForm.file);

    if (!compForm.name || fileError) {
      setCompError(fileError || "Competition name required hai.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("studentId", user?._id || "");
      formData.append("name", compForm.name);
      formData.append("kata", compForm.kata);
      formData.append("kumite", compForm.kumite);
      formData.append("file", compForm.file);


      const res = await fetch(`${API_URL}/achievements/competition`, {
        method: "POST",
        body: formData,
      });


      const savedCompetition = await res.json();

      setCompData([...compData, savedCompetition]);
      setCompForm({ name: "", kata: "", kumite: "", file: null });
      setCompError("");
    } catch (error) {
      setCompError("Competition details save nahi ho paya.");
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Abhishek Martial Arts and Sports Academy", 20, 20);

    doc.setFontSize(12);
    doc.text(`Student Name: ${user?.name || "N/A"}`, 20, 35);
    doc.text(`Mobile: ${user?.mobile || "N/A"}`, 20, 45);
    doc.text(`Registration No: ${user?.registrationNo || "N/A"}`, 20, 55);
    doc.text(`Father Name: ${user?.fatherName || "N/A"}`, 20, 65);
    doc.text(`DOB: ${user?.dob || "N/A"}`, 20, 75);
    doc.text(`Address: ${user?.address || "N/A"}`, 20, 85);

    doc.setFontSize(14);
    doc.text("Belt Details", 20, 100);

    autoTable(doc, {
      startY: 105,
      head: [["S.No", "Belt Name", "Certificate No", "Status"]],
      body: beltData.map((belt, index) => [
        index + 1,
        belt.beltName || "N/A",
        belt.certNo || "N/A",
        belt.status || "pending",
      ]),
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 20,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
        halign: "center",
        valign: "middle",
      },
    });

    const beltTableEndY = (doc as any).lastAutoTable.finalY + 12;

    doc.setFontSize(14);
    doc.text("Competition Details", 20, beltTableEndY);

    autoTable(doc, {
      startY: beltTableEndY + 5,
      head: [["S.No", "Competition Name", "Kata", "Kumite", "Status"]],
      body: compData.map((comp, index) => [
        index + 1,
        comp.name || comp.title || "N/A",
        comp.kata || "N/A",
        comp.kumite || "N/A",
        comp.status || "pending",
      ]),
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 20,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
        halign: "center",
        valign: "middle",
      },
    });

    const compTableEndY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(12);
    doc.text("Verified by Abhishek Martial Arts and Sports Academy", 20, compTableEndY);

    doc.save(`${user?.name || "student"}-report.pdf`);
  };


  return (
    <div className="flex min-h-screen bg-gray-100 mt-20">
      <div className="w-1/4 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">
          Student Profile
        </h2>

        <p><b>Name:</b> {user?.name || "N/A"}</p>
        <p><b>Mobile:</b> {user?.mobile || "N/A"}</p>
        <p><b>Reg No:</b> {user?.registrationNo || "N/A"}</p>
        <p><b>DOB:</b> {user?.dob || "N/A"}</p>
        <p><b>Father:</b> {user?.fatherName || "N/A"}</p>
        <p><b>Address:</b> {user?.address || "N/A"}</p>

        <button
          onClick={generateReport}
          className="mt-6 bg-yellow-500 text-black w-full py-3 rounded font-bold"
        >
          Generate Report
        </button>
      </div>

      <div className="w-3/4 p-6">
        <div className="flex justify-center gap-8 mt-10 mb-10">
          <button
            onClick={() => setTab("belt")}
            className="bg-blue-500 text-white px-8 py-4 text-lg rounded-xl"
          >
            Belt Details
          </button>

          <button
            onClick={() => setTab("competition")}
            className="bg-green-500 text-white px-8 py-4 text-lg rounded-xl"
          >
            Competition
          </button>

          <button
            onClick={() => setTab("courses")}
            className="bg-purple-500 text-white px-8 py-4 text-lg rounded-xl"
          >
            Courses
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-black">
          {tab === "belt" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Belt Details</h2>

              {beltError && (
                <p className="text-red-600 mb-3 font-semibold">{beltError}</p>
              )}

              <div className="grid grid-cols-4 gap-4 mb-4">
                <input
                  name="beltName"
                  value={beltForm.beltName}
                  placeholder="Belt Name"
                  onChange={handleBeltChange}
                  className="border p-2"
                />

                <input
                  name="certNo"
                  value={beltForm.certNo}
                  placeholder="Certificate No"
                  onChange={handleBeltChange}
                  className="border p-2"
                />

                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleBeltChange}
                  className="border p-2"
                  required
                />

                <button
                  onClick={addBelt}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Add
                </button>
              </div>

              <table className="w-full border text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th>S.No</th>
                    <th>Belt Name</th>
                    <th>Cert No</th>
                    <th>Status</th>
                    <th>View</th>
                  </tr>
                </thead>


                <tbody>
                  {beltData.map((b, i) => (
                    <tr key={i} className="text-center border-t">
                      <td>{i + 1}</td>
                      <td>{b.beltName}</td>
                      <td>{b.certNo}</td>
                      <td>
                        <span
                          className={
                            b.status === "approved"
                              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                              : b.status === "rejected"
                                ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"
                                : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold"
                          }
                        >
                          {b.status || "pending"}
                        </span>
                      </td>
                      <td>
                        {b.status === "approved" && b.fileUrl ? (
                          <a
                            href={`http://localhost:4001${b.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            View
                          </a>
                        ) : b.status === "rejected" ? (
                          <span className="text-red-600 font-semibold">Re-upload required</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">Waiting for approval</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>


              </table>
            </div>
          )}

          {tab === "competition" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Competition Details</h2>

              {compError && (
                <p className="text-red-600 mb-3 font-semibold">{compError}</p>
              )}

              <div className="grid grid-cols-5 gap-4 mb-4">
                <input
                  name="name"
                  value={compForm.name}
                  placeholder="Competition Name"
                  onChange={handleCompChange}
                  className="border p-2"
                />

                <select
                  name="kata"
                  value={compForm.kata}
                  onChange={handleCompChange}
                  className="border p-2"
                >
                  <option value="">Kata</option>
                  <option>Gold</option>
                  <option>Silver</option>
                  <option>Bronze</option>
                </select>

                <select
                  name="kumite"
                  value={compForm.kumite}
                  onChange={handleCompChange}
                  className="border p-2"
                >
                  <option value="">Kumite</option>
                  <option>Gold</option>
                  <option>Silver</option>
                  <option>Bronze</option>
                </select>

                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleCompChange}
                  className="border p-2"
                  required
                />

                <button
                  onClick={addCompetition}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Add
                </button>
              </div>
              <table className="w-full border text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Kata</th>
                    <th>Kumite</th>
                    <th>Status</th>
                    <th>View</th>
                  </tr>
                </thead>


                <tbody>
                  {compData.map((c, i) => (
                    <tr key={i} className="text-center border-t">
                      <td>{i + 1}</td>
                      <td>{c.title || c.name || "N/A"}</td>
                      <td>{c.kata || "N/A"}</td>
                      <td>{c.kumite || "N/A"}</td>
                      <td>
                        <span
                          className={
                            c.status === "approved"
                              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                              : c.status === "rejected"
                                ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"
                                : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold"
                          }
                        >
                          {c.status || "pending"}
                        </span>
                      </td>
                      <td>
                        {c.status === "approved" && c.fileUrl ? (
                          <a
                            href={`http://localhost:4001${c.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            View
                          </a>
                        ) : c.status === "rejected" ? (
                          <span className="text-red-600 font-semibold">Re-upload required</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">Waiting for approval</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>




              </table>
            </div>
          )}

          {tab === "courses" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Courses</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {courses.map((course, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedCourse(course.video)}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg text-sm font-semibold"
                  >
                    {course.title}
                  </button>
                ))}
              </div>
              {selectedCourse ? (
                selectedCourse.includes("youtube.com") ? (
                  <iframe
                    width="100%"
                    height="400"
                    src={selectedCourse}
                    title="Course Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg border"
                  ></iframe>
                ) : (
                  <video width="100%" controls className="rounded-lg border">
                    <source src={selectedCourse} type="video/mp4" />
                  </video>
                )
              ) : (
                <p>Course select karein.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
