"use client";

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";

function SquareIcon({ className }: { className: string }) {
  return (
    <span
      className={`inline-block h-3 w-3 shrink-0 rounded-sm ${className}`}
      aria-hidden
    />
  );
}

type ProjectOption = { id: string; title: string };

/**
 * Worker dashboard — check-in / check-out with HTML5 Geolocation (proposal).
 * Flow: pick a project you are assigned to → request GPS → POST /api/worker/check-in.
 */
type DashTask = {
  id: string;
  title: string;
  status: string;
  deadline: string;
  projectName: string;
  description: string;
};

export default function WorkerDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name?.split(" ")[0] ?? "there";
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectId, setProjectId] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLabel, setGpsLabel] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [linked, setLinked] = useState<boolean | null>(null);
  const [pay, setPay] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [dashTasks, setDashTasks] = useState<DashTask[]>([]);
  const [notifications, setNotifications] = useState<
    { text: string; time: string }[]
  >([]);

  const loadDashboard = () => {
    fetch("/api/worker/dashboard", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setLinked(d.linked !== false);
        if (d.paymentSummary) setPay(d.paymentSummary);
        setDashTasks(d.tasks ?? []);
        setNotifications(d.notifications ?? []);
        if (d.lastCheckIn) {
          setCheckInTime(
            d.lastCheckIn.checkInTime
              ? String(d.lastCheckIn.checkInTime)
              : null
          );
          setCheckOutTime(
            d.lastCheckIn.checkOutTime
              ? String(d.lastCheckIn.checkOutTime)
              : null
          );
        } else {
          setCheckInTime(null);
          setCheckOutTime(null);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch("/api/worker/my-projects", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setProjects(d.projects ?? []);
        if (d.projects?.[0]?.id) setProjectId(d.projects[0].id);
      })
      .catch(() => {});
    loadDashboard();
  }, []);

  const captureGps = () => {
    setMsg(null);
    if (!navigator.geolocation) {
      setGpsLabel("GPS not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLabel(
          `Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`
        );
      },
      () => setGpsLabel("Could not read location — allow permission or enter site Wi‑Fi."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getPosition = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("no geolocation"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        reject,
        { enableHighAccuracy: true, timeout: 12000 }
      );
    });

  const postCheck = async (action: "checkin" | "checkout") => {
    setMsg(null);
    if (!projectId) {
      setMsg("Select a project (your employer must assign you to one).");
      return;
    }
    let lat = gps?.lat ?? 0;
    let lng = gps?.lng ?? 0;
    try {
      const p = await getPosition();
      lat = p.lat;
      lng = p.lng;
      setGps(p);
      setGpsLabel(`Lat ${p.lat.toFixed(4)}, Lng ${p.lng.toFixed(4)}`);
    } catch {
      setMsg("Location required — allow GPS or try again.");
      return;
    }
    const res = await fetch("/api/worker/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action, projectId, lat, lng }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Request failed");
      return;
    }
    if (action === "checkin") {
      setCheckInTime(data.checkInTime ?? new Date().toLocaleTimeString());
      setCheckOutTime(null);
    } else {
      setCheckOutTime(data.checkOutTime ?? new Date().toLocaleTimeString());
    }
    loadDashboard();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {displayName}! Here is your daily summary.
        </p>
        {linked === false && (
          <p className="mt-2 text-sm text-amber-800">
            Your account is not linked to a worker profile yet. Ask your employer
            to add you with this email so check-ins and payments sync.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Daily Attendance
            </h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Today
            </span>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="">Select project…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={captureGps}
            className="mb-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Capture GPS location
          </button>
          {gpsLabel && (
            <p className="mb-2 text-center text-xs text-emerald-700">{gpsLabel}</p>
          )}

          <p className="text-center text-4xl font-bold tabular-nums tracking-tight text-gray-900">
            {checkInTime ?? "—:—"}
          </p>
          <p className="mt-1 text-center text-xs text-gray-400">Last check-in time</p>

          <div className="mt-4 flex justify-center">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              {gps
                ? "GPS captured — ready to check in"
                : "Tap Capture GPS before check-in"}
            </span>
          </div>

          {checkOutTime && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Checked out at {checkOutTime}
            </p>
          )}

          {msg && (
            <p className="mt-3 text-center text-sm text-red-600">{msg}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => postCheck("checkin")}
              className="rounded-lg bg-[#3B82F6] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              Check In
            </button>
            <button
              type="button"
              onClick={() => postCheck("checkout")}
              className="rounded-lg border border-gray-200 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Check Out
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Payment Summary
            </h2>
            <Link
              href="/worker/payments"
              className="text-sm font-medium text-[#3B82F6] hover:text-blue-700"
            >
              View Details
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: "Total Earnings",
                value: `$${pay.total.toLocaleString()}`,
                accent: "bg-[#3B82F6]",
              },
              {
                label: "Paid",
                value: `$${pay.paid.toLocaleString()}`,
                accent: "bg-emerald-500",
              },
              {
                label: "Unpaid",
                value: `$${pay.unpaid.toLocaleString()}`,
                accent: "bg-orange-500",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="relative rounded-lg border border-gray-100 bg-gray-50/80 p-4"
              >
                <SquareIcon
                  className={`absolute right-3 top-3 ${row.accent}`}
                />
                <p className="text-xs font-medium text-gray-500">{row.label}</p>
                <p className="mt-2 text-lg font-bold tabular-nums text-gray-900">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              My Assigned Tasks
            </h2>
            <Link
              href="/worker/tasks"
              className="text-sm font-medium text-[#3B82F6] hover:text-blue-700"
            >
              View All Tasks
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {dashTasks.length === 0 ? (
              <li className="py-6 text-center text-sm text-gray-500">
                No tasks assigned yet.
              </li>
            ) : (
              dashTasks.slice(0, 6).map((t) => {
                const due = t.deadline
                  ? new Date(t.deadline).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—";
                const statusStyle =
                  t.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : t.status === "In Progress"
                      ? "bg-orange-500 text-white"
                      : "bg-amber-100 text-amber-900";
                return (
                  <li key={t.id} className="flex gap-4 py-4 first:pt-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{t.title}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {t.projectName} · Due: {due}
                      </p>
                    </div>
                    <span
                      className={`h-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                    >
                      {t.status}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-900">
            Notifications
          </h2>
          <ul className="space-y-5">
            {notifications.length === 0 ? (
              <li className="text-sm text-gray-500">No notifications yet.</li>
            ) : (
              notifications.map((n, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-sky-100"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm leading-snug text-gray-800">
                      {n.text}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{n.time}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
