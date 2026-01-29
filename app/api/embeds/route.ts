import { NextResponse } from "next/server";

// Embeds feature removed. Keep a harmless route that returns 404 JSON.
export async function GET() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}