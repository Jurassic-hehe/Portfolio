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
      "use client";

      // Local uploads have been removed — keep a harmless stub so imports don't break.
      export default function LocalVideosAndUpload() {
        return null;
      }
        await load();
