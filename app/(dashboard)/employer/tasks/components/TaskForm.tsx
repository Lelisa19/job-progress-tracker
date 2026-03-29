// C:\Users\laloo\job-progress-tracker\app\(dashboard)\employer\tasks\components\TaskForm.tsx
"use client";

import { useState } from "react";
import { Task } from "../../../../../types/task";

interface TaskWithDetails {
  id: string;
  taskCode?: string;
  title: string;
  workerName?: string;
  projectName?: string;
  deadline: Date;
  status: "Pending" | "In Progress" | "Completed";
  projectId: string;
  workerId: string;
  description: string;
}

interface TaskFormProps {
  onSubmit: (task: Task) => void | Promise<void>;
  initialTask?: TaskWithDetails;
  projects: { id: string; title: string }[];
  workers: { id: string; name: string }[];
}

export default function TaskForm({
  onSubmit,
  initialTask,
  projects,
  workers,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [status, setStatus] = useState<"Pending" | "In Progress" | "Completed">(
    initialTask?.status || "Pending"
  );
  const [deadline, setDeadline] = useState(
    initialTask?.deadline
      ? initialTask.deadline.toISOString().split("T")[0]
      : ""
  );
  const [projectId, setProjectId] = useState(initialTask?.projectId || "");
  const [workerId, setWorkerId] = useState(initialTask?.workerId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onSubmit({
      id: initialTask?.id || "",
      projectId,
      workerId,
      title,
      description,
      status,
      deadline: new Date(deadline),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project
        </label>
        <select
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          <option value="">Select project…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Worker
        </label>
        <select
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          required
        >
          <option value="">Select worker…</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as "Pending" | "In Progress" | "Completed"
            )
          }
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <input
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        {initialTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}
