import { useState } from "react";
import ProjectForm from "./components/ProjectForm";
import ProjectTable from "./components/ProjectTable";
import Modal from "../../../components/ui/Modal";
import { Project } from "../../../types/project";

const initialProjects: Project[] = [
  { id: "1", title: "Build Fence", location: "Addis Ababa", startDate: new Date(), workers: [], progress: 30 },
  { id: "2", title: "Install Wiring", location: "Dire Dawa", startDate: new Date(), workers: [], progress: 50 },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addProject = (project: Project) => {
    setProjects([...projects, { ...project, id: String(projects.length + 1) }]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setIsModalOpen(true)}>Add Project</button>
      </div>

      <ProjectTable projects={projects} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProjectForm onSubmit={addProject} />
      </Modal>
    </div>
  );
}