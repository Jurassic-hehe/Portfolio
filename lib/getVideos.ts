import fs from 'fs/promises';
import path from 'path';

export default async function getVideos(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), 'public', 'videos');
    await fs.mkdir(dir, { recursive: true });
    const files = await fs.readdir(dir);
    return files.filter((f) => /\.(mp4|webm|mov|m4v)$/i.test(f));
  } catch (e) {
    return [];
  }
}
