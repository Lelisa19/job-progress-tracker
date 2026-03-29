// C:\Users\laloo\job-progress-tracker\app\(dashboard)\employer\tasks\page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TaskForm from "./components/TaskForm";
import TaskTable from "./components/TaskTable";
import type { TaskWithDetails } from "./components/TaskTable";
import Modal from "@/components/ui/Modal";
import { Task } from "../../../../types/task";

type ApiTask = {
  id: string;
  projectId: string;
  workerId: string;
  title: string;
  description?: string;
  status: TaskWithDetails["status"];
  deadline: string | Date;
  workerName?: string;
  projectName?: string;
};

function mapApiToRow(t: ApiTask): TaskWithDetails {
  const id = t.id;
  const deadline =
    t.deadline instanceof Date ? t.deadline : new Date(t.deadline);
  return {
    id,
    taskCode: `TSK-${id.slice(-6)}`,
    projectId: t.projectId,
    workerId: t.workerId,
    title: t.title,
    description: t.description ?? "",
    status: t.status,
    deadline,
    workerName: t.workerName ?? "",
    projectName: t.projectName ?? "",
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>(
    []
  );
  const [workers, setWorkers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("deadline");

  const refreshTasks = useCallback(async () => {
    const res = await fetch("/api/tasks", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to load tasks");
    const list = (data.tasks ?? []) as ApiTask[];
    setTasks(list.map(mapApiToRow));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadErr(null);
    Promise.all([
      fetch("/api/tasks", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/projects", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/workers", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([td, pd, wd]) => {
        if (cancelled) return;
        const list = (td.tasks ?? []) as ApiTask[];
        setTasks(list.map(mapApiToRow));
        setProjects(
          (pd.projects ?? []).map((p: { id: string; title: string }) => ({
            id: p.id,
            title: p.title,
          }))
        );
        setWorkers(
          (wd.workers ?? []).map((w: { id: string; name: string }) => ({
            id: w.id,
            name: w.name,
          }))
        );
      })
      .catch((e: Error) => {
        if (!cancelled) setLoadErr(e.message || "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.workerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || task.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "deadline") {
      return a.deadline.getTime() - b.deadline.getTime();
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleAddTask = async (task: Task) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: task.projectId,
        workerId: task.workerId,
        title: task.title,
        description: task.description,
        status: task.status,
        deadline: task.deadline.toISOString(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Could not create task");
      return;
    }
    await refreshTasks();
    setIsModalOpen(false);
  };

  const handleEditTask = async (updatedTask: Task) => {
    if (!selectedTask) return;
    const res = await fetch(`/api/tasks/${updatedTask.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        deadline: updatedTask.deadline.toISOString(),
        projectId: updatedTask.projectId,
        workerId: updatedTask.workerId,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Could not update task");
      return;
    }
    await refreshTasks();
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Could not delete");
      return;
    }
    await refreshTasks();
  };

  const handleEdit = (task: TaskWithDetails) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">All Tasks</h3>
            <p className="text-sm text-gray-500">
              View and organize active tasks across all your ongoing projects.
            </p>
            {loadErr && (
              <p className="mt-1 text-sm text-red-600">{loadErr}</p>
            )}
          </div>
          <Button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="status">Sort by Status</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading tasks…</p>
          ) : (
            <TaskTable
              tasks={sortedTasks}
              onEdit={handleEdit}
              onDelete={handleDeleteTask}
            />
          )}
        </Card>

        {sortedTasks.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
      >
        <TaskForm
          key={selectedTask?.id ?? "new"}
          onSubmit={selectedTask ? handleEditTask : handleAddTask}
          initialTask={selectedTask || undefined}
          projects={projects}
          workers={workers}
        />
      </Modal>
    </div>
  );
}
