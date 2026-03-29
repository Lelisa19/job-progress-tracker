import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { WorkerModel } from "@/models/Worker";
import { AttendanceModel } from "@/models/Attendance";
import { PaymentModel } from "@/models/Payment";

export async function GET(
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const w = await WorkerModel.findOne({
      _id: id,
      employerId: auth.sub,
    }).lean();
    if (!w) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const attendance = await AttendanceModel.find({ workerId: id })
      .sort({ date: -1 })
      .limit(20)
      .lean();
    const payments = await PaymentModel.find({ workerId: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      worker: {
        id: String(w._id),
        name: w.name,
        email: w.email,
        phone: w.phone,
        skill: w.skill,
        dailyWage: w.dailyWage,
        reputation: w.reputation,
        status: w.status,
      },
      attendanceHistory: attendance.map((a) => ({
        id: String(a._id),
        date: a.date,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        status: a.status,
      })),
      paymentHistory: payments.map((p) => ({
        id: String(p._id),
        totalWage: p.totalWage,
        paidAmount: p.paidAmount,
        unpaidAmount: p.unpaidAmount,
        status: p.status,
        paymentDate: p.paymentDate,
      })),
    });
  } catch (e) {
    console.error("[workers/id GET]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

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
    const w = await WorkerModel.findOneAndUpdate(
      { _id: id, employerId: auth.sub },
      {
        $set: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          skill: body.skill,
          dailyWage: body.dailyWage,
          reputation: body.reputation,
          status: body.status,
        },
      },
      { new: true }
    );
    if (!w) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    console.error("[workers PATCH]", e);
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
    const r = await WorkerModel.deleteOne({ _id: id, employerId: auth.sub });
    if (r.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[workers DELETE]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
