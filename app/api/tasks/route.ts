import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { TaskModel } from "@/models/Task";
import { WorkerModel } from "@/models/Worker";
import { ProjectModel } from "@/models/Project";

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
      const list = await TaskModel.find({ employerId: auth.sub }).sort({
        deadline: 1,
      });
      const tasks = await Promise.all(
        list.map(async (t) => {
          const worker = await WorkerModel.findById(t.workerId)
            .select("name")
            .lean();
          const project = await ProjectModel.findById(t.projectId)
            .select("title")
            .lean();
          return {
            id: t._id.toString(),
            projectId: t.projectId.toString(),
            workerId: t.workerId.toString(),
            title: t.title,
            description: t.description,
            status: t.status,
            deadline: t.deadline,
            workerName: worker?.name ?? "",
            projectName: project?.title ?? "",
          };
        })
      );
      return NextResponse.json({ tasks });
    }
    const worker = await WorkerModel.findOne({ userId: auth.sub });
    if (!worker) {
      return NextResponse.json({ tasks: [] });
    }
    const list = await TaskModel.find({ workerId: worker._id }).sort({
      deadline: 1,
    });
    const tasks = await Promise.all(
      list.map(async (t) => {
        const project = await ProjectModel.findById(t.projectId)
          .select("title")
          .lean();
        return {
          id: t._id.toString(),
          projectId: t.projectId.toString(),
          workerId: t.workerId.toString(),
          title: t.title,
          description: t.description,
          status: t.status,
          deadline: t.deadline,
          projectName: project?.title ?? "",
        };
      })
    );
    return NextResponse.json({ tasks });
  } catch (e) {
    console.error("[tasks GET]", e);
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
    const project = await ProjectModel.findOne({
      _id: new mongoose.Types.ObjectId(String(body.projectId)),
      employerId: auth.sub,
    });
    if (!project) {
      return NextResponse.json({ error: "Invalid project" }, { status: 400 });
    }
    const worker = await WorkerModel.findOne({
      _id: new mongoose.Types.ObjectId(String(body.workerId)),
      employerId: auth.sub,
    });
    if (!worker) {
      return NextResponse.json({ error: "Invalid worker" }, { status: 400 });
    }
    const t = await TaskModel.create({
      employerId: auth.sub,
      projectId: body.projectId,
      workerId: body.workerId,
      title: String(body.title ?? "").trim(),
      description: String(body.description ?? ""),
      status: body.status ?? "Pending",
      deadline: body.deadline ? new Date(body.deadline) : new Date(),
    });
    return NextResponse.json({ task: { id: t._id.toString() } });
  } catch (e) {
    console.error("[tasks POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
