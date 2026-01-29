import { NextResponse } from 'next/server';

// Simplified: enforceSession now checks only the `dev_unlocked` cookie.
// This removes filesystem sessions and makes protected APIs rely solely on the cookie.
export async function enforceSession(request: Request): Promise<{ ok: false; response: NextResponse } | { ok: true } > {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )dev_unlocked=([^;]+)/);
    const val = match ? match[1] : null;
    if (val === '1') return { ok: true };
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  } catch (e) {
    return { ok: false, response: NextResponse.json({ error: 'Server error' }, { status: 500 }) };
  }
}
