import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "OK", message: "Auth API Route" });
}
