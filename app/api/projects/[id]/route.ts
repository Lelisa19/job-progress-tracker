import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { ProjectModel } from "@/models/Project";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await ctx.params;
    await connectDB();
    const body = await req.json();
    const eid = new mongoose.Types.ObjectId(auth.sub);
    const update: Record<string, unknown> = {};
    if (body.title != null) update.title = String(body.title).trim();
    if (body.location != null) update.location = String(body.location).trim();
    if (body.startDate != null) update.startDate = new Date(body.startDate);
    if (body.progress != null) update.progress = Number(body.progress);
    if (Array.isArray(body.workers)) {
      update.workers = body.workers.map(
        (w: string) => new mongoose.Types.ObjectId(w)
      );
    }
    const p = await ProjectModel.findOneAndUpdate(
      { _id: id, employerId: eid },
      { $set: update },
      { new: true }
    );
    if (!p) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
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
    console.error("[projects PATCH]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await ctx.params;
    await connectDB();
    const eid = new mongoose.Types.ObjectId(auth.sub);
    const r = await ProjectModel.deleteOne({ _id: id, employerId: eid });
    if (r.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[projects DELETE]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
