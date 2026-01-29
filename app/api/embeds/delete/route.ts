import { NextResponse } from 'next/server';

// Embeds deletion removed — return 404
export async function POST() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
