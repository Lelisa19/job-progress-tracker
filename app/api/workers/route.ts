import { NextRequest, NextResponse } from "next/server";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { WorkerModel } from "@/models/Worker";
import { User } from "@/models/User";

/** List (employer) or scoped operations — GET all workers for logged-in employer */
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const list = await WorkerModel.find({ employerId: auth.sub }).sort({
      createdAt: -1,
    });
    return NextResponse.json({
      workers: list.map((w) => ({
        id: w._id.toString(),
        name: w.name,
        email: w.email,
        phone: w.phone,
        skill: w.skill,
        dailyWage: w.dailyWage,
        reputation: w.reputation,
        status: w.status,
      })),
    });
  } catch (e) {
    console.error("[workers GET]", e);
    return NextResponse.json({ error: "Failed to load workers" }, { status: 500 });
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
    const email = String(body.email ?? "").trim().toLowerCase();
    const w = await WorkerModel.create({
      employerId: auth.sub,
      name: String(body.name ?? "").trim(),
      email,
      phone: String(body.phone ?? "").trim(),
      skill: String(body.skill ?? "").trim(),
      dailyWage: Number(body.dailyWage) || 0,
      reputation: Number(body.reputation) || 4,
      status: body.status === "Inactive" ? "Inactive" : "Active",
    });
    if (email) {
      const u = await User.findOne({ email, role: "worker" });
      if (u) {
        w.userId = u._id;
        await w.save();
      }
    }
    return NextResponse.json({
      worker: {
        id: w._id.toString(),
        name: w.name,
        email: w.email,
        phone: w.phone,
        skill: w.skill,
        dailyWage: w.dailyWage,
        reputation: w.reputation,
        status: w.status,
      },
    });
  } catch (e) {
    console.error("[workers POST]", e);
    return NextResponse.json({ error: "Failed to create worker" }, { status: 500 });
  }
}
