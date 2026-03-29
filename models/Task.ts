import mongoose, { Schema, models, model } from "mongoose";

const TaskSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

export const TaskModel = models.Task || model("Task", TaskSchema);
