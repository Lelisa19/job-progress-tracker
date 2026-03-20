"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import ProjectForm from "./components/ProjectForm";
import Modal from "../../../../components/ui/Modal";
import { Project } from "../../../../types/project";

const initialProjects: any[] = [
    {
        id: "1",
        name: "Downtown Office Reno",
        location: "124 Main St, City Center",
        startDate: "Oct 12, 2023",
        status: "In Progress",
        statusColor: "bg-emerald-500 text-white",
        workers: [
            "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        ],
        extraWorkers: 8,
        progress: 65,
        progressColor: "bg-[#f97316]",
    }
];

export default function ProjectManagementPage() {
    const [projects, setProjects] = useState<any[]>(initialProjects);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Properly handles new projects coming from your form
    const handleAddProject = (newProject: Project) => {
        // We merge your real form data with some default UI fields 
        // so it doesn't break our beautiful table!
        const enhancedProject = {
            ...newProject,
            workers: [], // empty workers for new projects by default
            progress: 0,
            progressColor: "bg-blue-500",
            statusColor: "bg-emerald-500 text-white" // Default badge appearance
        };

        setProjects([...projects, enhancedProject]);
        setIsModalOpen(false);
    };

    return (
        <div className="w-full p-8 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">
                        Project Management
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 font-medium">
                        Oversee all active construction and maintenance projects.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                    Add New Project
                </button>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-[400px]">
                    <div className="relative w-full shadow-sm rounded-lg border border-slate-200 bg-white overflow-hidden">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                        <input
                            type="text"
                            placeholder="Search projects by name or location..."
                            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm outline-none text-slate-600 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <button className="border border-slate-200 rounded-lg px-5 py-1.5 bg-white text-sm text-slate-500 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors shadow-sm min-w-[100px]">
                    <span className="text-[11px] text-slate-400 leading-tight">All</span>
                    <span className="font-medium text-slate-700 leading-tight">Statuses</span>
                </button>
            </div>

            {/* Table Container */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#f4f7fc] text-[#8697a8] font-medium tracking-wide">
                        <tr>
                            <th className="px-6 py-4 font-medium text-xs">Project Name</th>
                            <th className="px-6 py-4 font-medium text-xs">Start Date</th>
                            <th className="px-6 py-4 font-medium text-xs">Status</th>
                            <th className="px-6 py-4 font-medium text-xs">Assigned Workers</th>
                            <th className="px-6 py-4 font-medium text-xs">Progress</th>
                            <th className="px-6 py-4 font-medium text-xs">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {projects.map((project, index) => (
                            <tr key={project.id || index} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-[600] text-slate-800 text-[14px]">
                                        {/* 2. Fallbacks for either 'name' or 'title' */}
                                        {project.name || project.title || "New Project"}
                                    </div>
                                    <div className="text-[#9ca3af] text-[13px] mt-0.5 font-medium">
                                        {project.location || "No location set"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-700 font-medium text-[13px]">
                                    {/* 3. Safely format Dates coming from your form! */}
                                    {project.startDate instanceof Date
                                        ? project.startDate.toLocaleDateString()
                                        : project.startDate}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full text-[12px] font-semibold tracking-wide ${project.statusColor || 'bg-slate-100 text-slate-600'}`}>
                                        {project.status || "Pending"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center -space-x-2.5">
                                        {project.workers?.slice(0, 3).map((worker: string, i: number) => (
                                            <div key={i} className="w-[30px] h-[30px] rounded-full border-[2px] border-white shadow-sm bg-slate-100 overflow-hidden">
                                                <img src={worker} alt="Worker avatar" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        {project.extraWorkers && (
                                            <div className="w-[30px] h-[30px] rounded-full border-[2px] border-white bg-[#f0f4f8] text-[#6b7280] flex items-center justify-center text-[10px] font-bold z-10 shadow-sm">
                                                +{project.extraWorkers}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 w-56">
                                    <div className="flex items-center gap-4">
                                        <div className="w-full bg-slate-100 rounded-full h-[6px] overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${project.progressColor || 'bg-blue-500'}`}
                                                style={{ width: `${project.progress || 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-slate-800 font-bold text-[13px] w-8">
                                            {project.progress || 0}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#9ca3af]"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 4. Removed the "title" prop from Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ProjectForm onSubmit={handleAddProject} />
            </Modal>

        </div>
    );
}
