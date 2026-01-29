"use client";

import { useState } from 'react';

export default function EmbedForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return setError('Please enter a URL');

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/embeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const json = await res.json();

      if (json?.ok) {
        setSuccess('Embed added! Refresh the page to see it.');
        setUrl('');
      } else {
        setError(json?.error || 'Failed to add embed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to add embed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 mb-12">
      <div className="bg-purple-600/10 border border-purple-400/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Add Embed</h3>
        <p className="text-gray-400 text-sm mb-4">
          Paste a YouTube, Vimeo, or Instagram URL, or paste embed code (iframe, blockquote, script, etc.)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or full embed code like &lt;iframe&gt;..."
            className="w-full px-4 py-2 bg-gray-800 text-white border border-purple-400/30 rounded-lg focus:outline-none focus:border-purple-400 min-h-24 font-mono text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 hover:bg-purple-700 transition"
          >
            {loading ? 'Adding...' : 'Add Embed'}
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-900/20 text-red-400 rounded">{error}</div>}
        {success && (
          <div className="mt-4 p-3 bg-green-900/20 text-green-400 rounded">{success}</div>
        )}
      </div>
    </div>
  );
}
