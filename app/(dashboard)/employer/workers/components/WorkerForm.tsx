// app/(dashboard)/employer/workers/components/WorkerForm.tsx
"use client";

import { useState } from "react";
import { Worker } from "@/types/worker";

interface WorkerFormProps {
  onSubmit: (worker: Partial<Worker>) => void;
  onCancel: () => void;
  initialData?: Worker;
}

export default function WorkerForm({ onSubmit, onCancel, initialData }: WorkerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    skill: initialData?.skill || "",
    dailyWage: initialData?.dailyWage || 0,
    reputation: initialData?.reputation || 4.0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Edit Worker" : "Add New Worker"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0912345678"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skill / Specialization
        </label>
        <select
          required
          value={formData.skill}
          onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a skill</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Electrician">Electrician</option>
          <option value="Plumber">Plumber</option>
          <option value="Mason">Mason</option>
          <option value="Painter">Painter</option>
          <option value="Welder">Welder</option>
          <option value="General Labor">General Labor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Daily Wage ($)
        </label>
        <input
          type="number"
          required
          min="0"
          step="5"
          value={formData.dailyWage}
          onChange={(e) => setFormData({ ...formData, dailyWage: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reputation Rating (1-5)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={formData.reputation}
          onChange={(e) => setFormData({ ...formData, reputation: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-center text-sm text-gray-600 mt-1">
          {formData.reputation.toFixed(1)} / 5.0
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {initialData ? "Update Worker" : "Add Worker"}
        </button>
      </div>
    </form>
  );
}