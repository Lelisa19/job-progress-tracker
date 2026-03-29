"use client";

import { useState } from "react";
import { Worker } from "@/types/worker";
import { Pencil, Trash2, Star, Eye } from "lucide-react";
import WorkerForm from "./WorkerForm";
import Modal from "@/components/ui/Modal";

interface WorkerTableProps {
  workers: Worker[];
  onDelete: (id: string) => void;
  onUpdate: (worker: Worker) => void;
}

type ProfilePayload = {
  worker: Worker & { status?: string };
  attendanceHistory: {
    id: string;
    date: string;
    checkInTime: string;
    checkOutTime: string;
    status: string;
  }[];
  paymentHistory: {
    id: string;
    totalWage: number;
    paidAmount: number;
    unpaidAmount: number;
    status: string;
    paymentDate: string;
  }[];
};

export default function WorkerTable({
  workers,
  onDelete,
  onUpdate,
}: WorkerTableProps) {
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedWorker: Partial<Worker>) => {
    if (editingWorker) {
      onUpdate({ ...editingWorker, ...updatedWorker } as Worker);
    }
    setIsEditModalOpen(false);
    setEditingWorker(null);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const openProfile = async (id: string) => {
    setProfileOpen(true);
    setProfile(null);
    setProfileLoading(true);
    try {
      const res = await fetch(`/api/workers/${id}`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data as ProfilePayload);
    } finally {
      setProfileLoading(false);
    }
  };

  const renderReputation = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : star <= rating
                ? "fill-yellow-400 text-yellow-400 opacity-50"
                : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Worker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Skill
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Daily Wage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {workers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {worker.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {worker.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{worker.phone}</div>
                  {worker.email && (
                    <div className="text-xs text-gray-500">{worker.email}</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                    {worker.skill}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  ${worker.dailyWage}/day
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {renderReputation(worker.reputation)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {worker.status ?? "Active"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => openProfile(worker.id)}
                      className="rounded p-1 text-gray-600 hover:bg-gray-100"
                      title="Profile & history"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(worker)}
                      className="rounded p-1 text-blue-600 hover:bg-blue-50"
                      title="Edit worker"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {deleteConfirmId === worker.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(worker.id)}
                          className="rounded p-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded p-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(worker.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                        title="Delete worker"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {workers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No workers found. Add your first worker to get started.
            </p>
          </div>
        )}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {editingWorker && (
          <WorkerForm
            initialData={editingWorker}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingWorker(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          setProfile(null);
        }}
      >
        <div className="max-h-[80vh] overflow-y-auto p-1">
          {profileLoading && (
            <p className="text-sm text-gray-500">Loading profile…</p>
          )}
          {profile && (
            <>
              <h2 className="text-xl font-bold text-gray-900">
                {profile.worker.name}
              </h2>
              <p className="text-sm text-gray-500">
                {profile.worker.skill} · ${profile.worker.dailyWage}/day
              </p>
              <h3 className="mt-6 text-sm font-semibold text-gray-800">
                Recent attendance
              </h3>
              <ul className="mt-2 space-y-2 text-sm">
                {profile.attendanceHistory.length === 0 && (
                  <li className="text-gray-400">No records yet.</li>
                )}
                {profile.attendanceHistory.map((a) => (
                  <li
                    key={a.id}
                    className="rounded border border-gray-100 px-3 py-2"
                  >
                    {String(a.date)} · In {a.checkInTime} · Out{" "}
                    {a.checkOutTime || "—"} · {a.status}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-sm font-semibold text-gray-800">
                Payment history
              </h3>
              <ul className="mt-2 space-y-2 text-sm">
                {profile.paymentHistory.length === 0 && (
                  <li className="text-gray-400">No payments yet.</li>
                )}
                {profile.paymentHistory.map((p) => (
                  <li
                    key={p.id}
                    className="rounded border border-gray-100 px-3 py-2"
                  >
                    Total ${p.totalWage} · Paid ${p.paidAmount} · Remaining $
                    {p.unpaidAmount} · {p.status} · {p.paymentDate}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
