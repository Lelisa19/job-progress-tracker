import { NextRequest, NextResponse } from "next/server";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { PaymentModel } from "@/models/Payment";

export async function GET(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const list = await PaymentModel.find({ employerId: auth.sub })
      .populate("workerId", "name")
      .sort({ createdAt: -1 });
    return NextResponse.json({
      payments: list.map((p) => ({
        id: p._id.toString(),
        workerId: String(p.workerId),
        workerName:
          (p.workerId as unknown as { name?: string })?.name ?? "Worker",
        totalWage: p.totalWage,
        paidAmount: p.paidAmount,
        unpaidAmount: p.unpaidAmount,
        status: p.status,
        paymentDate: p.paymentDate,
        createdAt: p.createdAt?.toISOString?.() ?? undefined,
      })),
    });
  } catch (e) {
    console.error("[payments GET]", e);
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
    const p = await PaymentModel.create({
      employerId: auth.sub,
      workerId: body.workerId,
      totalWage: Number(body.totalWage) || 0,
      paidAmount: Number(body.paidAmount) || 0,
      unpaidAmount: Number(body.unpaidAmount) || 0,
      status: body.status ?? "Unpaid",
      paymentDate: String(body.paymentDate ?? ""),
    });
    return NextResponse.json({ id: p._id.toString() });
  } catch (e) {
    console.error("[payments POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
