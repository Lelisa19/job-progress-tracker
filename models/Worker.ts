import mongoose, { Schema, models, model } from "mongoose";

/** Workforce roster row (proposal §6.2). Belongs to an employer User. */
const WorkerSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    email: { type: String, lowercase: true, default: "" },
    phone: { type: String, required: true },
    skill: { type: String, required: true },
    dailyWage: { type: Number, required: true },
    reputation: { type: Number, default: 4.0 },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const WorkerModel = models.Worker || model("Worker", WorkerSchema);
