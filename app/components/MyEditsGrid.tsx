"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './MyEdits.module.css';

export default function MyEditsGrid({ embeds: initialEmbeds }: { embeds: string[] }) {
  const [embeds, setEmbeds] = useState(initialEmbeds);
  const [deleting, setDeleting] = useState<number | null>(null);
  const pathname = usePathname();
  const isDev = !!pathname && (pathname === '/dev' || pathname.startsWith('/dev'));

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      setTimeout(() => {
        try {
          // @ts-ignore
          if (window.instgrm?.Embeds?.process) {
            // @ts-ignore
            window.instgrm.Embeds.process();
          }
        } catch (e) {
          console.error('Instagram embed error:', e);
        }
      }, 500);
    };
  }, [embeds]);

  async function handleDelete(index: number) {
    if (!confirm('Delete this embed?')) return;

    setDeleting(index);
    try {
      const res = await fetch('/api/embeds/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ index }),
      });
      const json = await res.json();
      if (res.status === 401) {
        window.location.href = '/dev';
        return;
      }

      if (json?.ok) {
        setEmbeds(embeds.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  }

  function getYouTubeId(s: string) {
    const iframeMatch = s.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i);
    if (iframeMatch) return iframeMatch[1];
    const watchMatch = s.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return watchMatch[1];
    const shortMatch = s.match(/youtu\.be\/([-_a-zA-Z0-9]+)/i);
    if (shortMatch) return shortMatch[1];
    return null;
  }

  function getVimeoId(s: string) {
    const match = s.match(/vimeo\.com\/(\d+)/i);
    return match ? match[1] : null;
  }

  return (
    <div className={styles.grid}>
      {embeds.map((embed, idx) => {
        const trimmed = (embed || '').trim();
        const isRawHTML = /<iframe|<blockquote|<script|<div[^>]*(?:data-|class=)/i.test(trimmed);

        const embedContent = isRawHTML ? (
          <div
            dangerouslySetInnerHTML={{ __html: trimmed }}
            ref={(el) => {
              if (!el) return;
              if (/iframely/i.test(trimmed)) {
                setTimeout(() => {
                  try {
                    // @ts-ignore
                    if (window.iframely?.process) {
                      // @ts-ignore
                      window.iframely.process(el);
                    }
                  } catch (e) {}
                }, 100);
              }
            }}
          />
        ) : (() => {
          const ytId = getYouTubeId(trimmed);
          if (ytId) {
            return (
              <div className={styles.ratio}>
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={`YouTube video ${ytId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }

          const vimeoId = getVimeoId(trimmed);
          if (vimeoId) {
            return (
              <div className={styles.ratio}>
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}`}
                  title={`Vimeo video ${vimeoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }

          if (/instagram\.com/i.test(trimmed)) {
            const cleanUrl = trimmed.split('?')[0].replace(/\/$/, '') + '/';
            return (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={cleanUrl}
                  data-instgrm-version="14"
                />
              </div>
            );
          }

          return (
            <div className={styles.fallbackLink}>
              <p className="text-gray-400">Unsupported embed: {trimmed}</p>
            </div>
          );
        })();

        const isReel = !isRawHTML && /instagram\.com\/(reel|tv)\//.test(trimmed);

        return (
          <div
            key={idx}
            className={isReel ? styles.cardTall : styles.card}
            style={{ position: 'relative' }}
          >
            {embedContent}
            {isDev && (
              <button
                onClick={() => handleDelete(idx)}
                disabled={deleting === idx}
                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity disabled:opacity-50"
                title="Delete this embed"
              >
                {deleting === idx ? 'Deleting...' : '✕'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

