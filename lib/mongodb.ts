/**
 * MongoDB connection for Next.js API routes
 * -----------------------------------------
 * Next.js can "cold start" often: each serverless invocation might be a new process.
 * We cache the connection on `global` so Mongoose does not reconnect on every request
 * during development (hot reload) or in production between warm invocations.
 */
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    "[mongodb] MONGODB_URI is not set. API routes that need the database will return errors until you add it to .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/** Use before `connectDB()` in Route Handlers when DB is required. */
export function mongoUnavailableResponse(): NextResponse | null {
  if (MONGODB_URI?.trim()) {
    return null;
  }
  return NextResponse.json(
    {
      error:
        "Database not configured. Create a file named .env.local in the project root, copy from .env.example, and set MONGODB_URI (for example mongodb://127.0.0.1:27017/job-progress-tracker). Restart npm run dev after saving.",
    },
    { status: 503 }
  );
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI?.trim()) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
