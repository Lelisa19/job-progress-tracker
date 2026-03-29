"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProjectForm from "./components/ProjectForm";
import Modal from "../../../../components/ui/Modal";
import { Project } from "../../../../types/project";

type ApiProject = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  workers: string[];
  progress: number;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [workerList, setWorkerList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApiProject | null>(null);

  const workerById = useMemo(() => {
    const m = new Map<string, string>();
    for (const w of workerList) m.set(w.id, w.name);
    return m;
  }, [workerList]);

  const load = useCallback(async () => {
    const [pr, wr] = await Promise.all([
      fetch("/api/projects", { credentials: "include" }).then((r) =>
        r.json()
      ),
      fetch("/api/workers", { credentials: "include" }).then((r) =>
        r.json()
      ),
    ]);
    if (pr.error) throw new Error(pr.error);
    if (wr.error) throw new Error(wr.error);
    setProjects(pr.projects ?? []);
    setWorkerList(
      (wr.workers ?? []).map((w: { id: string; name: string }) => ({
        id: w.id,
        name: w.name,
      }))
    );
  }, []);

  useEffect(() => {
    let c = false;
    setLoading(true);
    setErr(null);
    load()
      .catch((e: Error) => {
        if (!c) setErr(e.message || "Failed to load");
      })
      .finally(() => {
        if (!c) setLoading(false);
      });
    return () => {
      c = true;
    };
  }, [load]);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.location && p.location.toLowerCase().includes(q))
    );
  });

  const handleAddOrEdit = async (proj: Project) => {
    if (editing) {
      const res = await fetch(`/api/projects/${editing.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proj.title,
          location: proj.location,
          startDate: proj.startDate.toISOString(),
          progress: proj.progress,
          workers: proj.workers,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }
    } else {
      const res = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proj.title,
          location: proj.location,
          startDate: proj.startDate.toISOString(),
          progress: proj.progress,
          workers: proj.workers,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Create failed");
        return;
      }
    }
    await load();
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }
    await load();
  };

  const openNew = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: ApiProject) => {
    setEditing(p);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">
            Project Management
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Oversee all active construction and maintenance projects.
          </p>
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        </div>
        <button
          type="button"
          onClick={openNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          Add New Project
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-[400px] max-w-full">
          <div className="relative w-full shadow-sm rounded-lg border border-slate-200 bg-white overflow-hidden">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
            <input
              type="text"
              placeholder="Search projects by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm outline-none text-slate-600 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading projects…</p>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f4f7fc] text-[#8697a8] font-medium tracking-wide">
              <tr>
                <th className="px-6 py-4 font-medium text-xs">Project Name</th>
                <th className="px-6 py-4 font-medium text-xs">Start Date</th>
                <th className="px-6 py-4 font-medium text-xs">Status</th>
                <th className="px-6 py-4 font-medium text-xs">
                  Assigned Workers
                </th>
                <th className="px-6 py-4 font-medium text-xs">Progress</th>
                <th className="px-6 py-4 font-medium text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((project) => {
                const status =
                  (project.progress ?? 0) >= 100
                    ? "Completed"
                    : "In Progress";
                const statusColor =
                  status === "Completed"
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-white";
                const progressColor =
                  (project.progress ?? 0) >= 80
                    ? "bg-green-500"
                    : (project.progress ?? 0) >= 40
                      ? "bg-orange-500"
                      : "bg-blue-500";
                const ids = project.workers ?? [];
                const shown = ids.slice(0, 3);
                const extra = Math.max(0, ids.length - 3);
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-[600] text-slate-800 text-[14px]">
                        {project.title}
                      </div>
                      <div className="text-[#9ca3af] text-[13px] mt-0.5 font-medium">
                        {project.location || "No location set"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium text-[13px]">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full text-[12px] font-semibold tracking-wide ${statusColor}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center -space-x-2.5">
                        {shown.map((wid) => (
                          <div
                            key={wid}
                            className="w-[30px] h-[30px] rounded-full border-[2px] border-white shadow-sm bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden"
                          >
                            {initials(workerById.get(wid) ?? "?")}
                          </div>
                        ))}
                        {extra > 0 && (
                          <div className="w-[30px] h-[30px] rounded-full border-[2px] border-white bg-[#f0f4f8] text-[#6b7280] flex items-center justify-center text-[10px] font-bold z-10 shadow-sm">
                            +{extra}
                          </div>
                        )}
                        {ids.length === 0 && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-56">
                      <div className="flex items-center gap-4">
                        <div className="w-full bg-slate-100 rounded-full h-[6px] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progressColor}`}
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-slate-800 font-bold text-[13px] w-8">
                          {project.progress || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#9ca3af]">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:underline text-xs font-medium"
                          onClick={() => openEdit(project)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:underline text-xs font-medium"
                          onClick={() => handleDelete(project.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-slate-500">No projects yet.</p>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
      >
        <ProjectForm
          key={editing?.id ?? "new"}
          onSubmit={handleAddOrEdit}
          initialProject={
            editing
              ? {
                  id: editing.id,
                  title: editing.title,
                  location: editing.location,
                  startDate: new Date(editing.startDate),
                  workers: editing.workers ?? [],
                  progress: editing.progress ?? 0,
                }
              : null
          }
          workerOptions={workerList}
        />
      </Modal>
    </div>
  );
}
