'use client';

import { useEffect, useRef } from 'react';

export default function CodeRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Code rain setup
    const codeChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * canvas.height);

    let animationId: number;

    const animate = () => {
      // Clear canvas with pure black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Purple shades
      const purpleShades = [
        'rgba(168, 85, 247, 1)',
        'rgba(168, 85, 247, 0.9)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(124, 58, 237, 0.7)',
        'rgba(109, 40, 217, 0.5)',
      ];

      ctx.font = `bold ${fontSize}px 'Courier New', monospace`;

      // Draw rain
      for (let i = 0; i < columns; i++) {
        const char = codeChars[Math.floor(Math.random() * codeChars.length)];
        const color = purpleShades[Math.floor(Math.random() * purpleShades.length)];

        ctx.fillStyle = color;
        ctx.fillText(char, i * fontSize, drops[i]);

        // Reset when off screen
        if (drops[i] > canvas.height) {
          drops[i] = -fontSize;
        } else {
          drops[i] += 3;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.6,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}