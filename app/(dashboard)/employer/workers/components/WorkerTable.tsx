import { Worker } from "../../../types/worker";

interface WorkerTableProps {
  workers: Worker[];
}

export default function WorkerTable({ workers }: WorkerTableProps) {
  return (
    <table className="w-full bg-white rounded-xl shadow overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-left">Skill</th>
          <th className="p-3 text-left">Daily Wage</th>
          <th className="p-3 text-left">Reputation</th>
        </tr>
      </thead>
      <tbody>
        {workers.map((w) => (
          <tr key={w.id} className="border-b last:border-0 hover:bg-gray-50">
            <td className="p-3">{w.name}</td>
            <td className="p-3">{w.phone}</td>
            <td className="p-3">{w.skill}</td>
            <td className="p-3">{w.dailyWage}</td>
            <td className="p-3">{w.reputation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}