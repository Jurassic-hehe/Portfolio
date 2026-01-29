import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let secret: string | undefined;

  try {
    const body = await request.json();
    secret = body?.secret;
  } catch {
    secret = undefined;
  }

  const devSecret = process.env.DEV_SECRET;

  if (!devSecret) {
    return NextResponse.json(
      { error: "Dev unlock not configured" },
      { status: 400 }
    );
  }

  if (!secret || secret !== devSecret) {
    return NextResponse.json(
      { error: "Invalid secret" },
      { status: 401 }
    );
  }

  // ✅ Set cookie only (NO file store)
  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: "dev_unlocked",
    value: "1",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}