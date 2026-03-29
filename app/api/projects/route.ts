import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { ProjectModel } from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const list = await ProjectModel.find({ employerId: auth.sub }).sort({
      createdAt: -1,
    });
    return NextResponse.json({
      projects: list.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        location: p.location,
        startDate: p.startDate,
        workers: (p.workers ?? []).map((w: { toString: () => string }) =>
          w.toString()
        ),
        progress: p.progress,
      })),
    });
  } catch (e) {
    console.error("[projects GET]", e);
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
    const workerIds = (body.workers ?? [])
      .filter(Boolean)
      .map((id: string) => new mongoose.Types.ObjectId(String(id)));
    const p = await ProjectModel.create({
      employerId: auth.sub,
      title: String(body.title ?? "").trim(),
      location: String(body.location ?? "").trim(),
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      workers: workerIds,
      progress: Number(body.progress) || 0,
    });
    return NextResponse.json({
      project: {
        id: p._id.toString(),
        title: p.title,
        location: p.location,
        startDate: p.startDate,
        workers: p.workers.map((w: { toString: () => string }) => w.toString()),
        progress: p.progress,
      },
    });
  } catch (e) {
    console.error("[projects POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
