// app/(dashboard)/employer/payments/components/PaymentTrends.tsx
"use client";

export type TrendPoint = {
  month: string;
  paid: number;
  unpaid: number;
};

export function PaymentTrends({ data }: { data: TrendPoint[] }) {
  const maxAmount = Math.max(
    1,
    ...data.map((d) => d.paid + d.unpaid)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Payment trends (by month, from your records)
      </h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No payment history yet.</p>
      ) : (
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-around gap-1">
            {data.map((month) => {
              const total = month.paid + month.unpaid;
              const totalHeight = (total / maxAmount) * 100;
              const paidRatio = total > 0 ? month.paid / total : 0;
              const paidHeight = totalHeight * paidRatio;
              const unpaidHeight = totalHeight - paidHeight;

              return (
                <div
                  key={month.month + String(month.paid)}
                  className="flex flex-col items-center w-12"
                >
                  <div className="relative w-full h-48 flex flex-col-reverse">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all duration-300"
                      style={{ height: `${paidHeight}%`, minHeight: total ? "4px" : 0 }}
                    />
                    <div
                      className="w-full bg-gray-300 rounded-t transition-all duration-300"
                      style={{
                        height: `${unpaidHeight}%`,
                        minHeight: total && month.unpaid ? "4px" : 0,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">
                    {month.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-600">Paid</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="text-xs text-gray-600">Unpaid</span>
        </div>
      </div>
    </div>
  );
}
