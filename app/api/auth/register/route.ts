import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB, mongoUnavailableResponse } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signAuthToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const off = mongoUnavailableResponse();
    if (off) return off;
    await connectDB();
    const body = await req.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim();
    const role = body.role === "worker" ? "worker" : "employer";
    const phone = String(body.phone ?? "").trim();

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Email and password (min 8 characters) are required" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      passwordHash,
      name,
      role,
      phone,
    });

    if (role === "worker") {
      const { WorkerModel } = await import("@/models/Worker");
      await WorkerModel.findOneAndUpdate(
        { email },
        { $set: { userId: user._id } }
      );
    }

    const token = await signAuthToken({
      userId: user._id.toString(),
      role: user.role as "employer" | "worker",
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (e) {
    console.error("[auth/register]", e);
    return NextResponse.json(
      { error: "Registration failed. Is MongoDB running and MONGODB_URI set?" },
      { status: 500 }
    );
  }
}
