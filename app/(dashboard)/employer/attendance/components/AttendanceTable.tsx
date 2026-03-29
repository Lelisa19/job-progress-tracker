import { Attendance } from "../../../../../types/attendance";
interface AttendanceTableProps {
  records: Attendance[];
}

export default function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <table className="w-full bg-white rounded-xl shadow overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Worker</th>
          <th className="p-3">Project</th>
          <th className="p-3">Date</th>
          <th className="p-3">Check-In</th>
          <th className="p-3">Check-Out</th>
          <th className="p-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
            <td className="p-3">
              {r.workerName ?? r.workerId}
            </td>
            <td className="p-3">
              {r.projectName ?? r.projectTitle ?? r.projectId}
            </td>
            <td className="p-3">{r.date.toDateString()}</td>
            <td className="p-3">{r.checkInTime}</td>
            <td className="p-3">{r.checkOutTime}</td>
            <td className="p-3">{r.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
