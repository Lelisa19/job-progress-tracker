"use client";
import { useState } from "react";
import { Project } from "../../../../../types/project";

interface ProjectFormProps {
  onSubmit: (project: Project) => void;
}

export default function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: "", title, location, startDate: new Date(startDate), workers: [], progress: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="w-full p-2 border rounded" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input className="w-full p-2 border rounded" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <input className="w-full p-2 border rounded" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Project</button>
    </form>
  );
}