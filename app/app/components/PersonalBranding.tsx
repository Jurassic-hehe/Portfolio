/**
 * PersonalBranding - Subtle taglines and personal identity markers
 * Use in footers, headers, or between sections
 */

export default function PersonalBranding({ type = 'footer' }: { type?: 'footer' | 'header' | 'divider' }) {
  const taglines = [
    'Gamer, streamer, and content creator',
    'Gaming, streaming, and creating',
    'Streaming the good stuff',
    'Gaming • Streaming • Creating',
    'Made by a gamer who streams',
  ];

  // Pick a random tagline for variety
  const tagline = taglines[Math.floor(Math.random() * taglines.length)];

  if (type === 'footer') {
    return (
      <div className="text-center space-y-2">
        <p className="text-purple-400/80 text-sm font-medium">{tagline}</p>
        <p className="text-gray-500 text-xs">
          Gamer • Streamer • Athlete • Singer • Creator • Editor
        </p>
      </div>
    );
  }

  if (type === 'header') {
    return (
      <div className="text-center mb-8">
        <p className="text-purple-300 text-sm font-semibold uppercase tracking-widest">
          ✨ {tagline} ✨
        </p>
      </div>
    );
  }

  // divider
  return (
    <div className="flex items-center gap-4 my-12 opacity-60">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <p className="text-purple-400/70 text-xs font-medium">{tagline}</p>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </div>
  );
}
