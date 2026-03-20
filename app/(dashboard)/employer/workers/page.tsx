"use client";

import { useState } from "react";
import WorkerForm from "./components/WorkerForm";
import WorkerTable from "./components/WorkerTable";
import Modal from "@/components/ui/Modal";
import { Worker } from "@/types/worker";

const initialWorkers: Worker[] = [
  { id: "1", name: "John Doe", phone: "0912345678", skill: "Carpenter", dailyWage: 200, reputation: 4.5 },
  { id: "2", name: "Jane Smith", phone: "0987654321", skill: "Electrician", dailyWage: 250, reputation: 4.7 },
];

export default function WorkersPage() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addWorker = (worker: Partial<Worker>) => {
    setWorkers([...workers, { ...worker, id: String(workers.length + 1) } as Worker]);
    setIsModalOpen(false);
  };

  // Add delete function
  const deleteWorker = (id: string) => {
    setWorkers(workers.filter(worker => worker.id !== id));
  };

  // Add update function
  const updateWorker = (updatedWorker: Worker) => {
    setWorkers(workers.map(worker =>
      worker.id === updatedWorker.id ? updatedWorker : worker
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workers Management</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          Add Worker
        </button>
      </div>

      <WorkerTable
        workers={workers}
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