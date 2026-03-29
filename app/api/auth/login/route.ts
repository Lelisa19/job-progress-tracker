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
    const requestedRole = body.role === "worker" ? "worker" : "employer";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.role !== requestedRole) {
      return NextResponse.json(
        {
          error:
            "This account is not a " +
            requestedRole +
            " account. Switch the role toggle.",
        },
        { status: 403 }
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
    console.error("[auth/login]", e);
    return NextResponse.json(
      { error: "Login failed. Check MongoDB connection." },
      { status: 500 }
    );
  }
}
