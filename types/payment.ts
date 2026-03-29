// types/payment.ts
export interface Payment {
  id: string;
  workerId: string;
  workerName: string;
  totalWage: number;
  paidAmount: number;
  unpaidAmount: number;
  status: "Paid" | "Partial" | "Unpaid";
  paymentDate: string;
  createdAt?: string;
}