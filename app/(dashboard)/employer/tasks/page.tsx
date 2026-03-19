import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskTable from "./components/TaskTable";
import Modal from "../../../components/ui/Modal";
import { Task } from "../../../types/task";

const initialTasks: Task[] = [
  { id: "1", projectId: "1", workerId: "1", title: "Mix Cement", description: "Mix cement for foundation", status: "Pending", deadline: new Date() },
  { id: "2", projectId: "2", workerId: "2", title: "Install Lights", description: "Install wiring and bulbs", status: "In Progress", deadline: new Date() },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (task: Task) => {
    setTasks([...tasks, { ...task, id: String(tasks.length + 1) }]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setIsModalOpen(true)}>Add Task</button>
      </div>

      <TaskTable tasks={tasks} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm onSubmit={addTask} />
      </Modal>
    </div>
  );
}