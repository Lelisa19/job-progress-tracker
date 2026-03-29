"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardPayload = {
  stats: {
    totalWorkers: number;
    activeProjects: number;
    tasksToday: number;
    tasksCompletedWeek: number;
    pendingPayments: number;
  };
  attendanceChart: { day: string; present: number; absent: number }[];
  taskPie: { name: string; value: number; fill: string }[];
  taskCompletionPercent: number;
  paymentSummary: { month: string; paid: number; pending: number }[];
  notifications: { text: string; time: string }[];
};

const emptyDashboard: DashboardPayload = {
  stats: {
    totalWorkers: 0,
    activeProjects: 0,
    tasksToday: 0,
    tasksCompletedWeek: 0,
    pendingPayments: 0,
  },
  attendanceChart: [],
  taskPie: [
    { name: "Done", value: 0, fill: "#2563EB" },
    { name: "In Progress", value: 0, fill: "#F97316" },
    { name: "To Do", value: 0, fill: "#E5E7EB" },
  ],
  taskCompletionPercent: 0,
  paymentSummary: [{ month: "—", paid: 0, pending: 0 }],
  notifications: [],
};

function StatBlock({
  title,
  value,
  sub,
  subClassName = "text-gray-500",
  iconClass,
}: {
  title: string;
  value: string;
  sub: React.ReactNode;
  subClassName?: string;
  iconClass: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <span
        className={`absolute right-4 top-4 inline-block h-3 w-3 rounded-sm ${iconClass}`}
        aria-hidden
      />
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-gray-900">
        {value}
      </p>
      <p className={`mt-2 text-xs font-medium ${subClassName}`}>{sub}</p>
    </div>
  );
}

export default function EmployerDashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/employer/dashboard", { credentials: "include" })
      .then(async (res) => {
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j.error || "Failed to load dashboard");
        return j as DashboardPayload;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const d = data ?? emptyDashboard;
  const pendingFmt = `$${d.stats.pendingPayments.toLocaleString()}`;
  const taskPie = d.taskPie.filter((x) => x.value > 0);
  const pieData = taskPie.length > 0 ? taskPie : d.taskPie;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!data && !error && (
          <p className="mt-2 text-sm text-gray-500">Loading dashboard…</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatBlock
          title="Total Workers"
          value={String(d.stats.totalWorkers)}
          sub="From your roster"
          subClassName="text-gray-500"
          iconClass="bg-[#3B82F6]"
        />
        <StatBlock
          title="Active Projects"
          value={String(d.stats.activeProjects)}
          sub="In the database"
          iconClass="bg-amber-400"
        />
        <StatBlock
          title="Tasks Today"
          value={String(d.stats.tasksToday)}
          sub={`${d.stats.tasksCompletedWeek} completed in last 7 days`}
          subClassName="text-emerald-600"
          iconClass="bg-orange-500"
        />
        <StatBlock
          title="Pending Payments"
          value={pendingFmt}
          sub="Sum of unpaid balances"
          subClassName="text-red-500"
          iconClass="bg-teal-500"
        />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Payment summary
          </h2>
          <Link
            href="/employer/payments"
            className="text-sm font-medium text-[#3B82F6] hover:text-blue-700"
          >
            View payments
          </Link>
        </div>
        <div className="h-56 w-full min-h-[224px] min-w-0 [&_.recharts-responsive-container]:min-h-[224px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart
              data={d.paymentSummary}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                formatter={(val) =>
                  val != null && typeof val === "number"
                    ? [`$${val.toLocaleString()}`, ""]
                    : ["", ""]
                }
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="paid"
                name="Paid"
                stroke="#2563EB"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pending"
                name="Pending"
                stroke="#F97316"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Attendance Overview
            </h2>
            <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
              Last 6 days
            </span>
          </div>
          <div className="h-64 w-full min-w-0 min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={d.attendanceChart}
                barGap={4}
                barCategoryGap="18%"
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(243, 244, 246, 0.6)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="present"
                  name="Present"
                  fill="#1D4ED8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="absent"
                  name="Absent/Late"
                  fill="#E5E7EB"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1D4ED8]" />
              <span className="text-xs text-gray-500">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="text-xs text-gray-500">Absent / Late</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-900">
            Task Completion
          </h2>
          <div className="relative mx-auto h-[220px] w-full min-w-0 max-w-[240px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={88}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`c-${i}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) =>
                    v != null ? [`${v} tasks`, ""] : ["", ""]
                  }
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className="text-2xl font-bold text-gray-900">
                {d.taskCompletionPercent}%
              </span>
              <span className="text-xs font-medium text-gray-500">
                Completed
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {d.taskPie.map((x) => (
              <div key={x.name} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: x.fill }}
                />
                <span className="text-xs text-gray-500">{x.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Latest Notifications
          </h2>
          <Link
            href="/employer/reports"
            className="text-sm font-medium text-[#3B82F6] hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        {d.notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity yet.</p>
        ) : (
          <ul className="space-y-5">
            {d.notifications.map((n, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-sky-100"
                  aria-hidden
                />
                <div>
                  <p className="text-sm text-gray-800">{n.text}</p>
                  <p className="mt-1 text-xs text-gray-400">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
