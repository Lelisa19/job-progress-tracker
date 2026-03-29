import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { WorkerModel } from "@/models/Worker";
import { ProjectModel } from "@/models/Project";
import { TaskModel } from "@/models/Task";
import { PaymentModel } from "@/models/Payment";
import { AttendanceModel } from "@/models/Attendance";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function GET(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const eid = new mongoose.Types.ObjectId(auth.sub);

    const totalWorkers = await WorkerModel.countDocuments({ employerId: eid });
    const activeProjects = await ProjectModel.countDocuments({ employerId: eid });

    const startDay = new Date();
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date();
    endDay.setHours(23, 59, 59, 999);
    const tasksToday = await TaskModel.countDocuments({
      employerId: eid,
      deadline: { $gte: startDay, $lte: endDay },
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const tasksCompletedWeek = await TaskModel.countDocuments({
      employerId: eid,
      status: "Completed",
      updatedAt: { $gte: weekAgo },
    });

    const payAgg = await PaymentModel.aggregate([
      { $match: { employerId: eid } },
      { $group: { _id: null, pending: { $sum: "$unpaidAmount" } } },
    ]);
    const pendingPaymentsCents = Math.round(payAgg[0]?.pending ?? 0);

    const attendanceChart: { day: string; present: number; absent: number }[] =
      [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dEnd = new Date(d);
      dEnd.setHours(23, 59, 59, 999);
      const present = await AttendanceModel.countDocuments({
        employerId: eid,
        date: { $gte: d, $lte: dEnd },
        status: "Present",
      });
      const notPresent = await AttendanceModel.countDocuments({
        employerId: eid,
        date: { $gte: d, $lte: dEnd },
        status: { $in: ["Absent", "Late"] },
      });
      attendanceChart.push({
        day: DAY_LABELS[d.getDay()].slice(0, 3),
        present,
        absent: notPresent,
      });
    }

    const statusAgg = await TaskModel.aggregate([
      { $match: { employerId: eid } },
      { $group: { _id: "$status", n: { $sum: 1 } } },
    ]);
    const map: Record<string, number> = {};
    for (const r of statusAgg) {
      if (r._id) map[r._id] = r.n;
    }
    const totalT = (map["Pending"] ?? 0) + (map["In Progress"] ?? 0) + (map["Completed"] ?? 0);
    const donePct =
      totalT > 0 ? Math.round(((map["Completed"] ?? 0) / totalT) * 100) : 0;
    const taskPie = [
      { name: "Done", value: map["Completed"] ?? 0, fill: "#2563EB" },
      {
        name: "In Progress",
        value: map["In Progress"] ?? 0,
        fill: "#F97316",
      },
      { name: "To Do", value: map["Pending"] ?? 0, fill: "#E5E7EB" },
    ];

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    const payments = await PaymentModel.find({
      employerId: eid,
      createdAt: { $gte: sixMonthsAgo },
    }).lean();

    const monthKey = (dt: Date) =>
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    const monthTotals: Record<string, { paid: number; pending: number }> = {};
    for (const p of payments) {
      const d = new Date((p as { createdAt?: Date }).createdAt ?? Date.now());
      const k = monthKey(d);
      if (!monthTotals[k]) monthTotals[k] = { paid: 0, pending: 0 };
      monthTotals[k].paid += p.paidAmount ?? 0;
      monthTotals[k].pending += p.unpaidAmount ?? 0;
    }
    const monthOrder = Object.keys(monthTotals).sort();
    const paymentSummary = monthOrder.map((k) => {
      const [y, m] = k.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return {
        month: monthNames[parseInt(m, 10) - 1],
        paid: monthTotals[k].paid,
        pending: monthTotals[k].pending,
      };
    });

    const notifications: { text: string; time: string }[] = [];
    const lateAtt = await AttendanceModel.find({
      employerId: eid,
      status: { $in: ["Late", "Absent"] },
    })
      .sort({ createdAt: -1 })
      .limit(2)
      .populate("workerId", "name");
    for (const a of lateAtt) {
      const w = (a.workerId as unknown as { name?: string })?.name ?? "Worker";
      notifications.push({
        text: `${w} — ${a.status} check-in.`,
        time: formatRel(a.createdAt),
      });
    }
    const doneTasks = await TaskModel.find({
      employerId: eid,
      status: "Completed",
    })
      .sort({ updatedAt: -1 })
      .limit(2)
      .select("title");
    for (const t of doneTasks) {
      notifications.push({
        text: `Task "${t.title}" marked completed.`,
        time: formatRel(t.updatedAt),
      });
    }
    const recentPay = await PaymentModel.find({ employerId: eid })
      .sort({ updatedAt: -1 })
      .limit(2)
      .populate("workerId", "name");
    for (const p of recentPay) {
      const w = (p.workerId as unknown as { name?: string })?.name ?? "Worker";
      notifications.push({
        text: `Payment update for ${w} (${p.status}).`,
        time: formatRel(p.updatedAt),
      });
    }

    return NextResponse.json({
      stats: {
        totalWorkers,
        activeProjects,
        tasksToday,
        tasksCompletedWeek,
        pendingPayments: pendingPaymentsCents,
      },
      attendanceChart,
      taskPie,
      taskCompletionPercent: donePct,
      paymentSummary:
        paymentSummary.length > 0
          ? paymentSummary
          : [
              { month: "—", paid: 0, pending: 0 },
            ],
      notifications: notifications.slice(0, 5),
    });
  } catch (e) {
    console.error("[employer/dashboard]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

function formatRel(d?: Date) {
  if (!d) return "";
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (s < 60) return `${s} mins ago`;
  const h = Math.floor(s / 60);
  if (h < 48) return `${h} hour${h > 1 ? "s" : ""} ago`;
  return `${Math.floor(h / 24)} days ago`;
}
