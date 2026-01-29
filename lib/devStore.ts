import fs from 'fs/promises';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), 'data', 'dev-auth.json');
const IS_VERCEL = !!process.env.VERCEL;

declare global {
  // eslint-disable-next-line no-var
  var __DEV_STORE__: any;
}

function ensureGlobalStore() {
  if (!globalThis.__DEV_STORE__) globalThis.__DEV_STORE__ = { sessions: {}, attempts: {} };
}

export async function readStore() {
  if (IS_VERCEL) {
    ensureGlobalStore();
    return globalThis.__DEV_STORE__;
  }

  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { sessions: {}, attempts: {} };
  }
}

export async function writeStore(store: unknown) {
  if (IS_VERCEL) {
    // Persist to a per-instance in-memory store on Vercel (ephemeral)
    globalThis.__DEV_STORE__ = store;
    return;
  }

  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export const STORE_PATH_EXPORT = STORE_PATH;
