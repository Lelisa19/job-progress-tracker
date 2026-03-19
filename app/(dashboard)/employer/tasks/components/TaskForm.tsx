import { useState } from "react";
import { Task } from "../../../types/task";

interface TaskFormProps {
  onSubmit: (task: Task) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: "", projectId: "", workerId: "", title, description, status, deadline: new Date(deadline) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="w-full p-2 border rounded" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input className="w-full p-2 border rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <select className="w-full p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <input className="w-full p-2 border rounded" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Task</button>
    </form>
  );
}