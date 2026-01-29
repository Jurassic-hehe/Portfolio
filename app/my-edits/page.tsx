import PersonalBranding from '../components/PersonalBranding';
export const dynamic = "force-dynamic";

export default async function MyEditsPage() {
  return (
    <div className="w-full">
      <section className="relative w-full py-20 px-4">
        <PersonalBranding type="divider" />

        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">My Edits</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Edits are published on YouTube and Instagram. Embedded previews have been removed.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-400">Visit my YouTube or Instagram to view edits.</div>
        </div>
      </section>
    </div>
  );
}
