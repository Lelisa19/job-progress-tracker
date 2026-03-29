import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { WorkerModel } from "@/models/Worker";
import { AttendanceModel } from "@/models/Attendance";

/** Worker check-in / check-out with optional GPS (proposal attendance module). */
export async function POST(req: NextRequest) {
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
      return NextResponse.json(
        {
          error:
            "No worker profile is linked to your account yet. Ask your employer to add you with your email.",
        },
        { status: 400 }
      );
    }
    const body = await req.json();
    const action = body.action === "checkout" ? "checkout" : "checkin";
    const projectId = String(body.projectId ?? "");
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "projectId required" }, { status: 400 });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const lat = Number(body.lat ?? 0);
    const lng = Number(body.lng ?? 0);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (action === "checkin") {
      const a = await AttendanceModel.create({
        employerId: worker.employerId,
        workerId: worker._id,
        projectId: new mongoose.Types.ObjectId(projectId),
        date: today,
        checkInTime: timeStr,
        checkOutTime: "",
        location: { lat, lng },
        status: "Present",
      });
      return NextResponse.json({ ok: true, id: a._id.toString(), checkInTime: timeStr });
    }

    const open = await AttendanceModel.findOne({
      workerId: worker._id,
      projectId: new mongoose.Types.ObjectId(projectId),
      date: today,
    }).sort({ createdAt: -1 });

    if (!open) {
      return NextResponse.json({ error: "No open check-in for today" }, { status: 400 });
    }
    open.checkOutTime = timeStr;
    open.location = { lat, lng };
    await open.save();
    return NextResponse.json({ ok: true, checkOutTime: timeStr });
  } catch (e) {
    console.error("[worker/check-in]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
