"use client";

import { useEffect, useState } from "react";
import TaskTable from "../../employer/tasks/components/TaskTable";
import type { TaskWithDetails } from "../../employer/tasks/components/TaskTable";

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

export default function WorkerTasksPage() {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    fetch("/api/tasks", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        if (c) return;
        const list = (d.tasks ?? []) as ApiTask[];
        setTasks(list.map(mapApiToRow));
      })
      .catch((e: Error) => {
        if (!c) setErr(e.message || "Failed to load");
      })
      .finally(() => {
        if (!c) setLoading(false);
      });
    return () => {
      c = true;
    };
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Tasks</h1>
      {err && <p className="mb-2 text-sm text-red-600">{err}</p>}
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={() => {}}
          onDelete={() => {}}
          readOnly
        />
      )}
    </div>
  );
}
