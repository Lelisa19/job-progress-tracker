// C:\Users\laloo\job-progress-tracker\app\(dashboard)\employer\tasks\page.tsx
"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TaskForm from "./components/TaskForm";
import TaskTable from "./components/TaskTable";
import type { TaskWithDetails } from "./components/TaskTable";
import Modal from "@/components/ui/Modal";
import { Task } from "../../../../types/task";

const initialTasks: TaskWithDetails[] = [
  {
    id: "1",
    taskCode: "TSK-1042",
    projectId: "1",
    projectName: "Downtown Office Complex",
    workerId: "1",
    workerName: "Carlos Mendoza",
    title: "Install Electrical Wiring (Floor 2)",
    description: "Install electrical wiring on the second floor including outlets and switches",
    status: "In Progress",
    deadline: new Date(2023, 9, 26)
  },
  {
    id: "2",
    taskCode: "TSK-1043",
    projectId: "2",
    projectName: "Riverside Apartments",
    workerId: "2",
    workerName: "Aisha Johnson",
    title: "Plumbing System Inspection",
    description: "Inspect all plumbing systems for leaks and proper installation",
    status: "Completed",
    deadline: new Date(2023, 9, 25)
  },
  {
    id: "3",
    taskCode: "TSK-1044",
    projectId: "3",
    projectName: "Central Mall Annex",
    workerId: "3",
    workerName: "David Smith",
    title: "Pour Concrete Foundation",
    description: "Pour concrete foundation for the new annex building",
    status: "Pending",
    deadline: new Date(2023, 9, 28)
  },
  {
    id: "4",
    taskCode: "TSK-1045",
    projectId: "1",
    projectName: "Downtown Office Complex",
    workerId: "4",
    workerName: "Lin Chen",
    title: "Site Safety Briefing Setup",
    description: "Set up safety briefing area and materials for site workers",
    status: "Completed",
    deadline: new Date(2023, 9, 24)
  },
  {
    id: "5",
    taskCode: "TSK-1046",
    projectId: "2",
    projectName: "Riverside Apartments",
    workerId: "5",
    workerName: "Raj Patel",
    title: "Material Delivery Verification",
    description: "Verify and document all delivered construction materials",
    status: "Pending",
    deadline: new Date(2023, 9, 27)
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("deadline");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.workerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || task.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "deadline") {
      return a.deadline.getTime() - b.deadline.getTime();
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleAddTask = (task: Task) => {
    const newTask: TaskWithDetails = {
      ...task,
      taskCode: `TSK-${Math.floor(Math.random() * 10000)}`,
      projectName: "Project Name",
      workerName: "Worker Name",
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    if (!selectedTask) return;

    const updatedTaskWithDetails: TaskWithDetails = {
      ...updatedTask,
      taskCode: selectedTask.taskCode,
      projectName: selectedTask.projectName,
      workerName: selectedTask.workerName,
    };
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTaskWithDetails : task));
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleEdit = (task: TaskWithDetails) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* All Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">All Tasks</h3>
            <p className="text-sm text-gray-500">View and organize active tasks across all your ongoing projects.</p>
          </div>
          <Button onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="status">Sort by Status</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <Card className="overflow-hidden">
          <TaskTable
            tasks={sortedTasks}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
          />
        </Card>

        {sortedTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Task */}
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setSelectedTask(null);
      }}>
        <TaskForm
          onSubmit={selectedTask ? handleEditTask : handleAddTask}
          initialTask={selectedTask || undefined}
        />
      </Modal>
    </div>
  );
}