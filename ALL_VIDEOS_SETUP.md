# All Videos Page - Complete Documentation

## 📋 Overview

The `/all-videos` page is a professional video portfolio showcase that displays all your content in a clean, responsive grid layout. It includes:

- **Hero Banner Section** with cinematic animations
- **Responsive Video Grid** supporting multiple aspect ratios
- **Premium Typography** using JetBrains Mono
- **Interactive Hover Effects** with glow and scale
- **Navigation Integration** from homepage marquee
- **One-Click External Links** to Instagram/external platforms

## 🎯 Key Features

### 1. **No Video Cropping**
- Uses `object-fit: contain` to preserve aspect ratios
- Supports 16:9, 9:16, and any custom ratio
- No stretching or clipping

### 2. **Navigation Integration**
```
Homepage (/) 
  ↓ Click any marquee video
/all-videos 
  ↓ Click any grid video
Instagram (external link in new tab)
```

### 3. **Responsive Grid**
- **Desktop (2xl+):** 4 columns
- **Desktop (lg):** 3 columns
- **Tablet (sm):** 2 columns
- **Mobile:** 1 column

### 4. **Premium Typography**
- Google Fonts: **JetBrains Mono** (monospace)
- Used for titles, badges, and descriptions
- Tech-forward, creator-focused aesthetic

### 5. **Smooth Animations**
- Fade-in on page load (staggered delays)
- Hover glow effects (purple/violet)
- Scale up on interaction
- No motion sickness (smooth easing)

## 🗂️ File Structure

```
app/
├── all-videos/
│   └── page.tsx          (NEW - All Videos page + VideoGridCard component)
├── components/
│   ├── VideoCard.tsx     (UPDATED - For marquee only)
│   ├── VideoMarquee.tsx  (UPDATED - Now navigates to /all-videos)
│   └── VideoMarquee.module.css
├── globals.css           (UPDATED - Added JetBrains Mono + fade-in animation)
└── page.tsx              (Unchanged - homepage)
```

## 📦 Component Details

### `/all-videos/page.tsx`

**Main Sections:**

1. **Navigation Bar** (sticky)
   - Back button to home
   - Page title

2. **Hero Banner**
   - Full-width animated intro
   - Gradient text
   - JetBrains Mono typography
   - Fade-in animations with staggered delays

3. **Video Grid**
   - Responsive columns
   - `VideoGridCard` component for each video
   - Adapts to any aspect ratio

4. **VideoGridCard Component**
   - Clickable button (opens Instagram URL)
   - Video with autoplay, muted, loop
   - Hover effects: glow, overlay, scale
   - Title and index badge
   - "Open →" indicator on hover

5. **Footer CTA**
   - Call-to-action
   - Links to Instagram and home

### Navigation Flow

**From Homepage Marquee:**
```tsx
// VideoMarquee.tsx
const handleVideoClick = (index: number) => {
  router.push(`/all-videos?highlight=${index}`);
};
```

**From All Videos Grid:**
```tsx
// VideoGridCard onClick
window.open(video.url, '_blank', 'noopener,noreferrer');
```

## 🎨 Styling Details

### Colors (Purple Theme)
```css
Gradient: from-purple-200 via-pink-200 to-purple-200
Backgrounds: purple-600/20, violet-600/20
Glows: rgba(168, 85, 247, ...)
Borders: purple-400/30 to purple-400/60
```

### Typography
```css
Hero: text-6xl md:text-7xl (font-black)
Title: font-jetbrains text-base (JetBrains Mono)
Badge: font-jetbrains font-bold text-sm
```

### Video Container
```css
aspectRatio: auto;
object-fit: contain;
backgroundColor: #000000;
```

## 🔧 Customization Guide

### Change Video Data

Edit the `videos` array in `/all-videos/page.tsx`:

```tsx
const videos: Video[] = [
  {
    src: '/videos/v1.mp4',
    title: 'Your Title',
    url: 'https://instagram.com/p/YOUR_POST_ID/',
  },
  // ...
];
```

### Modify Grid Columns

In `/all-videos/page.tsx`, update the grid className:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
```

Options:
- `grid-cols-1` - Single column
- `grid-cols-2` - Two columns
- `grid-cols-3` - Three columns
- `grid-cols-4` - Four columns
- `grid-cols-5` - Five columns

### Adjust Spacing

```tsx
<div className="grid ... gap-6">
  {/* gap-4 = small, gap-6 = medium, gap-8 = large */}
