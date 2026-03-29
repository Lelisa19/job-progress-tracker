import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["employer", "worker"], required: true },
    phone: { type: String, default: "" },
    /** Short bio shown on worker profile */
    bio: { type: String, default: "" },
    /** Data URL (e.g. captured photo) or https image URL */
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
