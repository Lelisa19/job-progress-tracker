import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { WorkerModel } from "@/models/Worker";
import { PaymentModel } from "@/models/Payment";
import { TaskModel } from "@/models/Task";
import { AttendanceModel } from "@/models/Attendance";

export async function GET(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "worker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const worker = await WorkerModel.findOne({ userId: auth.sub });
    if (!worker) {
      return NextResponse.json({
        linked: false,
        paymentSummary: { total: 0, paid: 0, unpaid: 0 },
        tasks: [],
        notifications: [],
        lastCheckIn: null,
      });
    }

    const wid = worker._id;
    const payAgg = await PaymentModel.aggregate([
      { $match: { workerId: wid } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalWage" },
          paid: { $sum: "$paidAmount" },
          unpaid: { $sum: "$unpaidAmount" },
        },
      },
    ]);
    const p = payAgg[0] ?? { total: 0, paid: 0, unpaid: 0 };

    const tasks = await TaskModel.find({ workerId: wid })
      .populate("projectId", "title")
      .sort({ deadline: 1 })
      .limit(20)
      .lean();

    const taskRows = tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      status: t.status,
      deadline: t.deadline,
      projectName:
        (t.projectId as unknown as { title?: string })?.title ?? "Project",
      description: t.description ?? "",
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);
    const todayAtt = await AttendanceModel.findOne({
      workerId: wid,
      date: { $gte: today, $lte: endToday },
    })
      .sort({ createdAt: -1 })
      .lean();

    const notifications: { text: string; time: string }[] = [];
    const recentPay = await PaymentModel.find({ workerId: wid })
      .sort({ createdAt: -1 })
      .limit(3);
    for (const x of recentPay) {
      notifications.push({
        text: `Payment record: ${x.status} — $${x.paidAmount} paid of $${x.totalWage}.`,
        time: formatRel(x.createdAt),
      });
    }
    const assigned = await TaskModel.find({ workerId: wid, status: "Pending" })
      .sort({ createdAt: -1 })
      .limit(2);
    for (const x of assigned) {
      notifications.push({
        text: `New task assigned: ${x.title}.`,
        time: formatRel(x.createdAt),
      });
    }

    return NextResponse.json({
      linked: true,
      paymentSummary: { total: p.total, paid: p.paid, unpaid: p.unpaid },
      tasks: taskRows,
      notifications: notifications.slice(0, 5),
      lastCheckIn: todayAtt
        ? {
            checkInTime: todayAtt.checkInTime || null,
            checkOutTime: todayAtt.checkOutTime || null,
            status: todayAtt.status,
          }
        : null,
    });
  } catch (e) {
    console.error("[worker/dashboard]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

function formatRel(d?: Date) {
  if (!d) return "";
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (s < 120) return `${s} mins ago`;
  const h = Math.floor(s / 60);
  if (h < 48) return `${h} hour${h > 1 ? "s" : ""} ago`;
  return "Recently";
}
