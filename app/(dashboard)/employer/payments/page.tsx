// app/payments/page.tsx
import { PaymentTable } from "./components/PaymentTable";
import { PaymentTrends } from "./components/PaymentTrends";
import { PaymentStats } from "./components/PaymentStats";
import { PaymentSearch } from "./components/PaymentSearch";
import { Payment } from "@/types/payment";

// Mock data matching the image
const payments: Payment[] = [
  {
    id: "1",
    workerId: "1",
    workerName: "Carlos Ruiz",
    totalWage: 1200,
    paidAmount: 800,
    unpaidAmount: 400,
    status: "Partial",
    paymentDate: "Oct 15, 2023",
  },
  {
    id: "2",
    workerId: "2",
    workerName: "Mike Dawson",
    totalWage: 950,
    paidAmount: 950,
    unpaidAmount: 0,
    status: "Paid",
    paymentDate: "Oct 14, 2023",
  },
  {
    id: "3",
    workerId: "3",
    workerName: "Elena Smith",
    totalWage: 1400,
    paidAmount: 0,
    unpaidAmount: 1400,
    status: "Unpaid",
    paymentDate: "Pending",
  },
  {
    id: "4",
    workerId: "4",
    workerName: "Juan Mendez",
    totalWage: 800,
    paidAmount: 400,
    unpaidAmount: 400,
    status: "Partial",
    paymentDate: "Oct 12, 2023",
  },
];

export default function PaymentsPage() {
  // Calculate totals
  const totalPaymentsDue = payments.reduce((sum, p) => sum + p.totalWage, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalUnpaid = payments.reduce((sum, p) => sum + p.unpaidAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">
            Manage worker payments, view trends, and track unpaid wages.
          </p>
        </div>

        {/* Stats Cards */}
        <PaymentStats
          totalDue={totalPaymentsDue}
          totalPaid={totalPaid}
          totalUnpaid={totalUnpaid}
        />

        {/* Payment Trends Chart */}
        <div className="mt-8">
          <PaymentTrends />
        </div>

        {/* Search Bar */}
        <div className="mt-8">
          <PaymentSearch />
        </div>

        {/* Payments Table */}
        <div className="mt-6">
          <PaymentTable payments={payments} />
        </div>
      </div>
    </div>
  );
}