import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { PaymentModel } from "@/models/Payment";

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
    const p = await PaymentModel.findOne({ _id: id, employerId: eid });
    if (!p) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (body.action === "markPaid") {
      p.paidAmount = p.totalWage;
      p.unpaidAmount = 0;
      p.status = "Paid";
      p.paymentDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      await p.save();
      return NextResponse.json({
        payment: {
          id: p._id.toString(),
          totalWage: p.totalWage,
          paidAmount: p.paidAmount,
          unpaidAmount: p.unpaidAmount,
          status: p.status,
          paymentDate: p.paymentDate,
        },
      });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error("[payments PATCH]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
