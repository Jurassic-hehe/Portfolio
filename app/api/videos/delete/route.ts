import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { enforceSession } from '../../../../lib/devAuth';

export async function POST(request: NextRequest) {
  try {
    const auth = await enforceSession(request);
    if (!auth.ok) return auth.response;
    const { filename } = await request.json();

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filepath = path.join(process.cwd(), 'public', 'videos', filename);
    
    // Check if file exists
    try {
      await fs.stat(filepath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete the file
    await fs.unlink(filepath);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Unknown error';
    console.error('Delete error:', errorMsg, e);
    return NextResponse.json({ error: `Delete failed: ${errorMsg}` }, { status: 500 });
  }
}
