import PersonalBranding from '../../components/PersonalBranding';
import RainOverlay from '../../components/CodeRainBackground';
import fs from 'fs/promises';
import path from 'path';
export const dynamic = "force-dynamic";

async function loadEmbeds(): Promise<string[]> {
  const EMBEDS_DATA = path.join(process.cwd(), 'data', 'embeds.json');
  const EMBEDS_PUBLIC = path.join(process.cwd(), 'public', 'embeds.json');

  try {
    const data = await fs.readFile(EMBEDS_DATA, 'utf-8');
    return JSON.parse(data);
  } catch {
    try {
      const data = await fs.readFile(EMBEDS_PUBLIC, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

export default async function MyEditsPage() {
  const embeds = await loadEmbeds();

  return (
    <div className="w-full bg-black text-white min-h-screen relative">
      <RainOverlay />
      <section className="relative w-full py-20 px-4 z-10">
        <PersonalBranding type="divider" />

        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black mb-4">My Edits</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Here are the top 10 edits from my YouTube channel.
          </p>
        </div>

        {/* —————— YouTube Embeds —————— */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {embeds.length > 0 ? (
            embeds.map((entry, i) => {
              const trimmed = (entry || '').trim();
              const isRawHTML = /<iframe|<blockquote|<script|<div[^>]*>/i.test(trimmed);

              if (isRawHTML) {
                return (
                  <div
                    key={i}
                    className="w-full aspect-video rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: trimmed }}
                  />
                );
              }

              // Extract YouTube video ID from common URL formats
              const ytMatch = trimmed.match(/(?:v=|embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
              if (ytMatch) {
                const videoId = ytMatch[1];
                return (
                  <iframe
                    key={i}
                    className="w-full aspect-video rounded-lg"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`YouTube video ${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                );
              }

              // Unsupported entry fallback
              return (
                <div key={i} className="text-gray-400 text-center col-span-full">
                  Unsupported embed: {trimmed}
                </div>
              );
            })
          ) : (
            <div className="text-gray-400 text-center col-span-full">Unable to load videos.</div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-400 mb-4">
            Visit my YouTube or Instagram to view more edits.
          </div>
        </div>
      </section>
    </div>
  );
}




