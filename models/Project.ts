import mongoose, { Schema, models, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    workers: [{ type: Schema.Types.ObjectId, ref: "Worker" }],
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const ProjectModel = models.Project || model("Project", ProjectSchema);
