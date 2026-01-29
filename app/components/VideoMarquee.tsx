"use client";

import { useEffect, useState } from 'react';
import VideoCard from './VideoCard';

export default function VideoMarquee() {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/videos')
      .then((r) => {
        if (r.status === 401) {
          window.location.href = '/dev';
          throw new Error('unauthorized');
        }
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setVideos(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-white mb-6">Featured Clips</h3>

        <div className="overflow-hidden">
          <div className="marquee-viewport">
            <div className="marquee-track animate-marquee" style={{ willChange: 'transform' }}>
            {videos.map((v) => (
              <VideoCard key={v} filename={v} />
            ))}
            {/** duplicate for smooth looping */}
            {videos.map((v) => (
              <VideoCard key={`${v}-dup`} filename={v} />
            ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-viewport {
          overflow: hidden;
          background: linear-gradient(to right, rgba(0,0,0,0.3), transparent 10%, transparent 90%, rgba(0,0,0,0.3));
        }
        .marquee-track {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          white-space: nowrap;
        }
        .marquee-track > * {
          flex: 0 0 auto;
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          animation-timing-function: linear;
        }
        .marquee-viewport:hover .animate-marquee {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
