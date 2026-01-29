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

export async function GET() {
  try {
    const embeds = await loadEmbeds();
    return NextResponse.json(embeds);
  } catch (e) {
    console.error('Error loading embeds:', e);
    return NextResponse.json([], { status: 200 });
  }
}

import { enforceSession } from '../../../lib/devAuth';

export async function POST(request: NextRequest) {
  try {
    // Require admin session
    const auth = await enforceSession(request);
    if (!auth.ok) return auth.response;

    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const trimmedInput = url.trim();

    // Check if it's raw HTML embed code (iframe, blockquote, script, div with data attrs, etc.)
    const isRawHTML = /<iframe|<blockquote|<script|<div[^>]*(?:data-|class=)/i.test(trimmedInput);

    if (isRawHTML) {
      // Accept raw HTML embeds (YouTube iframe, Instagram blockquote, etc.)
      const embeds = await loadEmbeds();
      
      if (embeds.includes(trimmedInput)) {
        return NextResponse.json(
          { error: 'This embed already exists' },
          { status: 400 }
        );
      }

      embeds.unshift(trimmedInput);
      await saveEmbeds(embeds);
      return NextResponse.json({ ok: true });
    }

    // Validate it's a supported platform URL
    const isSupported =
      /youtube\.com|youtu\.be|vimeo\.com|instagram\.com/i.test(trimmedInput);

    if (!isSupported) {
      return NextResponse.json(
        { error: 'Only YouTube, Vimeo, Instagram URLs or embed code are supported' },
        { status: 400 }
      );
    }

    const embeds = await loadEmbeds();

    // Check for duplicates
    if (embeds.includes(trimmedInput)) {
      return NextResponse.json(
        { error: 'This embed already exists' },
        { status: 400 }
      );
    }

    embeds.unshift(trimmedInput); // Add to beginning
    await saveEmbeds(embeds);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Unknown error';
    console.error('Embed error:', errorMsg);
    return NextResponse.json({ error: `Failed to add embed: ${errorMsg}` }, { status: 500 });
  }
}
