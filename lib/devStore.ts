// devStore removed — filesystem sessions are no longer used.
// This file remains as a harmless stub to avoid import errors during transition.
export async function readStore() {
  return { sessions: {}, attempts: {} };
}
export async function writeStore() {
  return;
}
export const STORE_PATH_EXPORT = '';
