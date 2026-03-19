import { useState } from "react";
import { Worker } from "../../../types/worker";

export default function WorkerProfilePage() {
  const [worker, setWorker] = useState<Worker>({
    id: "1",
    name: "John Doe",
    phone: "0912345678",
    skill: "Construction",
    dailyWage: 200,
    reputation: 4.5,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Name:</strong> {worker.name}</p>
        <p><strong>Phone:</strong> {worker.phone}</p>
        <p><strong>Skill:</strong> {worker.skill}</p>
        <p><strong>Daily Wage:</strong> ${worker.dailyWage}</p>
        <p><strong>Reputation:</strong> {worker.reputation} ⭐</p>
      </div>
    </div>
  );
}