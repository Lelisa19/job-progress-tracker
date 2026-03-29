import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { WorkerModel } from "@/models/Worker";
import { ProjectModel } from "@/models/Project";
import { PaymentModel } from "@/models/Payment";
import { TaskModel } from "@/models/Task";

/** Analytics for Reports & Analytics page — all from DB. */
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

    const workers = await WorkerModel.find({ employerId: eid })
      .sort({ name: 1 })
      .limit(50)
      .lean();
    const workerPerformance = await Promise.all(
      workers.map(async (w) => {
        const done = await TaskModel.countDocuments({
          employerId: eid,
          workerId: w._id,
          status: "Completed",
        });
        const total = await TaskModel.countDocuments({
          employerId: eid,
          workerId: w._id,
        });
        const rate = total > 0 ? Math.round((done / total) * 100) : 50;
        const score = Math.min(
          100,
          Math.round((w.reputation ?? 4) * 15 + rate * 0.25)
        );
        let level = "Medium";
        if (score >= 80) level = "High";
        else if (score < 55) level = "Low";
        return {
          id: String(w._id),
          name: w.name,
          score,
          level,
          color:
            score >= 80
              ? "bg-blue-500"
              : score >= 55
                ? "bg-orange-500"
                : "bg-green-500",
        };
      })
    );

    const projects = await ProjectModel.find({ employerId: eid })
      .sort({ title: 1 })
      .lean();
    const projectCompletion = projects.map((p) => ({
      name: p.title,
      completion: p.progress ?? 0,
      color:
        (p.progress ?? 0) >= 80
          ? "bg-green-500"
          : (p.progress ?? 0) >= 40
            ? "bg-orange-500"
            : "bg-red-500",
    }));

    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    const payments = await PaymentModel.find({
      employerId: eid,
      createdAt: { $gte: yearAgo },
    }).lean();

    const byMonth: Record<string, { paid: number; unpaid: number }> = {};
    for (const p of payments) {
      const d = new Date((p as { createdAt?: Date }).createdAt ?? Date.now());
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[k]) byMonth[k] = { paid: 0, unpaid: 0 };
      byMonth[k].paid += p.paidAmount ?? 0;
      byMonth[k].unpaid += p.unpaidAmount ?? 0;
    }
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
    const keys = Object.keys(byMonth).sort();
    const paymentTrends = keys.map((k) => {
      const m = parseInt(k.split("-")[1], 10);
      return {
        month: monthNames[m - 1],
        paid: byMonth[k].paid,
        unpaid: byMonth[k].unpaid,
      };
    });

    const projectNames = [
      "All Projects",
      ...projects.map((p) => p.title),
    ];
    const workerNames = ["All Workers", ...workers.map((w) => w.name)];

    return NextResponse.json({
      workerPerformance,
      projectCompletion,
      paymentTrends:
        paymentTrends.length > 0
          ? paymentTrends
          : [{ month: "—", paid: 0, unpaid: 0 }],
      filterOptions: { projects: projectNames, workers: workerNames },
    });
  } catch (e) {
    console.error("[employer/reports]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
