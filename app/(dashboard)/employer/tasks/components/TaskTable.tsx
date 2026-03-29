// C:\Users\laloo\job-progress-tracker\app\(dashboard)\employer\tasks\components\TaskTable.tsx
"use client";

import { Edit, Trash2, Calendar, User, Briefcase } from "lucide-react";

export interface TaskWithDetails {
    id: string;
    taskCode?: string;
    title: string;
    workerName?: string;
    projectName?: string;
    deadline: Date;
    status: "Pending" | "In Progress" | "Completed";
    projectId: string;
    workerId: string;
    description: string;
}

interface TaskTableProps {
    tasks: TaskWithDetails[];
    onEdit: (task: TaskWithDetails) => void;
    onDelete: (taskId: string) => void;
    readOnly?: boolean;
}

export default function TaskTable({
    tasks,
    onEdit,
    onDelete,
    readOnly = false,
}: TaskTableProps) {
    /** UI prompt: Pending = yellow, In Progress = blue, Completed = green */
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-amber-100 text-amber-900";
            case "In Progress":
                return "bg-blue-100 text-blue-800";
            case "Completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Task Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Assigned Worker</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Project</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Deadline</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                        {!readOnly && (
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Action</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-medium text-gray-900">{task.title}</p>
                                    {task.taskCode && (
                                        <p className="text-xs text-gray-400 mt-1">{task.taskCode}</p>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">{task.workerName || "Unassigned"}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">{task.projectName || "No Project"}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">
                                        {task.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </td>
                            {!readOnly && (
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(task)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(task.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}