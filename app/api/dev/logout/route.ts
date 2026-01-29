import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const isProd = !!process.env.VERCEL || process.env.NODE_ENV === 'production';
    const res = NextResponse.json({ ok: true });
    // Clear the dev_unlocked cookie
    res.cookies.set({
      name: 'dev_unlocked',
      value: '',
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
      maxAge: 0,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
