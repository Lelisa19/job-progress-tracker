export interface Payment {
  id: string;
  workerId: string;
  amount: number;
  status: "Paid" | "Unpaid";
  date: Date;
}