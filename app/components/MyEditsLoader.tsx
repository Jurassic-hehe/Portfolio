"use client";

import { useEffect, useState } from 'react';
import MyEditsGrid from './MyEditsGrid';

export default function MyEditsLoader() {
  const [embeds, setEmbeds] = useState<string[] | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/embeds');
        const data = await res.json();
        if (mounted) setEmbeds(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setEmbeds([]);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!embeds) return <div>Loading edits…</div>;

  return <MyEditsGrid embeds={embeds} />;
}
