export interface User {
  id: string; // Maps to MongoDB _id
  email: string;
  name: string;
  role: "employer" | "worker"; // Matching enum from model
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string; // Managed by mongoose timestamps
  updatedAt: string; // Managed by mongoose timestamps
}
