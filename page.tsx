import PersonalBranding from '../components/PersonalBranding';
export const dynamic = "force-dynamic";

// YouTube API key you provided
const YT_API_KEY = process.env.YOUTUBE_API_KEY ?? "AIzaSyClEG-nlJXdiVIHuaQ2BkwtJhTX576dRZY";
const CHANNEL_HANDLE = "Jurassic00"; // the @ handle

// 1️⃣ Get the uploads playlist ID for the channel
async function getUploadsPlaylistId(handle) {
  // YouTube Data API: search channel by handle
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${handle}&key=${YT_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items?.length) return null;
  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

// 2️⃣ Get top 10 videos from that playlist
async function getTop10Videos(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${YT_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) return [];

  return data.items.map(item => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
  }));
}

export default async function MyEditsPage() {
  const uploadsPlaylist = await getUploadsPlaylistId(CHANNEL_HANDLE);
  const videos = uploadsPlaylist ? await getTop10Videos(uploadsPlaylist) : [];

  return (
    <div className="w-full bg-black text-white">
      <section className="relative w-full py-20 px-4">
        <PersonalBranding type="divider" />

        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black mb-4">My Edits</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Here are the top 10 edits from my YouTube channel.
          </p>
        </div>

        {/* —————— YouTube Embeds —————— */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {videos.length > 0 ? (
            videos.map(({ videoId, title }) => (
              <iframe
                key={videoId}
                className="w-full aspect-video rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ))
          ) : (
            <div className="text-gray-400 text-center col-span-full">
              Unable to load videos.
            </div>
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
