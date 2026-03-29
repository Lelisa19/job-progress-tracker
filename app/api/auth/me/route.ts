import { NextRequest, NextResponse } from "next/server";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/api-auth";
import { User } from "@/models/User";

/** Returns current user from JWT + database (fresh name/email). */
export async function GET(req: NextRequest) {
  try {
    const payload = await getAuthFromRequest(req);
    if (!payload?.sub) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const off = mongoUnavailableResponse();
    if (off) return off;
    await connectDB();
    const user = await User.findById(payload.sub).lean();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const u = user as {
      phone?: string;
      avatarUrl?: string;
    };
    return NextResponse.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        phone: u.phone ?? "",
        avatarUrl: u.avatarUrl?.trim() ?? "",
        initials: user.name
          .split(/\s+/)
          .map((w: string) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      },
    });
  } catch (e) {
    console.error("[auth/me]", e);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
