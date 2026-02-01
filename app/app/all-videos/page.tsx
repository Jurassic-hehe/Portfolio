'use client';

import { useState } from 'react';
import Link from 'next/link';
import PersonalBranding from '../components/PersonalBranding';

interface Video {
  src: string;
  title: string;
  url: string;
}

/**
 * All Videos Page
 * Displays complete video portfolio in a professional grid layout
 * Supports both 16:9 and 9:16 aspect ratios
 */
export default function AllVideos() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 text-center">
      <h1 className="text-4xl font-bold text-white mb-6">My video collection has moved</h1>
      <p className="text-gray-400 mb-8">
        The local video gallery has been removed. All edits are now embedded from YouTube and Instagram on the My Edits page.
      </p>
      <div>
        <a
          href="/my-edits"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg font-semibold"
        >
          Go to My Edits
        </a>
      </div>
    </div>
  );
}

/**
 * VideoGridCard Component
 * Individual video card for grid display
 * Supports any aspect ratio without cropping
 */
interface VideoGridCardProps {
  video: Video;
  index: number;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}

// Video grid removed — page now redirects users to the central My Edits page.
