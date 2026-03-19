import AttendanceTable from "../../employer/attendance/components/AttendanceTable";
import { Attendance } from "../../../types/attendance";

const attendanceData: Attendance[] = [
  { id: "1", workerId: "1", projectId: "1", date: new Date(), checkInTime: "08:00", checkOutTime: "17:00", location: { lat: 0, lng: 0 }, status: "Present" },
  { id: "2", workerId: "1", projectId: "2", date: new Date(), checkInTime: "09:00", checkOutTime: "17:00", location: { lat: 0, lng: 0 }, status: "Late" },
];

export default function WorkerAttendancePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>
      <AttendanceTable records={attendanceData} />
    </div>
  );
}