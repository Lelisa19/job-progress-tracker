"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center justify-between hover:shadow-lg transition">
      
      {/* Left Content */}
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>

      {/* Icon */}
      {icon && (
        <div className="text-blue-500 text-3xl">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;