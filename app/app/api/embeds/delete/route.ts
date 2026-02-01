import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { enforceSession } from '../../../../lib/devAuth';

const EMBEDS_PUBLIC = path.join(process.cwd(), 'public', 'embeds.json');
const EMBEDS_DATA = path.join(process.cwd(), 'data', 'embeds.json');

async function loadEmbeds(): Promise<string[]> {
  // Prefer the writable `data/embeds.json` (dev), fallback to public for static reads
  try {
    const data = await fs.readFile(EMBEDS_DATA, 'utf-8');
    return JSON.parse(data);
  } catch {
    try {
      const data = await fs.readFile(EMBEDS_PUBLIC, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

async function saveEmbeds(embeds: string[]): Promise<void> {
  const payload = JSON.stringify(embeds, null, 2);

  // Try writing to data first (writable in local/dev)
  try {
    await fs.mkdir(path.dirname(EMBEDS_DATA), { recursive: true });
    await fs.writeFile(EMBEDS_DATA, payload, 'utf-8');
  } catch (e) {
    console.warn('Could not write to data/embeds.json:', (e as Error).message);
  }

  // Also attempt to update the public copy (may be read-only on some hosts)
  try {
    await fs.writeFile(EMBEDS_PUBLIC, payload, 'utf-8');
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err && err.code === 'EROFS') {
      console.warn('Public folder is read-only; skipping public embeds.json update.', err.message);
      return;
    }
    throw e;
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await enforceSession(request);
    if (!auth.ok) return auth.response;
    const { index } = await request.json();

    if (typeof index !== 'number') {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    const embeds = await loadEmbeds();

    if (index < 0 || index >= embeds.length) {
      return NextResponse.json({ error: 'Index out of range' }, { status: 400 });
    }

    embeds.splice(index, 1);
    await saveEmbeds(embeds);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Unknown error';
    console.error('Delete embed error:', errorMsg);
    return NextResponse.json({ error: `Failed to delete embed: ${errorMsg}` }, { status: 500 });
  }
}

