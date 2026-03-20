// app/(dashboard)/employer/payments/components/PaymentTrends.tsx
"use client";

import { useState } from "react";

const data = [
    { day: "Mon", amount: 1250 },
    { day: "Tue", amount: 1800 },
    { day: "Wed", amount: 950 },
    { day: "Thu", amount: 2100 },
    { day: "Fri", amount: 1450 },
    { day: "Sat", amount: 800 },
    { day: "Sun", amount: 600 },
];

const maxAmount = Math.max(...data.map(d => d.amount));

export function PaymentTrends() {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Payment Trends (Last 7 Days)
            </h2>
            <div className="h-72">
                <div className="h-full flex items-end justify-between gap-2">
                    {data.map((item, index) => {
                        const heightPercentage = (item.amount / maxAmount) * 100;
                        const isHovered = hoveredBar === index;

                        return (
                            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                <div className="relative w-full flex justify-center">
                                    <div
                                        className="w-full max-w-[60px] bg-blue-500 rounded-t-lg transition-all duration-200 hover:bg-blue-600 cursor-pointer"
                                        style={{
                                            height: `${heightPercentage}%`,
                                            minHeight: "4px",
                                            maxHeight: "calc(100% - 40px)"
                                        }}
                                        onMouseEnter={() => setHoveredBar(index)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    />
                                    {isHovered && (
                                        <div className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                            ${item.amount.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-gray-600 mt-2">{item.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}