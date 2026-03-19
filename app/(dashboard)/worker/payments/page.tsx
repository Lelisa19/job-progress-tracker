import PaymentTable from "../../employer/payments/components/PaymentTable";
import { Payment } from "../../../types/payment";

const payments: Payment[] = [
  { id: "1", workerId: "1", amount: 2000, status: "Paid", date: new Date() },
  { id: "2", workerId: "1", amount: 1500, status: "Unpaid", date: new Date() },
];

export default function WorkerPaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Payments</h1>
      <PaymentTable payments={payments} />
    </div>
  );
}