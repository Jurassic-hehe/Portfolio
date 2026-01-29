"use client";

import { useState } from 'react';

export default function UnlockForm() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/dev/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ secret }),
      });
      let json: any = null;
      try {
        json = await res.json();
      } catch (err) {
        json = { ok: res.ok, error: `Request failed with status ${res.status}` };
      }
      if (json?.ok) {
        // Reload to let server render the form
        window.location.reload();
      } else {
        setError(json?.error || 'Invalid secret');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-4">Developer Access</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter developer password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white border rounded"
        />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded">
          {loading ? 'Unlocking...' : 'Unlock'}
        </button>
        {error && <div className="text-red-400">{error}</div>}
      </form>
    </div>
  );
}
