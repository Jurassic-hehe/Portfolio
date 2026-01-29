import MyEditsGrid from '../components/MyEditsGrid';
import PersonalBranding from '../components/PersonalBranding';
export const dynamic = "force-dynamic";

async function getEmbeds(): Promise<string[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/embeds`, { cache: 'no-store' });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.error('Error fetching embeds:', e);
  }
  return [];
}

export default async function MyEditsPage() {
  const embeds = await getEmbeds();

  return (
    <div className="w-full">
      <section className="relative w-full py-20 px-4">
        <PersonalBranding type="divider" />

        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">My Edits</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            I publish edits on YouTube and Instagram. Below are embedded videos copied from those platforms.
          </p>
        </div>

        {/* Embed form moved to a developer-only page */}

        <div className="max-w-7xl mx-auto px-4">
          <MyEditsGrid embeds={embeds} />
        </div>
      </section>
    </div>
  );
}
