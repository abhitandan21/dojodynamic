import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  Shield,
  Users,
  Eye,
  X,
  Check,
  XCircle,
  ExternalLink,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";

// const API_URL = "https://api.amaasa.com/api";
const API_URL = "http://localhost:4001/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [pendingBelts, setPendingBelts] = useState<any[]>([]);
  const [pendingAchievements, setPendingAchievements] =
    useState<any[]>([]);

  // ==========================================
  // CERTIFICATE MODAL
  // ==========================================

  const [selectedCertificate, setSelectedCertificate] =
    useState<any>(null);

  const [selectedType, setSelectedType] =
    useState<"belt" | "competition" | null>(null);

  const [reviewRemark, setReviewRemark] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  // ==========================================
  // EDIT CERTIFICATE
  // ==========================================

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    beltName: "",
    certNo: "",
    title: "",
    kata: "",
    kumite: "",
  });
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editError, setEditError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const studentsRes = await fetch(
        `${API_URL}/admin/students`
      );

      const pendingRes = await fetch(
        `${API_URL}/admin/certificates/pending`
      );

      const studentsData =
        await studentsRes.json();

      const pendingData =
        await pendingRes.json();

      setStudents(studentsData || []);

      setPendingBelts(
        pendingData.belts || []
      );

      setPendingAchievements(
        pendingData.achievements || []
      );

    } catch (error) {
      console.log(
        "Admin dashboard fetch error:",
        error
      );
    }
  };

  // ==========================================
  // OPEN CERTIFICATE MODAL
  // ==========================================

  const openCertificateModal = (
    certificate: any,
    type: "belt" | "competition"
  ) => {
    setSelectedCertificate(certificate);
    setSelectedType(type);
    setReviewRemark("");
    setEditMode(false);
    setEditFile(null);
    setEditError("");
    setEditForm({
      beltName: certificate.beltName || "",
      certNo: certificate.certNo || "",
      title: certificate.title || "",
      kata: certificate.kata || "",
      kumite: certificate.kumite || "",
    });
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeCertificateModal = () => {
    if (actionLoading) return;

    setSelectedCertificate(null);
    setSelectedType(null);
    setReviewRemark("");
    setEditMode(false);
    setEditFile(null);
    setEditError("");
  };

  // ==========================================
  // GET CERTIFICATE URL
  // ==========================================

  const getCertificateUrl = (
    fileUrl?: string
  ) => {
    if (!fileUrl) return "";

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    const baseUrl = API_URL.replace(
      /\/api$/,
      ""
    );

    return `${baseUrl}${fileUrl}`;
  };

  // ==========================================
  // OPEN FULL CERTIFICATE
  // ==========================================

  const openFullCertificate = (
    fileUrl?: string
  ) => {
    if (!fileUrl) {
      alert(
        "Certificate file available nahi hai."
      );
      return;
    }

    const certificateUrl =
      getCertificateUrl(fileUrl);

    window.open(
      certificateUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // APPROVE / REJECT CERTIFICATE
  // ==========================================

  const updateCertificateStatus = async (
    status: "approved" | "rejected"
  ) => {
    if (
      !selectedCertificate ||
      !selectedType
    ) {
      return;
    }

    const actionText =
      status === "approved"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Kya aap is certificate ko ${actionText} karna chahte hain?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const endpoint =
        selectedType === "belt"
          ? `${API_URL}/admin/belts/${selectedCertificate._id}/status`
          : `${API_URL}/admin/achievements/${selectedCertificate._id}/status`;

      const res = await fetch(
        endpoint,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
            reviewRemark:
              reviewRemark.trim(),
          }),
        }
      );

      const responseData =
        await res.json().catch(
          () => ({})
        );

      if (!res.ok) {
        throw new Error(
          responseData?.message ||
            "Certificate status update nahi ho paya."
        );
      }

      alert(
        status === "approved"
          ? "Certificate Approved successfully."
          : "Certificate Rejected successfully."
      );

      // Close modal
      setSelectedCertificate(null);
      setSelectedType(null);
      setReviewRemark("");

      // Refresh pending lists
      await fetchDashboardData();

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Certificate status update nahi ho paya."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // START EDIT MODE
  // ==========================================

  const startEditCertificate = () => {
    if (!selectedCertificate || !selectedType) return;

    setEditForm({
      beltName: selectedCertificate.beltName || "",
      certNo: selectedCertificate.certNo || "",
      title: selectedCertificate.title || "",
      kata: selectedCertificate.kata || "",
      kumite: selectedCertificate.kumite || "",
    });
    setEditFile(null);
    setEditError("");
    setEditMode(true);
  };

  const cancelEditCertificate = () => {
    if (actionLoading) return;
    setEditMode(false);
    setEditFile(null);
    setEditError("");
  };

  // ==========================================
  // SAVE EDITED CERTIFICATE
  // ==========================================

  const saveEditedCertificate = async () => {
    if (!selectedCertificate || !selectedType) return;

    if (selectedType === "belt") {
      if (!editForm.beltName.trim() || !editForm.certNo.trim()) {
        setEditError("Belt name aur Certificate No required hai.");
        return;
      }
    } else if (!editForm.title.trim()) {
      setEditError("Competition name required hai.");
      return;
    }

    if (editFile && editFile.size > 5 * 1024 * 1024) {
      setEditError("File 5MB se jyada nahi honi chahiye.");
      return;
    }

    if (editFile) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (!allowedTypes.includes(editFile.type)) {
        setEditError("Sirf PDF, JPG, JPEG ya PNG file allowed hai.");
        return;
      }
    }

    try {
      setActionLoading(true);
      setEditError("");

      const formData = new FormData();

      if (selectedType === "belt") {
        formData.append("beltName", editForm.beltName.trim());
        formData.append("certNo", editForm.certNo.trim());
      } else {
        formData.append("title", editForm.title.trim());
        formData.append("kata", editForm.kata.trim());
        formData.append("kumite", editForm.kumite.trim());
      }

      if (editFile) {
        formData.append("file", editFile);
      }

      const endpoint =
        selectedType === "belt"
          ? `${API_URL}/admin/belts/${selectedCertificate._id}`
          : `${API_URL}/admin/achievements/${selectedCertificate._id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || "Certificate update nahi ho paya."
        );
      }

      alert(data?.message || "Certificate updated successfully.");

      setSelectedCertificate(data.belt || data.achievement || selectedCertificate);
      setEditMode(false);
      setEditFile(null);

      await fetchDashboardData();

    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Certificate update nahi ho paya."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DELETE CERTIFICATE
  // ==========================================

  const deleteCertificate = async () => {
    if (!selectedCertificate || !selectedType) return;

    const confirmed = window.confirm(
      `WARNING: ${
        selectedType === "belt"
          ? "Belt certificate"
          : "Competition certificate"
      } permanently delete karna hai?\n\nYe action undo nahi kiya ja sakta.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const endpoint =
        selectedType === "belt"
          ? `${API_URL}/admin/belts/${selectedCertificate._id}`
          : `${API_URL}/admin/achievements/${selectedCertificate._id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || "Certificate delete nahi ho paya."
        );
      }

      alert(data?.message || "Certificate deleted successfully.");

      setSelectedCertificate(null);
      setSelectedType(null);
      setReviewRemark("");
      setEditMode(false);
      setEditFile(null);
      setEditError("");

      await fetchDashboardData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Certificate delete nahi ho paya."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // TOTAL PENDING
  // ==========================================

  const totalPending =
    pendingBelts.length +
    pendingAchievements.length;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 pt-28 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Admin Panel
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
              Dashboard Overview
            </h1>

            <p className="text-gray-600 mt-2">
              Students, certificates aur review activity ek jagah.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() =>
                navigate("/admin/students")
              }
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-red-700 transition"
            >
              View Students
            </button>

            <button
              onClick={() =>
                navigate("/admin/students")
              }
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              Review Certificates
            </button>

          </div>
        </div>

        {/* ==========================================
            SUMMARY CARDS
        ========================================== */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">

          {/* Total Students */}

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between mb-4">

              <div className="rounded-xl bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total
              </span>

            </div>

            <h2 className="text-sm font-semibold text-gray-600">
              Registered Students
            </h2>

            <p className="mt-3 text-4xl font-bold text-gray-900">
              {students.length}
            </p>

          </div>

          {/* Pending Belt */}

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between mb-4">

              <div className="rounded-xl bg-amber-100 p-3">
                <Clock3 className="h-6 w-6 text-amber-600" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pending
              </span>

            </div>

            <h2 className="text-sm font-semibold text-gray-600">
              Belt Certificates
            </h2>

            <p className="mt-3 text-4xl font-bold text-gray-900">
              {pendingBelts.length}
            </p>

          </div>

          {/* Pending Competition */}

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between mb-4">

              <div className="rounded-xl bg-rose-100 p-3">
                <Shield className="h-6 w-6 text-rose-600" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pending
              </span>

            </div>

            <h2 className="text-sm font-semibold text-gray-600">
              Competition Certificates
            </h2>

            <p className="mt-3 text-4xl font-bold text-gray-900">
              {pendingAchievements.length}
            </p>

          </div>

          {/* Total Pending */}

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between mb-4">

              <div className="rounded-xl bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </span>

            </div>

            <h2 className="text-sm font-semibold text-gray-600">
              Total Pending Reviews
            </h2>

            <p className="mt-3 text-4xl font-bold text-gray-900">
              {totalPending}
            </p>

          </div>

        </div>

        {/* ==========================================
            PENDING TABLES
        ========================================== */}

        <div className="grid gap-8 xl:grid-cols-2">

          {/* ========================================
              PENDING BELT CERTIFICATES
          ======================================== */}

          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Pending Belt Certificates
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Recent belt submissions waiting for review
                </p>
              </div>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {pendingBelts.length} Pending
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm text-black">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Student
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Belt
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Cert No
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {pendingBelts.length > 0 ? (

                    pendingBelts
                      .slice(0, 5)
                      .map((belt) => (

                        <tr
                          key={belt._id}
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >

                          <td className="px-4 py-4">
                            {belt.studentId?.name ||
                              "N/A"}
                          </td>

                          <td className="px-4 py-4">
                            {belt.beltName ||
                              "N/A"}
                          </td>

                          <td className="px-4 py-4">
                            {belt.certNo ||
                              "N/A"}
                          </td>

                          <td className="px-4 py-4">

                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              {belt.status ||
                                "pending"}
                            </span>

                          </td>

                          <td className="px-4 py-4">

                            <button
                              type="button"
                              onClick={() =>
                                openCertificateModal(
                                  belt,
                                  "belt"
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                            >
                              <Eye className="h-4 w-4" />
                              Review
                            </button>

                          </td>

                        </tr>

                      ))

                  ) : (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        No pending belt certificates
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ========================================
              PENDING COMPETITION CERTIFICATES
          ======================================== */}

          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Pending Competition Certificates
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Recent competition submissions waiting for review
                </p>

              </div>

              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                {pendingAchievements.length} Pending
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm text-black">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Student
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Competition
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Kata
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Kumite
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {pendingAchievements.length > 0 ? (

                    pendingAchievements
                      .slice(0, 5)
                      .map((item) => (

                        <tr
                          key={item._id}
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >

                          <td className="px-4 py-4">
                            {item.studentId?.name ||
                              "N/A"}
                          </td>

                          <td className="px-4 py-4">
                            {item.title ||
                              "N/A"}
                          </td>

                          <td className="px-4 py-4">
                            {item.kata ||
                              "-"}
                          </td>

                          <td className="px-4 py-4">
                            {item.kumite ||
                              "-"}
                          </td>

                          <td className="px-4 py-4">

                            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                              {item.status ||
                                "pending"}
                            </span>

                          </td>

                          <td className="px-4 py-4">

                            <button
                              type="button"
                              onClick={() =>
                                openCertificateModal(
                                  item,
                                  "competition"
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                            >
                              <Eye className="h-4 w-4" />
                              Review
                            </button>

                          </td>

                        </tr>

                      ))

                  ) : (

                    <tr>

                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        No pending competition certificates
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          CERTIFICATE REVIEW MODAL
      ===================================================== */}

      {selectedCertificate && selectedType && (

        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
          onClick={closeCertificateModal}
        >

          <div
            className="relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==========================================
                MODAL HEADER
            ========================================== */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Certificate Review
                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  {selectedType === "belt"
                    ? "Belt Certificate"
                    : "Competition Certificate"}

                </p>

              </div>

              <button
                type="button"
                onClick={closeCertificateModal}
                disabled={actionLoading}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>

            </div>

            {/* ==========================================
                CONTENT
            ========================================== */}

            <div className="grid min-h-0 flex-1 overflow-auto lg:grid-cols-[1fr_320px]">

              {/* ========================================
                  CERTIFICATE PREVIEW
              ======================================== */}

              <div className="min-h-[500px] bg-gray-100 p-4">

                {selectedCertificate.fileUrl ? (

                  <iframe
                    src={getCertificateUrl(
                      selectedCertificate.fileUrl
                    )}
                    title="Certificate Preview"
                    className="h-[65vh] min-h-[500px] w-full rounded-xl border border-gray-300 bg-white"
                  />

                ) : (

                  <div className="flex h-[500px] items-center justify-center rounded-xl bg-white text-gray-500">
                    Certificate file available nahi hai.
                  </div>

                )}

              </div>

              {/* ========================================
                  DETAILS + ACTIONS
              ======================================== */}

              <div className="border-l border-gray-200 bg-white p-5">

                <h3 className="text-lg font-bold text-gray-900 mb-5">
                  Certificate Details
                </h3>

                {/* Student */}

                <div className="mb-4">

                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Student
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedCertificate.studentId?.name ||
                      "N/A"}
                  </p>

                </div>

                {/* Registration */}

                <div className="mb-4">

                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Registration No
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {selectedCertificate.studentId
                      ?.registrationNo ||
                      "N/A"}
                  </p>

                </div>

                {/* Belt Details */}

                {selectedType === "belt" && (

                  <>

                    <div className="mb-4">

                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Belt
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {selectedCertificate.beltName ||
                          "N/A"}
                      </p>

                    </div>

                    <div className="mb-4">

                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Certificate No
                      </p>

                      <p className="mt-1 font-medium text-gray-800">
                        {selectedCertificate.certNo ||
                          "N/A"}
                      </p>

                    </div>

                  </>

                )}

                {/* Competition Details */}

                {selectedType === "competition" && (

                  <>

                    <div className="mb-4">

                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Competition
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {selectedCertificate.title ||
                          "N/A"}
                      </p>

                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">

                      <div>

                        <p className="text-xs font-semibold uppercase text-gray-500">
                          Kata
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                          {selectedCertificate.kata ||
                            "-"}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase text-gray-500">
                          Kumite
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                          {selectedCertificate.kumite ||
                            "-"}
                        </p>

                      </div>

                    </div>

                  </>

                )}

                {/* Status */}

                <div className="mb-5">

                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Status
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {selectedCertificate.status ||
                      "pending"}
                  </span>

                </div>

                {/* Review Remark */}

                <div className="mb-5">

                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Review Remark
                    <span className="font-normal normal-case text-gray-400">
                      {" "}
                      (optional)
                    </span>
                  </label>

                  <textarea
                    value={reviewRemark}
                    onChange={(event) =>
                      setReviewRemark(
                        event.target.value
                      )
                    }
                    placeholder="Write a remark..."
                    rows={3}
                    disabled={actionLoading}
                    className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />

                </div>

                {/* ======================================
                    EDIT MODE
                ====================================== */}

                {editMode ? (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                      <p className="text-sm font-semibold text-blue-800">
                        Edit Certificate
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Existing status aur review remark change nahi honge.
                      </p>
                    </div>

                    {selectedType === "belt" ? (
                      <>
                        <div>
                          <label className="text-xs font-semibold uppercase text-gray-500">
                            Belt Name
                          </label>
                          <input
                            type="text"
                            value={editForm.beltName}
                            onChange={(e) =>
                              setEditForm({ ...editForm, beltName: e.target.value })
                            }
                            disabled={actionLoading}
                            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold uppercase text-gray-500">
                            Certificate No
                          </label>
                          <input
                            type="text"
                            value={editForm.certNo}
                            onChange={(e) =>
                              setEditForm({ ...editForm, certNo: e.target.value })
                            }
                            disabled={actionLoading}
                            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs font-semibold uppercase text-gray-500">
                            Competition Name
                          </label>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                            disabled={actionLoading}
                            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold uppercase text-gray-500">Kata</label>
                            <input
                              type="text"
                              value={editForm.kata}
                              onChange={(e) =>
                                setEditForm({ ...editForm, kata: e.target.value })
                              }
                              disabled={actionLoading}
                              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold uppercase text-gray-500">Kumite</label>
                            <input
                              type="text"
                              value={editForm.kumite}
                              onChange={(e) =>
                                setEditForm({ ...editForm, kumite: e.target.value })
                              }
                              disabled={actionLoading}
                              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-500">
                        Replace Certificate File <span className="font-normal normal-case text-gray-400">(optional)</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                        disabled={actionLoading}
                        className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700"
                      />
                      <p className="mt-1 text-xs text-gray-400">Max 5MB • PDF/JPG/JPEG/PNG</p>
                    </div>

                    {editError && (
                      <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                        {editError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={cancelEditCertificate}
                        disabled={actionLoading}
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveEditedCertificate}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        {actionLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* ======================================
                        ACTION BUTTONS
                    ====================================== */}

                    <div className="space-y-3">

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => updateCertificateStatus("approved")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-5 w-5" />
                        {actionLoading ? "Processing..." : "Approve Certificate"}
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => updateCertificateStatus("rejected")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle className="h-5 w-5" />
                        {actionLoading ? "Processing..." : "Reject Certificate"}
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={startEditCertificate}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit Certificate
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={deleteCertificate}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-black transition disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Certificate
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => openFullCertificate(selectedCertificate.fileUrl)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Full Certificate
                      </button>

                    </div>
                  </>
                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminDashboard;