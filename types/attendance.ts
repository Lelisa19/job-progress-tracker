export interface Attendance {
  id: string;
  workerId: string;
  projectId: string;
  /** Display names when loaded from API */
  workerName?: string;
  projectName?: string;
  /** Worker-scoped API may return this instead of projectName */
  projectTitle?: string;
  date: Date;
  checkInTime: string;
  checkOutTime: string;
  location: { lat: number; lng: number };
  status: "Present" | "Absent" | "Late";
}