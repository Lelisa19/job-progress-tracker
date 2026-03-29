import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { TaskModel } from "@/models/Task";

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
    const $set: Record<string, unknown> = {};
    if (body.title != null) $set.title = String(body.title).trim();
    if (body.description != null) $set.description = String(body.description);
    if (body.status != null) $set.status = body.status;
    if (body.deadline != null) $set.deadline = new Date(body.deadline);
    if (body.projectId != null)
      $set.projectId = new mongoose.Types.ObjectId(String(body.projectId));
    if (body.workerId != null)
      $set.workerId = new mongoose.Types.ObjectId(String(body.workerId));
    const t = await TaskModel.findOneAndUpdate(
      { _id: id, employerId: auth.sub },
      { $set },
      { new: true }
    );
    if (!t) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[tasks PATCH]", e);
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
    const r = await TaskModel.deleteOne({ _id: id, employerId: auth.sub });
    if (r.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[tasks DELETE]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
