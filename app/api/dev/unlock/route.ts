import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readStore, writeStore } from '../../../../lib/devStore';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour
const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes



function getClientIp(request: Request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || request.headers.get('host') || 'unknown';
}

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
    const devSecret = process.env.DEV_SECRET;

    if (!devSecret) {
      return NextResponse.json({ error: 'Dev unlock not configured' }, { status: 400 });
    }

    const ip = getClientIp(request);
    const now = Date.now();
    const store = await readStore();
    store.attempts = store.attempts || {};
    store.sessions = store.sessions || {};

    const attempt = store.attempts[ip] || { count: 0, lastFailedAt: 0, lockedUntil: 0 };
    if (attempt.lockedUntil && attempt.lockedUntil > now) {
      const remaining = Math.ceil((attempt.lockedUntil - now) / 1000);
      return NextResponse.json({ error: `Too many failed attempts. Try again in ${remaining}s` }, { status: 429 });
    }

    if (!secret || secret !== devSecret) {
      // Failed attempt
      attempt.count = (attempt.count || 0) + 1;
      attempt.lastFailedAt = now;
      if (attempt.count >= MAX_ATTEMPTS) {
        attempt.lockedUntil = now + LOCK_DURATION_MS;
      }
      store.attempts[ip] = attempt;
      await writeStore(store);

      const status = attempt.lockedUntil && attempt.lockedUntil > now ? 429 : 401;
      const message = status === 429 ? 'Too many failed attempts, temporarily locked.' : 'Invalid secret';
      return NextResponse.json({ error: message }, { status });
    }

    // Successful unlock: reset attempts for IP and create a server-side session
    delete store.attempts[ip];

    const sid = crypto.randomUUID();
    const expiresAt = now + SESSION_TIMEOUT_MS;
    store.sessions[sid] = { createdAt: now, lastActive: now, expiresAt, ip };
    await writeStore(store);

    const cookieParts = [`dev_session=${sid}`, `Path=/`, `HttpOnly`, `SameSite=Strict`, `Max-Age=${Math.floor(SESSION_TIMEOUT_MS / 1000)}`];
    const host = request.headers.get('host') || '';
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const isSecureContext = forwardedProto === 'https' || (process.env.NODE_ENV === 'production' && host && !host.includes('localhost') && !host.startsWith('127.'));
    if (isSecureContext) cookieParts.push('Secure');
    const setCookie = cookieParts.join('; ');
    console.log('[dev/unlock] setting cookie:', setCookie, 'host=', host, 'proto=', forwardedProto);
    return NextResponse.json({ ok: true }, { headers: { 'Set-Cookie': setCookie } });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
