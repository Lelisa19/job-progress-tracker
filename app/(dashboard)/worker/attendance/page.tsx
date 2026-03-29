"use client";

import { useEffect, useState } from "react";
import AttendanceTable from "../../employer/attendance/components/AttendanceTable";
import { Attendance } from "../../../../types/attendance";

type ApiRec = {
  id: string;
  workerId: string;
  projectId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  location?: { lat: number; lng: number };
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

  useEffect(() => {
    let c = false;
    fetch("/api/attendance", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        if (!c) setRecords((d.records ?? []).map((x: ApiRec) => mapRecord(x)));
      })
      .catch((e: Error) => {
        if (!c) setErr(e.message || "Failed to load");
      })
      .finally(() => {
        if (!c) setLoading(false);
      });
    return () => {
      c = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>
      {err && <p className="mb-2 text-sm text-red-600">{err}</p>}
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <AttendanceTable records={records} />
      )}
    </div>
  );
}
