// types/payment.ts
export interface Payment {
  id: string;
  workerId: string;
  workerName: string;      // Add this
  totalWage: number;       // Add this
  paidAmount: number;      // Add this
  unpaidAmount: number;    // Add this
  status: "Paid" | "Partial" | "Unpaid";
  paymentDate: string;     // Add this
}