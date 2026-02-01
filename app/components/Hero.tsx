'use client';

import { useState, useEffect } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animations on mount
    setIsAnimated(true);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Content Container */}
      <div className={styles.container}>
        {/* Banner Image */}
        <div className={`${styles.bannerWrapper} ${isAnimated ? styles.fadeIn : ''}`}>
          <img
            src="/banner.gif"
            alt="banner"
            className={styles.bannerImage}
          />
          <div className={styles.imageShadow} />
        </div>

        {/* Headline Text */}
        <div className={`${styles.textSection} ${isAnimated ? styles.slideUp : ''}`}>
          <h1 className={styles.headline}>
            Streamer <span className={styles.ampersand}>&</span> Content Creator
            <br />
            <span className={styles.cursor}>Creating</span> awesome content
          </h1>
          <p className={styles.subheadline}>
            Streaming, gaming, creating, and having fun with it all
          </p>
        </div>

        {/* CTA removed per request */}
      </div>

      {/* Glow Elements */}
      <div className={styles.glowBall + ' ' + styles.glowBall1} />
      <div className={styles.glowBall + ' ' + styles.glowBall2} />
    </section>
  );
}
