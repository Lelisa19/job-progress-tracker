/** Matches `GET /api/notifications` items (derived from MongoDB). */
export type NavNotification = {
  id: string;
  type: "task" | "attendance" | "payment" | "project" | "worker" | "job";
  title: string;
  message: string;
  time: string;
  actionUrl?: string;
  priority?: "high" | "medium" | "low";
};
