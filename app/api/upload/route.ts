import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    // 🔐 DEV UNLOCK CHECK (PRIMARY AUTH)
    const cookieStore = await cookies();
    const unlocked = cookieStore.get("dev_unlocked")?.value === "1";

    if (!unlocked) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    const form = await request.formData();

    // 🔒 OPTIONAL extra protection (can be removed if not needed)
    const uploadSecret = process.env.UPLOAD_SECRET;
    if (uploadSecret) {
      const provided = form.get("secret");
      if (!provided || String(provided) !== uploadSecret) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // 📁 FILE VALIDATION
    const file = form.get("file") as unknown;
    if (
      !file ||
      typeof (file as { arrayBuffer?: unknown }).arrayBuffer !== "function"
    ) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // 💾 READ FILE
    const arrayBuffer = await (
      file as { arrayBuffer: () => Promise<ArrayBuffer> }
    ).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 📂 SAVE LOCATION
    const uploadsDir = path.join(process.cwd(), "public", "videos");
    await fs.mkdir(uploadsDir, { recursive: true });

    const rawName =
      (file as { name?: string }).name || `upload-${Date.now()}.mp4`;
    const safeName = `${Date.now()}-${rawName.replace(
      /[^a-zA-Z0-9._-]/g,
      "-"
    )}`;
    const dest = path.join(uploadsDir, safeName);

    await fs.writeFile(dest, buffer);

    return NextResponse.json({ ok: true, filename: safeName });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unknown error";
    console.error("Upload error:", errorMsg, e);
    return NextResponse.json(
      { error: `Upload failed: ${errorMsg}` },
      { status: 500 }
    );
  }
}