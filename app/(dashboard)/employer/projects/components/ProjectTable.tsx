import { Project } from "../../../../../types/project";

interface ProjectTableProps {
  projects: Project[];
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <table className="w-full bg-white rounded-xl shadow overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3 text-left">Location</th>
          <th className="p-3 text-left">Start Date</th>
          <th className="p-3 text-left">Progress %</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
            <td className="p-3">{p.title}</td>
            <td className="p-3">{p.location}</td>
            <td className="p-3">{p.startDate.toDateString()}</td>
            <td className="p-3">{p.progress}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}