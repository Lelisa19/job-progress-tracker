export interface Task {
  id: string;
  projectId: string;
  workerId: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  deadline: Date;
}