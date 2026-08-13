interface AttendanceSummaryProps {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

const AttendanceSummary = ({
  total,
  present,
  absent,
  percentage,
}: AttendanceSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

      {/* Total Students */}
      <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
        <p className="text-gray-500 text-sm font-medium">
          Total Students
        </p>

        <h2 className="text-4xl font-bold mt-2 text-blue-600">
          {total}
        </h2>
      </div>

      {/* Present */}
      <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
        <p className="text-gray-500 text-sm font-medium">
          Present
        </p>

        <h2 className="text-4xl font-bold mt-2 text-green-600">
          {present}
        </h2>
      </div>

      {/* Absent */}
      <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500">
        <p className="text-gray-500 text-sm font-medium">
          Absent
        </p>

        <h2 className="text-4xl font-bold mt-2 text-red-600">
          {absent}
        </h2>
      </div>

      {/* Percentage */}
      <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500">
        <p className="text-gray-500 text-sm font-medium">
          Attendance %
        </p>

        <h2 className="text-4xl font-bold mt-2 text-yellow-600">
          {percentage}%
        </h2>
      </div>

    </div>
  );
};

export default AttendanceSummary;