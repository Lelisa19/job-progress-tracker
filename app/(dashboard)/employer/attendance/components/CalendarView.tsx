// C:\Users\laloo\job-progress-tracker\app\(dashboard)\employer\attendance\components\CalendarView.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Attendance } from "../../../../../types/attendance";

interface CalendarViewProps {
    records: Attendance[];
    onDateSelect?: (date: Date) => void;
}

export default function CalendarView({ records, onDateSelect }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getAttendanceStatusForDate = (date: Date) => {
        const dateStr = date.toDateString();
        const dayRecords = records.filter(
            (record) => new Date(record.date).toDateString() === dateStr
        );

        if (dayRecords.length === 0) return null;

        const allPresent = dayRecords.every((r) => r.status === "Present");
        const hasLate = dayRecords.some((r) => r.status === "Late");
        const hasAbsent = dayRecords.some((r) => r.status === "Absent");

        if (allPresent) return "present";
        if (hasAbsent) return "absent";
        if (hasLate) return "late";
        return "mixed";
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        onDateSelect?.(date);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2 text-center text-gray-300"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === date.toDateString();
            const status = getAttendanceStatusForDate(date);

            const statusColors = {
                present: "bg-green-100 text-green-700",
                absent: "bg-red-100 text-red-700",
                late: "bg-yellow-100 text-yellow-700",
                mixed: "bg-purple-100 text-purple-700",
            };

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`
            p-2 text-center rounded-lg cursor-pointer transition-all
            ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
            ${isToday ? "font-bold" : ""}
            ${status ? statusColors[status as keyof typeof statusColors] : "hover:bg-gray-100"}
          `}
                >
                    <span className="text-sm">{day}</span>
                    {status && (
                        <div className="text-xs mt-1">
                            {status === "present" && "✓"}
                            {status === "absent" && "✗"}
                            {status === "late" && "⚠"}
                            {status === "mixed" && "•"}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h3 className="text-lg font-semibold">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">{days}</div>

                <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-100 rounded"></div>
                            <span>All Present</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                            <span>Late</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-100 rounded"></div>
                            <span>Absent</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-purple-100 rounded"></div>
                            <span>Mixed</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">Calendar View</h2>
            </div>
            {renderCalendar()}
        </div>
    );
}