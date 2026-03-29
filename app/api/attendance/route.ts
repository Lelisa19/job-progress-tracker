import { NextRequest, NextResponse } from "next/server";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { AttendanceModel } from "@/models/Attendance";

export async function GET(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    if (auth.role === "employer") {
      const list = await AttendanceModel.find({ employerId: auth.sub })
        .populate("workerId", "name")
        .populate("projectId", "title")
        .sort({ date: -1 })
        .limit(100);
      return NextResponse.json({
        records: list.map((a) => ({
          id: a._id.toString(),
          workerId: String(a.workerId),
          projectId: String(a.projectId),
          date: a.date,
          checkInTime: a.checkInTime,
          checkOutTime: a.checkOutTime,
          location: a.location,
          status: a.status,
          workerName:
            (a.workerId as unknown as { name?: string })?.name ?? "",
          projectName:
            (a.projectId as unknown as { title?: string })?.title ?? "",
        })),
      });
    }
    const { WorkerModel } = await import("@/models/Worker");
    const worker = await WorkerModel.findOne({ userId: auth.sub });
    if (!worker) {
      return NextResponse.json({ records: [] });
    }
    const list = await AttendanceModel.find({ workerId: worker._id })
      .populate("projectId", "title")
      .sort({ date: -1 })
      .limit(50);
    return NextResponse.json({
      records: list.map((a) => ({
        id: a._id.toString(),
        workerId: String(a.workerId),
        projectId: String(a.projectId),
        date: a.date,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        location: a.location,
        status: a.status,
        projectTitle:
          (a.projectId as unknown as { title?: string })?.title ?? "",
      })),
    });
  } catch (e) {
    console.error("[attendance GET]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const a = await AttendanceModel.create({
      employerId: auth.sub,
      workerId: body.workerId,
      projectId: body.projectId,
      date: body.date ? new Date(body.date) : new Date(),
      checkInTime: body.checkInTime ?? "",
      checkOutTime: body.checkOutTime ?? "",
      location: body.location ?? { lat: 0, lng: 0 },
      status: body.status ?? "Present",
    });
    return NextResponse.json({ id: a._id.toString() });
  } catch (e) {
    console.error("[attendance POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
