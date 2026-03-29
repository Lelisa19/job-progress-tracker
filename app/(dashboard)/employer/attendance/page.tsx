// C:\Users\laloo\job-progress-tracker\app\(dashboard)\employer\attendance\page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import AttendanceTable from "./components/AttendanceTable";
import CalendarView from "./components/CalendarView";
import MapView from "./components/MapView";
import { Attendance } from "../../../../types/attendance";
import {
  QrCode,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Building2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import QRScanner from "@/components/QRScanner";

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border-b border-gray-200 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`font-semibold text-gray-900 ${className}`}>{children}</h3>
);

type ApiRec = {
  id: string;
  workerId: string;
  projectId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  location?: { lat: number; lng: number };
  status: Attendance["status"];
  workerName?: string;
  projectName?: string;
};

function mapRecord(r: ApiRec): Attendance {
  return {
    id: r.id,
    workerId: r.workerId,
    projectId: r.projectId,
    workerName: r.workerName,
    projectName: r.projectName,
    date: new Date(r.date),
    checkInTime: r.checkInTime?.trim() ? r.checkInTime : "--",
    checkOutTime: r.checkOutTime?.trim() ? r.checkOutTime : "--",
    location: r.location ?? { lat: 0, lng: 0 },
    status: r.status,
  };
}

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    fetch("/api/attendance", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (c) return;
        if (d.error) throw new Error(d.error);
        const rows = (d.records ?? []) as ApiRec[];
        setAttendanceData(rows.map(mapRecord));
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

  const summaryData = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const todayRecords = attendanceData.filter((r) => {
      const d = new Date(r.date);
      return d >= start && d <= end;
    });
    const present = todayRecords.filter((r) => r.status === "Present").length;
    const late = todayRecords.filter((r) => r.status === "Late").length;
    const absent = todayRecords.filter((r) => r.status === "Absent").length;
    const onLeave = 0;
    const activeCheckIns = todayRecords.filter((r) => {
      const hasIn = !!r.checkInTime && r.checkInTime !== "--";
      const noOut =
        !r.checkOutTime || r.checkOutTime === "--";
      return hasIn && noOut;
    }).length;
    const projectName =
      todayRecords[0]?.projectName ??
      attendanceData[0]?.projectName ??
      "All projects";
    return {
      present,
      late,
      absent,
      onLeave,
      activeCheckIns,
      projectName,
    };
  }, [attendanceData]);

  const projectLocation = useMemo(() => {
    const withLoc = attendanceData.find(
      (r) =>
        r.location &&
        (r.location.lat !== 0 || r.location.lng !== 0)
    );
    return {
      lat: withLoc?.location.lat ?? 40.7128,
      lng: withLoc?.location.lng ?? -74.006,
      name: withLoc?.projectName ?? "Site",
    };
  }, [attendanceData]);

  const handleQRDisplay = () => {
    setIsScannerOpen(true);
  };

  const todayLabel = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Tracking
          </h1>
          <p className="text-gray-500 mt-1">
            Manage daily check-ins, locations, and worker logs
          </p>
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Today&apos;s Attendance
            </h2>
            <p className="text-sm text-gray-500">
              Monitor check-in statuses and GPS locations for {todayLabel}.
            </p>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              {loading ? (
                <p className="p-8 text-center text-gray-500">Loading…</p>
              ) : (
                <AttendanceTable records={attendanceData} />
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Worker Check-in QR Code
                  </h3>
                </div>
                <p className="text-blue-100">
                  Display this QR code for workers to scan and check in with
                  their mobile devices.
                </p>
                {scanResult && (
                  <div className="bg-green-500 text-white text-sm p-2 rounded-lg mt-2">
                    {scanResult}
                  </div>
                )}
              </div>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                onClick={handleQRDisplay}
              >
                <QrCode className="mr-2 h-5 w-5" />
                Show QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarView records={attendanceData} />
          <MapView records={attendanceData} projectLocation={projectLocation} />
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5" />
              Today&apos;s Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <span className="text-2xl font-bold text-green-700">
                    {summaryData.present}
                  </span>
                </div>
                <p className="text-green-600 font-medium mt-2">Present</p>
                <p className="text-xs text-green-500 mt-1">On time check-ins</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-center justify-between">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-700">
                    {summaryData.late}
                  </span>
                </div>
                <p className="text-yellow-600 font-medium mt-2">Late</p>
                <p className="text-xs text-yellow-500 mt-1">Late arrivals</p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="flex items-center justify-between">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <span className="text-2xl font-bold text-red-700">
                    {summaryData.absent}
                  </span>
                </div>
                <p className="text-red-600 font-medium mt-2">Absent</p>
                <p className="text-xs text-red-500 mt-1">No show today</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <AlertCircle className="h-8 w-8 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-700">
                    {summaryData.onLeave}
                  </span>
                </div>
                <p className="text-blue-600 font-medium mt-2">On Leave</p>
                <p className="text-xs text-blue-500 mt-1">
                  (not tracked in DB)
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-600">
                    Active on site: {summaryData.activeCheckIns} workers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {summaryData.projectName}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        projectId="PROJECT-ALPHA-001"
        projectName="PROJECT ALPHA"
      />
    </div>
  );
}
