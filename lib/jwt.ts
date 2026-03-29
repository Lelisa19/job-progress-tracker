/**
 * JWT helpers (jose library)
 * --------------------------
 * We use `jose` because it works in both Node.js Route Handlers and Edge Middleware.
 * HS256 is a simple shared-secret algorithm; in production, keep JWT_SECRET long and private.
 */
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface AuthTokenPayload extends JWTPayload {
  sub: string;
  role: "employer" | "worker";
  email: string;
  name: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set and at least 32 characters (use a long random string in .env.local)"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(payload: {
  userId: string;
  role: "employer" | "worker";
  email: string;
  name: string;
}): Promise<string> {
  return new SignJWT({
    role: payload.role,
    email: payload.email,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAuthToken(
  token: string
): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}
