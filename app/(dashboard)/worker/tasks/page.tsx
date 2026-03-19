import TaskTable from "../../employer/tasks/components/TaskTable";
import { Task } from "../../../types/task";

const tasksData: Task[] = [
  { id: "1", projectId: "1", workerId: "1", title: "Mix Cement", description: "Mix cement for foundation", status: "Pending", deadline: new Date() },
  { id: "2", projectId: "2", workerId: "1", title: "Install Lights", description: "Install wiring and bulbs", status: "In Progress", deadline: new Date() },
];

export default function WorkerTasksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <TaskTable tasks={tasksData} />
    </div>
  );
}