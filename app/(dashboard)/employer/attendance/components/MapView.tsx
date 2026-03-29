// C:\Users\laloo\job-progress-tracker\app\(dashboard)\employer\attendance\components\MapView.tsx
"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Users, Building2, Clock } from "lucide-react";
import { Attendance } from "../../../../../types/attendance";

interface MapViewProps {
    records: Attendance[];
    projectLocation?: { lat: number; lng: number; name: string };
}

interface WorkerLocation {
    id: string;
    workerId: string;
    workerName: string;
    lat: number;
    lng: number;
    checkInTime: string;
    status: string;
}

export default function MapView({ records, projectLocation }: MapViewProps) {
    const [activeCheckIns, setActiveCheckIns] = useState<WorkerLocation[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<WorkerLocation | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Filter active check-ins (checked in but not checked out)
    useEffect(() => {
        const active = records
            .filter((record) => {
                const hasIn =
                    !!record.checkInTime &&
                    record.checkInTime !== "--";
                const noOut =
                    !record.checkOutTime ||
                    record.checkOutTime === "--";
                return hasIn && noOut;
            })
            .map((record) => ({
                id: record.id,
                workerId: record.workerId,
                workerName:
                    (record as { workerName?: string }).workerName ??
                    `Worker ${record.workerId}`,
                lat: record.location.lat,
                lng: record.location.lng,
                checkInTime: record.checkInTime,
                status: record.status,
            }));
        setActiveCheckIns(active);
    }, [records]);

    // In a real implementation, you'd integrate a mapping library like Leaflet or Google Maps
    // This is a simplified representation
    const renderMapPlaceholder = () => {
        return (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: "400px" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Interactive Map View</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {activeCheckIns.length} active worker{activeCheckIns.length !== 1 ? "s" : ""} on site
                        </p>
                        <button
                            onClick={() => setMapLoaded(true)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                        >
                            Load Map
                        </button>
                    </div>
                </div>

                {/* Simplified map representation */}
                {mapLoaded && (
                    <div className="absolute inset-0 bg-gray-200 p-4">
                        <div className="relative h-full">
                            {/* Project location marker */}
                            {projectLocation && (
                                <div
                                    className="absolute bg-blue-500 text-white px-3 py-1 rounded-full text-sm shadow-lg"
                                    style={{ left: "30%", top: "40%" }}
                                >
                                    <Building2 className="h-4 w-4 inline mr-1" />
                                    {projectLocation.name}
                                </div>
                            )}

                            {/* Worker markers */}
                            {activeCheckIns.map((worker, index) => (
                                <div
                                    key={worker.id}
                                    className="absolute cursor-pointer group"
                                    style={{
                                        left: `${20 + (index * 15)}%`,
                                        top: `${30 + (index * 10)}%`
                                    }}
                                    onClick={() => setSelectedWorker(worker)}
                                >
                                    <div className="relative">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                            <MapPin className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap">
                                            <div className="bg-gray-900 text-white text-xs rounded px-2 py-1">
                                                {worker.workerName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Navigation className="h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-semibold text-gray-800">GPS Check-in Locations</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{activeCheckIns.length}</span>
                        <span className="text-gray-500">Active Check-ins</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {renderMapPlaceholder()}

                {/* Active Workers List */}
                <div className="mt-6">
                    <h3 className="font-medium text-gray-800 mb-3">Active Workers on Site</h3>
                    <div className="space-y-2">
                        {activeCheckIns.length > 0 ? (
                            activeCheckIns.map((worker) => (
                                <div
                                    key={worker.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setSelectedWorker(worker)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">{worker.workerName}</p>
                                            <p className="text-xs text-gray-500">ID: {worker.workerId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        <span className="text-gray-600">{worker.checkInTime}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${worker.status === "Late"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                            }`}>
                                            {worker.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No active check-ins at this time</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Worker Modal (simplified) */}
                {selectedWorker && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Worker Location Details</h3>
                            <div className="space-y-2">
                                <p><strong>Worker:</strong> {selectedWorker.workerName}</p>
                                <p><strong>ID:</strong> {selectedWorker.workerId}</p>
                                <p><strong>Check-in:</strong> {selectedWorker.checkInTime}</p>
                                <p><strong>Status:</strong> {selectedWorker.status}</p>
                                <p><strong>Coordinates:</strong> {selectedWorker.lat}, {selectedWorker.lng}</p>
                            </div>
                            <button
                                onClick={() => setSelectedWorker(null)}
                                className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}