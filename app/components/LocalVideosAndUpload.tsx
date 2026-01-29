"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function LocalVideosAndUpload() {
  const [videos, setVideos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const pathname = usePathname();
  const isDev = !!pathname && (pathname === '/dev' || pathname.startsWith('/dev'));

  async function load() {
    try {
      const res = await fetch('/api/videos', { credentials: 'same-origin' });
      if (res.status === 401) {
        window.location.href = '/dev';
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setVideos(data);
    } catch (e) {
      console.error('Load videos error:', e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get('file') as File | null;
    if (!file) return setError('Pick a file first');
    
    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    setUploading(true);
    try {
      const up = new FormData();
      up.append('file', file);
      const secretInput = form.querySelector('input[name=secret]') as HTMLInputElement | null;
      if (secretInput && secretInput.value) {
        up.append('secret', secretInput.value);
      }
      console.log('Sending upload request to /api/upload');
        const res = await fetch('/api/upload', { method: 'POST', body: up, credentials: 'same-origin' });
      if (res.status === 401) {
        window.location.href = '/dev';
        return;
      }
      console.log('Response status:', res.status);
      const json = await res.json();
      console.log('Response JSON:', json);
      if (json?.ok) {
        console.log('Upload successful, reloading videos');
        setSuccess('Video uploaded successfully!');
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure file is written
        await load();
        const input = form.querySelector('input[type=file]') as HTMLInputElement;
        if (input) {
          input.value = '';
          console.log('Cleared file input');
        }
        setFileSelected(false);
        console.log('Reset file selection state');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(json?.error || 'Upload failed');
        console.error('Upload error response:', json);
      }
    } catch (err) {
      console.error('Upload catch error:', err);
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(filename: string) {
    if (!confirm(`Delete ${filename}?`)) return;
    
    setDeleting(filename);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch('/api/videos/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
          credentials: 'same-origin',
      });
      if (res.status === 401) {
        window.location.href = '/dev';
        return;
      }
      
      const json = await res.json();
      
      if (json?.ok) {
        setSuccess(`Deleted ${filename}`);
        await load();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(json?.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Local Uploads</h2>
        <form onSubmit={handleUpload} className="flex items-center gap-3">
          <input
            accept="video/*"
            name="file"
            type="file"
            className="text-sm text-gray-200"
            onChange={(e) => setFileSelected(!!e.currentTarget.files && e.currentTarget.files.length > 0)}
          />
          <input
            name="secret"
            type="password"
            placeholder="Upload password"
            className="ml-2 px-2 py-1 text-sm text-gray-900 rounded"
          />
          <button type="submit" disabled={uploading || !fileSelected} className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {error && <div className="text-red-400 mb-4 p-3 bg-red-900/20 rounded">{error}</div>}
      {success && <div className="text-green-400 mb-4 p-3 bg-green-900/20 rounded">{success}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {videos.length === 0 && <div className="text-gray-400">No local videos found.</div>}
        {videos.map((v) => (
          <div key={v} className="rounded overflow-hidden bg-black relative group">
            <video src={`/api/videos/stream/${v}`} controls className="w-full h-40 object-cover" />
            {isDev && (
              <button
                onClick={() => handleDelete(v)}
                disabled={deleting === v}
                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                {deleting === v ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
