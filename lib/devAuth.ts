import { NextResponse } from 'next/server';
import { readStore, writeStore } from './devStore';

const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

function getClientIp(request: Request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || request.headers.get('host') || 'unknown';
}

export async function enforceSession(request: Request): Promise<{ ok: false; response: NextResponse } | { ok: true; sid: string; session: unknown } > {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )dev_session=([^;]+)/);
    const sid = match ? match[1] : null;
    if (!sid) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

    const store = await readStore();
    const session = store.sessions?.[sid];
    const now = Date.now();
    if (!session || !session.expiresAt || session.expiresAt <= now) {
      if (session && (store as any).sessions) delete (store as any).sessions[sid];
      await writeStore(store);
      return { ok: false, response: NextResponse.json({ error: 'Session expired' }, { status: 401 }) };
    }

    // Optional: verify IP matches the creating IP to make session stealing harder
    const ip = getClientIp(request);
    if ((session as any).ip && (session as any).ip !== ip) {
      return { ok: false, response: NextResponse.json({ error: 'IP mismatch' }, { status: 401 }) };
    }

    // Update sliding expiration
    (session as any).lastActive = now;
    (session as any).expiresAt = now + SESSION_TIMEOUT_MS;
    (store as any).sessions[sid] = session;
    await writeStore(store);

    return { ok: true, sid, session };
  } catch (e) {
    return { ok: false, response: NextResponse.json({ error: 'Server error' }, { status: 500 }) };
  }
}
