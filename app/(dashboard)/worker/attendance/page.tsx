"use client";

import { useEffect, useState, useCallback } from "react";
import AttendanceTable from "../../employer/attendance/components/AttendanceTable";
import { Attendance } from "../../../../types/attendance";
import WorkerCheckInUI from "../../../../components/worker/WorkerCheckInUI";

type ApiRec = {
  id: string;
  workerId: string;
  projectId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  location?: { lat: number; lng: number; address?: string };
  status: Attendance["status"];
  projectTitle?: string;
};

function mapRecord(r: ApiRec): Attendance {
  return {
    id: r.id,
    workerId: r.workerId,
    projectId: r.projectId,
    projectName: r.projectTitle ?? "",
    date: new Date(r.date),
    checkInTime: r.checkInTime?.trim() ? r.checkInTime : "--",
    checkOutTime: r.checkOutTime?.trim() ? r.checkOutTime : "--",
    location: r.location ?? { lat: 0, lng: 0 },
    status: r.status,
  };
}

export default function WorkerAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetchRecords = useCallback(() => {
    fetch("/api/attendance", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setRecords((d.records ?? []).map((x: ApiRec) => mapRecord(x)));
        setErr(null);
      })
      .catch((e: Error) => {
        setErr(e.message || "Failed to load");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Attendance</h1>
      
      <WorkerCheckInUI onSuccess={fetchRecords} />

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Attendance History</h2>
        {err && <p className="mb-2 text-sm text-red-600">{err}</p>}
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <AttendanceTable records={records} />
        )}
      </div>
    </div>
  );
}
