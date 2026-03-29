"use client";

import { useEffect, useState } from "react";
import { PaymentTable } from "../../employer/payments/components/PaymentTable";
import { Payment } from "../../../../types/payment";

export default function WorkerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    fetch("/api/worker/payments", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        if (!c) setPayments(d.payments ?? []);
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Payments</h1>
      {err && <p className="mb-2 text-sm text-red-600">{err}</p>}
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <PaymentTable payments={payments} showMarkPaid={false} />
      )}
    </div>
  );
}
