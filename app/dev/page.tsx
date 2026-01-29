import EmbedForm from '../components/EmbedForm';
import UnlockForm from '../UnlockForm';
import MyEditsGrid from '../components/MyEditsGrid';
import { cookies } from 'next/headers';
import { readStore, writeStore } from '../../lib/devStore';

const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export default async function DevPage() {
  const cookieStore = await cookies();
  const sid = cookieStore.get('dev_session')?.value;

  if (!sid) return <UnlockForm />;

  const store = await readStore();
  const session = store.sessions?.[sid];
  const now = Date.now();
  if (!session || !session.expiresAt || session.expiresAt <= now) {
    // expired or invalid
    if (session && store.sessions) delete store.sessions[sid];
    await writeStore(store);
    return <UnlockForm />;
  }

  // Update lastActive and extend expiry to enforce inactivity timeout
  session.lastActive = now;
  session.expiresAt = now + SESSION_TIMEOUT_MS;
  store.sessions[sid] = session;
  await writeStore(store);

  // Load embeds for display (same as MyEdits page)
  async function getEmbeds(): Promise<string[]> {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/embeds`, { cache: 'no-store' });
      if (res.ok) return res.json();
    } catch (e) {
      console.error('Error fetching embeds for dev page:', e);
    }
    return [];
  }

  const embeds = await getEmbeds();

  return (
    <>
      <EmbedForm />
      <div className="max-w-7xl mx-auto px-4">
        <MyEditsGrid embeds={embeds} />
      </div>
      
    </>
  );
}
