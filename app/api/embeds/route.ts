import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const EMBEDS_PUBLIC = path.join(process.cwd(), "public", "embeds.json");
const EMBEDS_DATA = path.join(process.cwd(), "data", "embeds.json");

async function loadEmbeds(): Promise<string[]> {
  // Prefer the writable `data/embeds.json` (dev), fallback to public for static reads
  try {
    const data = await fs.readFile(EMBEDS_DATA, "utf-8");
    return JSON.parse(data);
  } catch {
    try {
      const data = await fs.readFile(EMBEDS_PUBLIC, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

async function saveEmbeds(embeds: string[]): Promise<void> {
  const payload = JSON.stringify(embeds, null, 2);

  // First, try to write to a data file inside the project (writable in local/dev)
  try {
    await fs.mkdir(path.dirname(EMBEDS_DATA), { recursive: true });
    await fs.writeFile(EMBEDS_DATA, payload, "utf-8");
  } catch (e) {
    // If writing to data fails, we'll attempt to write to public below and ultimately bubble the error
    // so the caller can return an informative message.
    const err = e as Error;
    console.warn("Could not write to data/embeds.json:", err.message);
  }

  // Try to also update the public copy so static reads (if used) reflect the change.
  try {
    await fs.writeFile(EMBEDS_PUBLIC, payload, "utf-8");
  } catch (e) {
    // Most serverless hosts mount the deployment into a read-only filesystem (EROFS).
    // Log but don't treat this as catastrophic if the `data` write succeeded.
    const err = e as NodeJS.ErrnoException;
    if (err && err.code === "EROFS") {
      console.warn("Public folder is read-only; skipping public embeds.json update.", err.message);
      return;
    }
    // If writing to public failed for another reason, bubble up
    throw e;
  }
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
 