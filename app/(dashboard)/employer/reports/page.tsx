// app/(dashboard)/employer/reports/page.tsx
"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

// Mock data for charts
const workerPerformanceData = [
  { id: "W1", name: "John Doe", score: 92, level: "High", color: "bg-blue-500" },
  { id: "W2", name: "Jane Smith", score: 78, level: "Medium", color: "bg-orange-500" },
  { id: "W3", name: "Mike Johnson", score: 65, level: "Medium", color: "bg-orange-500" },
  { id: "W4", name: "Sarah Williams", score: 88, level: "High", color: "bg-blue-500" },
  { id: "W5", name: "Tom Brown", score: 45, level: "Low", color: "bg-green-500" },
  { id: "W6", name: "Lisa Davis", score: 95, level: "High", color: "bg-blue-500" },
];

const projectCompletionData = [
  { name: "Downtown Office Renovation", completion: 85, color: "bg-blue-500" },
  { name: "Riverside Apartments", completion: 40, color: "bg-orange-500" },
  { name: "City Mall Expansion", completion: 95, color: "bg-green-500" },
  { name: "Highway Bridge Repair", completion: 15, color: "bg-red-500" },
  { name: "Suburban Housing Complex", completion: 60, color: "bg-yellow-500" },
];

const paymentTrendsData = [
  { month: "Jan", paid: 45000, unpaid: 12000 },
  { month: "Feb", paid: 52000, unpaid: 15000 },
  { month: "Mar", paid: 48000, unpaid: 18000 },
  { month: "Apr", paid: 61000, unpaid: 14000 },
  { month: "May", paid: 55000, unpaid: 22000 },
  { month: "Jun", paid: 67000, unpaid: 19000 },
  { month: "Jul", paid: 72000, unpaid: 16000 },
  { month: "Aug", paid: 68000, unpaid: 21000 },
  { month: "Sep", paid: 71000, unpaid: 17000 },
];

// Projects for filter
const projects = [
  "All Projects",
  "Downtown Office Renovation",
  "Riverside Apartments",
  "City Mall Expansion",
  "Highway Bridge Repair",
  "Suburban Housing Complex",
];

// Workers for filter
const workers = [
  "All Workers",
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Williams",
  "Tom Brown",
  "Lisa Davis",
];

export default function ReportsAnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedWorker, setSelectedWorker] = useState("All Workers");

  // Calculate summary statistics
  const totalPayroll = paymentTrendsData.reduce((sum, month) => sum + month.paid, 0);
  const totalUnpaid = paymentTrendsData.reduce((sum, month) => sum + month.unpaid, 0);
  const avgPerformance = Math.round(
    workerPerformanceData.reduce((sum, w) => sum + w.score, 0) / workerPerformanceData.length
  );
  const avgCompletion = Math.round(
    projectCompletionData.reduce((sum, p) => sum + p.completion, 0) / projectCompletionData.length
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gain insights into worker performance, projects, and payments.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Project</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {projects.map((project) => (
                  <option key={project}>{project}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Worker Filter */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Worker</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {workers.map((worker) => (
                  <option key={worker}>{worker}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setDateRange("Last 30 Days");
                setSelectedProject("All Projects");
                setSelectedWorker("All Workers");
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Payroll</span>
            <DollarSign className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${totalPayroll.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Last 9 months</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Unpaid Amount</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${totalUnpaid.toLocaleString()}
          </div>
          <div className="text-xs text-red-500 mt-1">Awaiting payment</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Avg Performance</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{avgPerformance}%</div>
          <div className="text-xs text-gray-500 mt-1">Worker average</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Projects Progress</span>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{avgCompletion}%</div>
          <div className="text-xs text-gray-500 mt-1">Average completion</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Worker Performance Score */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Worker Performance Score</h2>

          {/* Performance Bars */}
          <div className="space-y-3 mb-4">
            {workerPerformanceData.map((worker) => (
              <div key={worker.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{worker.id}</span>
                  <span className="text-gray-600">{worker.score}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${worker.color}`}
                    style={{ width: `${worker.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">High (80-100%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">Medium (50-79%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Low (0-49%)</span>
            </div>
          </div>
        </div>

        {/* Project Completion Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Completion Status</h2>

          <div className="space-y-4">
            {projectCompletionData.map((project) => (
              <div key={project.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{project.name}</span>
                  <span className="text-gray-600">{project.completion}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${project.color}`}
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">On Track (80-100%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Progressing (60-79%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600">Behind (40-59%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">Delayed (20-39%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">At Risk (0-19%)</span>
            </div>
          </div>
        </div>

        {/* Payment Trends */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Payment Trends</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Paid</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-xs text-gray-600">Unpaid</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-around">
              {paymentTrendsData.map((month) => {
                const maxAmount = Math.max(...paymentTrendsData.map(m => m.paid + m.unpaid));
                const totalHeight = ((month.paid + month.unpaid) / maxAmount) * 100;
                const paidHeight = (month.paid / (month.paid + month.unpaid)) * totalHeight;

                return (
                  <div key={month.month} className="flex flex-col items-center w-12">
                    <div className="relative w-full h-48 flex flex-col-reverse">
                      {/* Paid Bar */}
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all duration-300"
                        style={{ height: `${paidHeight}%` }}
                      ></div>
                      {/* Unpaid Bar */}
                      <div
                        className="w-full bg-gray-300 rounded-t transition-all duration-300"
                        style={{ height: `${totalHeight - paidHeight}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
            <div>
              <div className="text-sm text-gray-500">Total Paid</div>
              <div className="text-xl font-bold text-gray-800">
                ${totalPayroll.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Unpaid</div>
              <div className="text-xl font-bold text-red-500">
                ${totalUnpaid.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}