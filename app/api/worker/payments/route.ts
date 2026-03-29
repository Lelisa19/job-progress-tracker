import { NextRequest, NextResponse } from "next/server";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { WorkerModel } from "@/models/Worker";
import { PaymentModel } from "@/models/Payment";

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
      return NextResponse.json({ payments: [] });
    }
    const list = await PaymentModel.find({ workerId: worker._id })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({
      payments: list.map((p) => ({
        id: p._id.toString(),
        workerId: String(p.workerId),
        workerName: "You",
        totalWage: p.totalWage,
        paidAmount: p.paidAmount,
        unpaidAmount: p.unpaidAmount,
        status: p.status,
        paymentDate: p.paymentDate || "",
      })),
    });
  } catch (e) {
    console.error("[worker/payments]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
