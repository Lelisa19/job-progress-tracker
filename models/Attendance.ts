import mongoose, { Schema, models, model } from "mongoose";

const AttendanceSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    date: { type: Date, required: true },
    checkInTime: { type: String, default: "" },
    checkOutTime: { type: String, default: "" },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },
  },
  { timestamps: true }
);

export const AttendanceModel =
  models.Attendance || model("Attendance", AttendanceSchema);
