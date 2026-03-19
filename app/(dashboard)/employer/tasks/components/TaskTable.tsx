import { Task } from "../../../types/task";

interface TaskTableProps {
  tasks: Task[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
  return (
    <table className="w-full bg-white rounded-xl shadow overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3 text-left">Description</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Deadline</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
            <td className="p-3">{t.title}</td>
            <td className="p-3">{t.description}</td>
            <td className="p-3">{t.status}</td>
            <td className="p-3">{t.deadline.toDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}