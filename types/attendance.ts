export interface Attendance {
  id: string;
  workerId: string;
  projectId: string;
  date: Date;
  checkInTime: string;
  checkOutTime: string;
  location: { lat: number; lng: number };
  status: "Present" | "Absent" | "Late";
}