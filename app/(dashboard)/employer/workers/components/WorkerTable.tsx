// app/(dashboard)/employer/workers/components/WorkerTable.tsx
"use client";

import { useState } from "react";
import { Worker } from "@/types/worker";
import { Pencil, Trash2, MoreHorizontal, Star } from "lucide-react";
import WorkerForm from "./WorkerForm";
import Modal from "@/components/ui/Modal";

interface WorkerTableProps {
  workers: Worker[];
  onDelete: (id: string) => void;
  onUpdate: (worker: Worker) => void;
}

export default function WorkerTable({ workers, onDelete, onUpdate }: WorkerTableProps) {
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  // Render stars for reputation
  const renderReputation = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : star <= rating
                  ? "text-yellow-400 fill-yellow-400 opacity-50"
                  : "text-gray-300"
              }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Worker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skill
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Daily Wage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reputation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{worker.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {worker.skill}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${worker.dailyWage}/day
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderReputation(worker.reputation)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(worker)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit worker"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {deleteConfirmId === worker.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleDelete(worker.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 text-xs font-medium"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(worker.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete worker"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {workers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No workers found. Add your first worker to get started.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
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
    </>
  );
}