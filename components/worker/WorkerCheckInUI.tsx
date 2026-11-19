"use client";

import React, { useState, useEffect } from "react";
import { QrCode, LogIn, LogOut, Loader2 } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function WorkerCheckInUI({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/worker/my-projects", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.projects) {
          setProjects(d.projects);
          if (d.projects.length > 0) setSelectedProjectId(d.projects[0].id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(
        (decodedText) => {
          scanner?.clear();
          setIsScanning(false);
          try {
            const data = JSON.parse(decodedText);
            if (data.projectId) {
              handleCheckInOut(data.projectId, "checkin");
            } else {
              setMessage({ type: "error", text: "Invalid QR code" });
            }
          } catch (e) {
            setMessage({ type: "error", text: "Failed to parse QR code" });
          }
        },
        (error) => {
          // Ignore scanning errors as they happen constantly until a code is found
        }
      );
    }
    return () => {
      scanner?.clear().catch(console.error);
    };
  }, [isScanning]);

  const handleCheckInOut = async (projectId: string, action: "checkin" | "checkout") => {
    setLoading(true);
    setMessage(null);
    try {
      // Require location
      let lat = 0, lng = 0;
      let address = "";
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { 
            enableHighAccuracy: true,
            timeout: 10000 
          });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        
      } catch (err) {
        setLoading(false);
        setMessage({ 
          type: "error", 
          text: "Location is required to check in. Please enable GPS/Location services on your device and allow the browser to access it." 
        });
        return;
      }

      const res = await fetch("/api/worker/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, projectId, lat, lng, address }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: "success", text: `Successfully ${action === 'checkin' ? 'checked in' : 'checked out'}!` });
        onSuccess();
      } else {
        setMessage({ type: "error", text: data.error || "Action failed" });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Record Attendance</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Scan Section */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-6 border border-gray-200 border-dashed">
          {isScanning ? (
            <div className="w-full">
              <div id="reader" className="overflow-hidden rounded-lg"></div>
              <button
                onClick={() => setIsScanning(false)}
                className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel Scanning
              </button>
            </div>
          ) : (
            <>
              <QrCode className="mb-3 h-12 w-12 text-blue-500" />
              <p className="mb-4 text-center text-sm text-gray-500">
                Scan your employer's QR code to instantly check in.
              </p>
              <button
                onClick={() => setIsScanning(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <QrCode className="h-4 w-4" />
                Scan QR Code
              </button>
            </>
          )}
        </div>

        {/* Manual Section */}
        <div className="flex flex-col justify-center">
          <h3 className="mb-3 font-semibold text-gray-900">Manual Entry</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                Select Project
              </label>
              <select
                id="project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {projects.length === 0 && <option value="">No projects assigned</option>}
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleCheckInOut(selectedProjectId, "checkin")}
                disabled={!selectedProjectId || loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Check In
              </button>
              <button
                onClick={() => handleCheckInOut(selectedProjectId, "checkout")}
                disabled={!selectedProjectId || loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
