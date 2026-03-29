"use client";
import { useState } from "react";
import { Project } from "../../../../../types/project";

interface ProjectFormProps {
  onSubmit: (project: Project) => void;
  initialProject?: Project | null;
  workerOptions: { id: string; name: string }[];
}

export default function ProjectForm({
  onSubmit,
  initialProject,
  workerOptions,
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [location, setLocation] = useState(initialProject?.location ?? "");
  const [startDate, setStartDate] = useState(
    initialProject?.startDate
      ? new Date(initialProject.startDate).toISOString().split("T")[0]
      : ""
  );
  const [progress, setProgress] = useState(
    initialProject?.progress != null ? String(initialProject.progress) : "0"
  );
  const [workers, setWorkers] = useState<string[]>(
    initialProject?.workers ?? []
  );

  const toggleWorker = (id: string) => {
    setWorkers((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialProject?.id ?? "",
      title,
      location,
      startDate: new Date(startDate),
      workers,
      progress: Number(progress) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full p-2 border rounded"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        className="w-full p-2 border rounded"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Progress (%)
        </label>
        <input
          className="w-full p-2 border rounded"
          type="number"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-600">
          Assigned workers
        </p>
        <div className="max-h-40 space-y-2 overflow-y-auto rounded border p-2">
          {workerOptions.length === 0 ? (
            <p className="text-sm text-gray-500">No workers in roster yet.</p>
          ) : (
            workerOptions.map((w) => (
              <label
                key={w.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={workers.includes(w.id)}
                  onChange={() => toggleWorker(w.id)}
                />
                {w.name}
              </label>
            ))
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {initialProject ? "Save project" : "Add project"}
      </button>
    </form>
  );
}
