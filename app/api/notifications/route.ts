import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { AttendanceModel } from "@/models/Attendance";
import { TaskModel } from "@/models/Task";
import { PaymentModel } from "@/models/Payment";
import { WorkerModel } from "@/models/Worker";
import type { NavNotification } from "@/types/notification";

function formatRel(d?: Date) {
  if (!d) return "";
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (s < 60) return `${s} mins ago`;
  const h = Math.floor(s / 60);
  if (h < 48) return `${h} hour${h > 1 ? "s" : ""} ago`;
  return `${Math.floor(h / 24)} days ago`;
}

type Raw = NavNotification & { at: number };

/** Navbar + notification panel — derived from MongoDB (same sources as dashboards). */
export async function GET(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const raw: Raw[] = [];

    if (auth.role === "employer") {
      const eid = new mongoose.Types.ObjectId(auth.sub);

      const lateAtt = await AttendanceModel.find({
        employerId: eid,
        status: { $in: ["Late", "Absent"] },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("workerId", "name")
        .lean();
      for (const a of lateAtt) {
        const w =
          (a.workerId as unknown as { name?: string })?.name ?? "Worker";
        const created = new Date(
          (a as { createdAt?: Date }).createdAt ?? Date.now()
        ).getTime();
        raw.push({
          id: `att-${String(a._id)}`,
          type: "attendance",
          title: "Attendance alert",
          message: `${w} — ${a.status} check-in.`,
          time: formatRel(a.createdAt),
          actionUrl: "/employer/attendance",
          priority: a.status === "Absent" ? "high" : "medium",
          at: created,
        });
      }

      const doneTasks = await TaskModel.find({
        employerId: eid,
        status: "Completed",
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("title updatedAt")
        .lean();
      for (const t of doneTasks) {
        const u = new Date(
          (t as { updatedAt?: Date }).updatedAt ?? Date.now()
        ).getTime();
        raw.push({
          id: `task-${String(t._id)}`,
          type: "task",
          title: "Task completed",
          message: `"${t.title}" marked completed.`,
          time: formatRel((t as { updatedAt?: Date }).updatedAt),
          actionUrl: "/employer/tasks",
          priority: "medium",
          at: u,
        });
      }

      const recentPay = await PaymentModel.find({ employerId: eid })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("workerId", "name")
        .lean();
      for (const p of recentPay) {
        const w =
          (p.workerId as unknown as { name?: string })?.name ?? "Worker";
        const u = new Date(
          (p as { updatedAt?: Date }).updatedAt ?? Date.now()
        ).getTime();
        raw.push({
          id: `pay-${String(p._id)}`,
          type: "payment",
          title: "Payment update",
          message: `Payment for ${w} (${p.status}).`,
          time: formatRel((p as { updatedAt?: Date }).updatedAt),
          actionUrl: "/employer/payments",
          priority: "medium",
          at: u,
        });
      }
    } else {
      const worker = await WorkerModel.findOne({ userId: auth.sub }).lean();
      if (worker) {
        const wid = worker._id;
        const recentPay = await PaymentModel.find({ workerId: wid })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();
        for (const x of recentPay) {
          const c = new Date(
            (x as { createdAt?: Date }).createdAt ?? Date.now()
          ).getTime();
          raw.push({
            id: `pay-${String(x._id)}`,
            type: "payment",
            title: "Payment record",
            message: `${x.status} — $${x.paidAmount} paid of $${x.totalWage} total.`,
            time: formatRel((x as { createdAt?: Date }).createdAt),
            actionUrl: "/worker/payments",
            priority: "medium",
            at: c,
          });
        }
        const assigned = await TaskModel.find({
          workerId: wid,
          status: "Pending",
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();
        for (const x of assigned) {
          const c = new Date(
            (x as { createdAt?: Date }).createdAt ?? Date.now()
          ).getTime();
          raw.push({
            id: `task-${String(x._id)}`,
            type: "task",
            title: "New task assigned",
            message: x.title,
            time: formatRel((x as { createdAt?: Date }).createdAt),
            actionUrl: "/worker/tasks",
            priority: "high",
            at: c,
          });
        }
      }
    }

    raw.sort((a, b) => b.at - a.at);
    const notifications: NavNotification[] = raw.slice(0, 20).map(
      ({ at: _a, ...rest }) => rest
    );

    return NextResponse.json({
      notifications,
      unreadCount: notifications.length,
    });
  } catch (e) {
    console.error("[notifications GET]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
