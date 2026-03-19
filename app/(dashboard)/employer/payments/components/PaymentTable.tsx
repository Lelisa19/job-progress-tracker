import { Payment } from "../../../types/payment";

interface PaymentTableProps {
  payments: Payment[];
}

export default function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <table className="w-full bg-white rounded-xl shadow overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Worker ID</th>
          <th className="p-3">Amount</th>
          <th className="p-3">Status</th>
          <th className="p-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
            <td className="p-3">{p.workerId}</td>
            <td className="p-3">{p.amount}</td>
            <td className="p-3">{p.status}</td>
            <td className="p-3">{p.date.toDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}