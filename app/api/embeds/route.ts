import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const EMBEDS_FILE = path.join(process.cwd(), "public", "embeds.json");

async function loadEmbeds(): Promise<string[]> {
  try {
    const data = await fs.readFile(EMBEDS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveEmbeds(embeds: string[]): Promise<void> {
  await fs.writeFile(EMBEDS_FILE, JSON.stringify(embeds, null, 2));
}

// Public read
export async function GET() {
  try {
    const embeds = await loadEmbeds();
    return NextResponse.json(embeds);
  } catch (e) {
    console.error("Error loading embeds:", e);
    return NextResponse.json([], { status: 200 });
  }
}

// Protected add — requires dev_unlocked cookie
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const unlocked = cookieStore.get("dev_unlocked")?.value === "1";

    if (!unlocked) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const trimmedInput = url.trim();
    const isRawHTML = /<iframe|<blockquote|<script|<div[^>]*(?:data-|class=)/i.test(trimmedInput);

    const embeds = await loadEmbeds();
    if (embeds.includes(trimmedInput)) {
      return NextResponse.json({ error: "This embed already exists" }, { status: 400 });
    }

    if (!isRawHTML) {
      const isSupported = /youtube\.com|youtu\.be|vimeo\.com|instagram\.com/i.test(trimmedInput);
      if (!isSupported) {
        return NextResponse.json({ error: "Only YouTube, Vimeo, Instagram URLs or embed code are supported" }, { status: 400 });
      }
    }

    embeds.unshift(trimmedInput);
    await saveEmbeds(embeds);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unknown error";
    console.error("Embed error:", errorMsg);
    return NextResponse.json({ error: `Failed to add embed: ${errorMsg}` }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

// Embeds feature removed. Keep a harmless route that returns 404 JSON.
export async function GET() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}