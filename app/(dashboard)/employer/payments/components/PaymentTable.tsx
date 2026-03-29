// app/(dashboard)/employer/payments/components/PaymentTable.tsx
"use client";

import { Payment } from "@/types/payment";
import { useEffect, useState } from "react";

interface PaymentTableProps {
  payments: Payment[];
  showMarkPaid?: boolean;
}

export function PaymentTable({
  payments,
  showMarkPaid = true,
}: PaymentTableProps) {
  const [paymentList, setPaymentList] = useState<Payment[]>(payments);
  const [searchTerm, setSearchTerm] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setPaymentList(payments);
  }, [payments]);

  const handleMarkPaid = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markPaid" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Could not update payment");
        return;
      }
      const p = data.payment as {
        paidAmount: number;
        unpaidAmount: number;
        status: Payment["status"];
        paymentDate: string;
      };
      setPaymentList((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? {
                ...payment,
                status: p.status,
                paidAmount: p.paidAmount,
                unpaidAmount: p.unpaidAmount,
                paymentDate: p.paymentDate,
              }
            : payment
        )
      );
    } finally {
      setBusyId(null);
    }
  };

  const filteredPayments = paymentList.filter((payment) =>
    payment.workerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      case "Unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200 md:hidden">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search workers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Worker Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Wage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unpaid Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Date
              </th>
              {showMarkPaid && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.workerName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${payment.totalWage.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${payment.paidAmount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${payment.unpaidAmount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentDate}
                </td>
                {showMarkPaid && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      type="button"
                      onClick={() => handleMarkPaid(payment.id)}
                      disabled={
                        payment.status === "Paid" || busyId === payment.id
                      }
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        payment.status === "Paid"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }`}
                    >
                      {busyId === payment.id ? "…" : "Mark Paid"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No workers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