</div>
```

### Change Animation Duration

In `globals.css`:

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Update animation-duration in .animate-fade-in */
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards; /* Change 0.6s */
}
```

Or inline in JSX:

```tsx
style={{ animationDelay: '0.1s' }} // Stagger delays
```

### Customize Hero Text

Edit in `/all-videos/page.tsx`:

```tsx
<h1>Every Frame,<br />Every Story</h1>
<p>Your custom description here...</p>
<span>📹 Videos • 🎬 Creativity</span>
```

## 🚀 Performance Tips

1. **Lazy-load videos** for faster initial load
2. **Optimize video files** (.mp4 compression)
3. **Use WebP format** alongside .mp4
4. **Monitor Core Web Vitals** in DevTools

Example optimization:
```html
<video preload="lazy">
  <source src="/videos/v1.webp" type="video/webp">
  <source src="/videos/v1.mp4" type="video/mp4">
</video>
```

## 🔗 URL Query Params (Future Enhancement)

Currently set up for highlight parameter (not yet implemented):

```
/all-videos?highlight=0  (scroll to video #1)
```

To implement, add in page.tsx:

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function AllVideos() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');
  
  // Use highlightId to scroll to specific video
}
```

## 🎬 Video Requirements

### Supported Formats
- ✅ MP4 (H.264 codec)
- ✅ WebM (VP9 codec)
- ✅ Mov (QuickTime)

### Specifications
- **Recommended bitrate:** 1-5 Mbps
- **Resolution:** 1080p or higher
- **Frame rate:** 24, 30, or 60 fps
- **Audio:** Muted (no sound on autoplay)

### Best Practices
- Keep file sizes under 10MB
- Use hardware acceleration
- Test on mobile devices
- Consider Data Saver mode users

## 🧪 Testing Checklist

- [ ] Page loads without errors
- [ ] Grid responsive on mobile/tablet/desktop
- [ ] Videos don't crop or stretch
- [ ] Hover effects work smoothly
- [ ] Clicking videos opens Instagram in new tab
- [ ] Navigation from home to /all-videos works
- [ ] Animations perform well (<60ms)
- [ ] No console errors
- [ ] Accessibility: keyboard navigation works
- [ ] Focus states visible on buttons

## 📱 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ 90+ | Full support |
| Firefox | ✅ 88+ | Full support |
| Safari | ✅ 14+ | Full support |
| Edge | ✅ 90+ | Full support |
| Mobile (iOS) | ✅ 14+ | Autoplay limited |
| Mobile (Android) | ✅ 8+ | Autoplay limited |

**Note:** iOS doesn't autoplay videos with sound, which is why `muted` is critical.

## 🎯 Features Roadmap

- [ ] Infinite scroll pagination
- [ ] Search/filter videos by tag
- [ ] Video lightbox viewer
- [ ] Share button on video cards
- [ ] Analytics tracking
- [ ] Dark/light mode toggle
- [ ] Video upload feature

## 🐛 Common Issues

### Videos Not Showing
```
✅ Check: /public/videos/ folder
✅ Check: Video file paths (case-sensitive)
✅ Check: Browser console for errors
```

### Grid Responsive Issues
```
✅ Check: Tailwind config for breakpoints
✅ Check: CSS grid-cols- classes
✅ Check: Container max-width
```

### Hover Effects Not Working
```
✅ Check: CSS module import
✅ Check: will-change property
✅ Check: z-index layering
```

### Videos Cropped
```
✅ Check: object-fit: contain (not cover)
✅ Check: aspectRatio: auto
✅ Check: Video dimensions in browser DevTools
```

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify video file paths
3. Test on different browsers
4. Review file structure
5. Check Tailwind CSS configuration

## 📄 Version History

**v1.0** (Jan 19, 2026)
- Initial release
- Hero banner with fade-in animations
- Responsive grid layout
- JetBrains Mono typography
- Navigation from marquee
- Instagram link integration

---

**Next.js:** 16.1.3  
**React:** 19.2.3  
**Tailwind:** 4.x  
**Font:** JetBrains Mono via Google Fonts
