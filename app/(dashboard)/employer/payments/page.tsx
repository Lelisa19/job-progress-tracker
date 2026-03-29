"use client";

import { useEffect, useMemo, useState } from "react";
import { PaymentTable } from "./components/PaymentTable";
import { PaymentTrends, type TrendPoint } from "./components/PaymentTrends";
import { PaymentStats } from "./components/PaymentStats";
import { PaymentSearch } from "./components/PaymentSearch";
import { Payment } from "@/types/payment";

function monthlyFromPayments(payments: Payment[]): TrendPoint[] {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const map = new Map<string, { paid: number; unpaid: number }>();
  for (const p of payments) {
    const d = p.createdAt ? new Date(p.createdAt) : null;
    if (!d || Number.isNaN(d.getTime())) continue;
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map.has(k)) map.set(k, { paid: 0, unpaid: 0 });
    const row = map.get(k)!;
    row.paid += p.paidAmount;
    row.unpaid += p.unpaidAmount;
  }
  const keys = [...map.keys()].sort();
  return keys.map((k) => {
    const m = parseInt(k.split("-")[1], 10);
    const v = map.get(k)!;
    return { month: monthNames[m - 1], paid: v.paid, unpaid: v.unpaid };
  });
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    fetch("/api/payments", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (c) return;
        if (d.error) throw new Error(d.error);
        setPayments(d.payments ?? []);
      })
      .catch((e: Error) => {
        if (!c) setErr(e.message || "Failed to load");
      })
      .finally(() => {
        if (!c) setLoading(false);
      });
    return () => {
      c = true;
    };
  }, []);

  const totalPaymentsDue = payments.reduce((sum, p) => sum + p.totalWage, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalUnpaid = payments.reduce((sum, p) => sum + p.unpaidAmount, 0);

  const trendData = useMemo(() => monthlyFromPayments(payments), [payments]);

  const exportCsv = () => {
    const header = [
      "Worker",
      "Total Wage",
      "Paid",
      "Unpaid",
      "Status",
      "Payment Date",
    ];
    const rows = payments.map((p) => [
      p.workerName,
      p.totalWage,
      p.paidAmount,
      p.unpaidAmount,
      p.status,
      p.paymentDate,
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="mt-1 text-gray-600">
              Manage worker payments, view trends, and track unpaid wages.
            </p>
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Export report (CSV)
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading payments…</p>
        ) : (
          <>
            <PaymentStats
              totalDue={totalPaymentsDue}
              totalPaid={totalPaid}
              totalUnpaid={totalUnpaid}
            />

            <div className="mt-8">
              <PaymentTrends data={trendData} />
            </div>

            <div className="mt-8">
              <PaymentSearch />
            </div>

            <div className="mt-6">
              <PaymentTable payments={payments} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
