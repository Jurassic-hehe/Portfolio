import EmbedForm from "../components/EmbedForm";
import UnlockForm from "../UnlockForm";
import MyEditsGrid from "../components/MyEditsGrid";
import { cookies } from "next/headers";
import { readStore, writeStore } from "../../lib/devStore";

export const dynamic = "force-dynamic"; // ✅ REQUIRED

const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export default async function DevPage() {
const cookieStore = await cookies(); // ❌ WRONG
const sid = cookieStore.get("dev_session")?.value;

  // 🔒 Not unlocked
  if (!sid) {
    return <UnlockForm />;
  }

  const store = await readStore();
  const session = store.sessions?.[sid];
  const now = Date.now();

  // ⛔ Expired / invalid session
  if (!session || !session.expiresAt || session.expiresAt <= now) {
    if (session && store.sessions) {
      delete store.sessions[sid];
      await writeStore(store);
    }
    return <UnlockForm />;
  }

  // 🔄 Refresh session
  session.lastActive = now;
  session.expiresAt = now + SESSION_TIMEOUT_MS;
  store.sessions[sid] = session;
  await writeStore(store);

  // ✅ Correct embeds fetch (NO localhost, NO NEXTAUTH_URL)
  let embeds: string[] = [];
  try {
    const res = await fetch("/api/embeds", { cache: "no-store" });
    if (res.ok) {
      embeds = await res.json();
    }
  } catch (e) {
    console.error("Error fetching embeds for dev page:", e);
  }

  return (
    <>
      <EmbedForm />
      <div className="max-w-7xl mx-auto px-4">
        <MyEditsGrid embeds={embeds} />
      </div>
    </>
  );
}