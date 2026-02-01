"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoCard({ filename }: { filename: string }) {
  const router = useRouter();
  const vidRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div
      onClick={() => router.push('/my-edits')}
      className="w-72 h-40 bg-black rounded-lg overflow-hidden shadow-lg cursor-pointer flex-shrink-0"
    >
      <video
        ref={vidRef}
        src={`/api/videos/stream/${filename}`}
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
