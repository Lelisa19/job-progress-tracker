// app/(dashboard)/employer/reports/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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

type ReportPayload = {
  workerPerformance: {
    id: string;
    name: string;
    score: number;
    level: string;
    color: string;
  }[];
  projectCompletion: { name: string; completion: number; color: string }[];
  paymentTrends: { month: string; paid: number; unpaid: number }[];
  filterOptions: { projects: string[]; workers: string[] };
};

export default function ReportsAnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedWorker, setSelectedWorker] = useState("All Workers");
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    fetch("/api/employer/reports", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        if (c) return;
        setReport({
          workerPerformance: j.workerPerformance ?? [],
          projectCompletion: j.projectCompletion ?? [],
          paymentTrends: j.paymentTrends ?? [],
          filterOptions: j.filterOptions ?? {
            projects: ["All Projects"],
            workers: ["All Workers"],
          },
        });
      })
      .catch((e: Error) => {
        if (!c) setLoadErr(e.message || "Failed to load reports");
      });
    return () => {
      c = true;
    };
  }, []);

  const workerPerformanceData = report?.workerPerformance ?? [];
  const projectCompletionData = report?.projectCompletion ?? [];
  const paymentTrendsData = useMemo(() => {
    const rows = report?.paymentTrends ?? [];
    return rows.length > 0 ? rows : [{ month: "—", paid: 0, unpaid: 0 }];
  }, [report]);

  const projects = report?.filterOptions.projects ?? ["All Projects"];
  const workers = report?.filterOptions.workers ?? ["All Workers"];

  const totalPayroll = paymentTrendsData.reduce((sum, month) => sum + month.paid, 0);
  const totalUnpaid = paymentTrendsData.reduce((sum, month) => sum + month.unpaid, 0);
  const avgPerformance = workerPerformanceData.length
    ? Math.round(
        workerPerformanceData.reduce((sum, w) => sum + w.score, 0) /
          workerPerformanceData.length
      )
    : 0;
  const avgCompletion = projectCompletionData.length
    ? Math.round(
        projectCompletionData.reduce((sum, p) => sum + p.completion, 0) /
          projectCompletionData.length
      )
    : 0;

  const exportCsv = () => {
    const rows = [
      ["Date range", dateRange],
      ["Project", selectedProject],
      ["Worker", selectedWorker],
      ["Total payroll (trend sum)", String(totalPayroll)],
      ["Total unpaid (trend sum)", String(totalUnpaid)],
      ["Avg performance", String(avgPerformance)],
      ["Avg completion %", String(avgCompletion)],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jobtracker-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gain insights into worker performance, projects, and payments.
          </p>
          {loadErr && (
            <p className="text-sm text-red-600 mt-2" role="alert">
              {loadErr}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={exportPdf}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
          >
            Print / Save PDF
          </button>
        </div>
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
                  <span className="font-medium text-gray-700">{worker.name}</span>
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
                const maxAmount = Math.max(
                  1,
                  ...paymentTrendsData.map((m) => m.paid + m.unpaid)
                );
                const total = month.paid + month.unpaid;
                const totalHeight = total ? (total / maxAmount) * 100 : 0;
                const paidHeight = total
                  ? (month.paid / total) * totalHeight
                  : 0;

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