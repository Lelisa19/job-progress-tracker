import { NextRequest, NextResponse } from "next/server";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { WorkerModel } from "@/models/Worker";
import { ProjectModel } from "@/models/Project";

/** Projects the worker is assigned to (for GPS check-in project picker). */
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
      return NextResponse.json({ projects: [] });
    }
    const projects = await ProjectModel.find({
      workers: worker._id,
    }).select("title _id");
    return NextResponse.json({
      projects: projects.map((p) => ({
        id: p._id.toString(),
        title: p.title,
      })),
    });
  } catch (e) {
    console.error("[worker/my-projects]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
