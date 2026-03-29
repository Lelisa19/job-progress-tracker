import { NextRequest, NextResponse } from "next/server";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { User } from "@/models/User";
import { WorkerModel } from "@/models/Worker";

const MAX_AVATAR_LEN = 600_000;

export async function GET(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "worker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const user = await User.findById(auth.sub).lean();
    const worker = await WorkerModel.findOne({ userId: auth.sub })
      .populate("employerId", "name")
      .lean();
    const employerName =
      worker &&
      worker.employerId &&
      typeof worker.employerId === "object" &&
      "name" in worker.employerId
        ? String((worker.employerId as { name?: string }).name ?? "")
        : null;

    return NextResponse.json({
      user: user
        ? {
            email: user.email,
            name: user.name,
            phone: user.phone ?? "",
            bio: (user as { bio?: string }).bio ?? "",
            avatarUrl: (user as { avatarUrl?: string }).avatarUrl ?? "",
          }
        : null,
      worker: worker
        ? {
            id: String(worker._id),
            name: worker.name,
            phone: worker.phone,
            skill: worker.skill,
            dailyWage: worker.dailyWage,
            reputation: worker.reputation,
            status: worker.status,
            employerName,
            memberSince: (worker as { createdAt?: Date }).createdAt,
          }
        : null,
    });
  } catch (e) {
    console.error("[worker/profile GET]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "worker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();

    const $set: Record<string, string> = {};
    if (typeof body.name === "string") {
      const n = body.name.trim();
      if (n.length > 0 && n.length <= 120) $set.name = n;
    }
    if (typeof body.phone === "string") {
      $set.phone = body.phone.trim().slice(0, 40);
    }
    if (typeof body.bio === "string") {
      $set.bio = body.bio.trim().slice(0, 2000);
    }
    if (body.avatarUrl !== undefined) {
      if (body.avatarUrl === null || body.avatarUrl === "") {
        $set.avatarUrl = "";
      } else if (typeof body.avatarUrl === "string") {
        if (body.avatarUrl.length > MAX_AVATAR_LEN) {
          return NextResponse.json(
            { error: "Profile photo is too large. Use a smaller image." },
            { status: 400 }
          );
        }
        if (
          body.avatarUrl.startsWith("data:image/") ||
          body.avatarUrl.startsWith("https://")
        ) {
          $set.avatarUrl = body.avatarUrl;
        } else {
          return NextResponse.json(
            { error: "Invalid profile photo format." },
            { status: 400 }
          );
        }
      }
    }

    if (Object.keys($set).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    await User.findByIdAndUpdate(auth.sub, { $set });

    const user = await User.findById(auth.sub).lean();
    return NextResponse.json({
      user: user
        ? {
            email: user.email,
            name: user.name,
            phone: user.phone ?? "",
            bio: (user as { bio?: string }).bio ?? "",
            avatarUrl: (user as { avatarUrl?: string }).avatarUrl ?? "",
          }
        : null,
    });
  } catch (e) {
    console.error("[worker/profile PATCH]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
