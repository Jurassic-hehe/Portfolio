import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'videos');
    await fs.mkdir(dir, { recursive: true });
    const files = await fs.readdir(dir);
    const vids = files.filter((f) => /\.(mp4|webm|mov|m4v)$/i.test(f));
    return NextResponse.json(vids);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}
