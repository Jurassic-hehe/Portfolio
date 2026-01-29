import { NextResponse } from 'next/server';
import { readStore, writeStore } from '../../../../lib/devStore';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )dev_session=([^;]+)/);
    const sid = match ? match[1] : null;
    const store = await readStore();
    if (sid && store.sessions && store.sessions[sid]) {
      delete store.sessions[sid];
      await writeStore(store);
    }

    const res = NextResponse.json({ ok: true });
    res.headers.set('Set-Cookie', `dev_session=deleted; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`);
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
