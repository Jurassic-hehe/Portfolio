import { NextResponse } from "next/server";
import crypto from "crypto";
import { readStore, writeStore } from "@/lib/devStore";

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour
const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

function getClientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("host") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  let secret: string | undefined;

  // ✅ SAFE body parsing (no silent crashes)
  try {
    const body = await request.json();
    secret = body?.secret;
  } catch {
    secret = undefined;
  }

  const devSecret = process.env.DEV_SECRET;

  // 🔴 Env missing
  if (!devSecret) {
    return NextResponse.json(
      { error: "Dev unlock not configured" },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const now = Date.now();

  const store = await readStore();
  store.attempts ||= {};
  store.sessions ||= {};

  const attempt =
    store.attempts[ip] || { count: 0, lastFailedAt: 0, lockedUntil: 0 };

  // 🔒 Locked
  if (attempt.lockedUntil && attempt.lockedUntil > now) {
    const remaining = Math.ceil(
      (attempt.lockedUntil - now) / 1000
    );
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${remaining}s` },
      { status: 429 }
    );
  }

  // ❌ Invalid secret
  if (!secret || secret !== devSecret) {
    attempt.count += 1;
    attempt.lastFailedAt = now;

    if (attempt.count >= MAX_ATTEMPTS) {
      attempt.lockedUntil = now + LOCK_DURATION_MS;
    }

    store.attempts[ip] = attempt;
    await writeStore(store);

    return NextResponse.json(
      { error: "Invalid secret" },
      { status: 401 }
    );
  }

  // ✅ SUCCESS — reset attempts
  delete store.attempts[ip];

  // Create session
  const sid = crypto.randomUUID();
  const expiresAt = now + SESSION_TIMEOUT_MS;

  store.sessions[sid] = {
    createdAt: now,
    lastActive: now,
    expiresAt,
    ip,
  };

  await writeStore(store);

  // 🍪 Cookie
  const cookieParts = [
    `dev_session=${sid}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${Math.floor(SESSION_TIMEOUT_MS / 1000)}`,
  ];

  const proto = request.headers.get("x-forwarded-proto");
  if (proto === "https") cookieParts.push("Secure");

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": cookieParts.join("; "),
      },
    }
  );
}