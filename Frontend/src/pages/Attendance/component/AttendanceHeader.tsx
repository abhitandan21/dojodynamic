interface AttendanceHeaderProps {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onLoadStudents: () => void;
  loading: boolean;
}

const AttendanceHeader = ({
  date,
  setDate,
  search,
  setSearch,
  onLoadStudents,
  loading,
}: AttendanceHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">

        {/* Left */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800">

            Attendance Management

          </h1>

          <p className="text-gray-500 mt-2">

            Mark student attendance and manage daily reports.

          </p>

        </div>

        {/* Right */}

        <div className="flex flex-col md:flex-row gap-3">

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            placeholder="Search Student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-64"
          />

          <button
            onClick={onLoadStudents}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg transition"
          >
            {loading ? "Loading..." : "Load Students"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default AttendanceHeader;