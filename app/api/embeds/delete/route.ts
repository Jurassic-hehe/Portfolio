import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const EMBEDS_FILE = path.join(process.cwd(), 'public', 'embeds.json');

async function loadEmbeds(): Promise<string[]> {
  try {
    const data = await fs.readFile(EMBEDS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveEmbeds(embeds: string[]): Promise<void> {
  await fs.writeFile(EMBEDS_FILE, JSON.stringify(embeds, null, 2));
}

import { enforceSession } from '../../../../lib/devAuth';

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
import { NextResponse } from 'next/server';

// Embeds deletion removed — return 404
export async function POST() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
