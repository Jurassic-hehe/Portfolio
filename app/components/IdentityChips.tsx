/**
 * IdentityChips - Subtle personal brand elements
 * Displays your roles/passions with icons and text
 * Use sparingly throughout the site
 */

export default function IdentityChips({ variant = 'compact' }: { variant?: 'compact' | 'full' }) {
  const identities = [
    { icon: '🎮', label: 'Gamer' },
    { icon: '🎙️', label: 'Streamer' },
    { icon: '🏃', label: 'Athlete' },
    { icon: '🎤', label: 'Singer' },
    { icon: '✂️', label: 'Creator' },
    { icon: '🎬', label: 'Editor' },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {identities.map((item) => (
          <div
            key={item.label}
            className="px-2 py-1 bg-purple-600/10 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300 hover:bg-purple-600/20 hover:border-purple-500/50 transition-all duration-300"
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    );
  }

  // Full variant - more visible
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      {identities.map((item) => (
        <div
          key={item.label}
          className="px-3 py-2 bg-purple-600/15 border border-purple-500/40 rounded-lg text-sm font-semibold text-purple-300 hover:bg-purple-600/25 hover:border-purple-500/60 transition-all duration-300"
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}
