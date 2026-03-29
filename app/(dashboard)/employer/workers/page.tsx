"use client";

import { useState, useEffect, useMemo } from "react";
import WorkerForm from "./components/WorkerForm";
import WorkerTable from "./components/WorkerTable";
import Modal from "@/components/ui/Modal";
import { Worker } from "@/types/worker";

async function fetchWorkers(): Promise<Worker[]> {
  const res = await fetch("/api/workers", { credentials: "include" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.workers ?? [];
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = async () => {
    try {
      setLoadError(null);
      const list = await fetchWorkers();
      setWorkers(list);
    } catch {
      setLoadError("Could not load workers. Is MongoDB connected?");
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workers;
    return workers.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.skill.toLowerCase().includes(q) ||
        (w.email && w.email.toLowerCase().includes(q))
    );
  }, [workers, search]);

  const addWorker = async (worker: Partial<Worker>) => {
    const res = await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(worker),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Failed to add worker");
      return;
    }
    setIsModalOpen(false);
    await reload();
  };

  const deleteWorker = async (id: string) => {
    const res = await fetch(`/api/workers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    await reload();
  };

  const updateWorker = async (updatedWorker: Worker) => {
    const res = await fetch(`/api/workers/${updatedWorker.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedWorker),
    });
    if (!res.ok) {
      alert("Failed to update");
      return;
    }
    await reload();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Workers Management</h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search worker…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Add Worker
          </button>
        </div>
      </div>

      {loadError && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {loadError}
        </p>
      )}

      <WorkerTable
        workers={filtered}
        onDelete={deleteWorker}
        onUpdate={updateWorker}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <WorkerForm
          onSubmit={addWorker}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
