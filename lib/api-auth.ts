import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";
import type { AuthTokenPayload } from "@/lib/jwt";

/** Read JWT from cookie and verify (for Route Handlers). */
export async function getAuthFromRequest(
  req: NextRequest
): Promise<AuthTokenPayload | null> {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}
