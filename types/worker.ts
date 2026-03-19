export interface Worker {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role?: string;
  status?: string;
  skill: string;
  dailyWage: number;
  reputation: number;
}