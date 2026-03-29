import mongoose, { Schema, models, model } from "mongoose";

const PaymentSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    totalWage: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    unpaidAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid"],
      default: "Unpaid",
    },
    paymentDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export const PaymentModel = models.Payment || model("Payment", PaymentSchema);
