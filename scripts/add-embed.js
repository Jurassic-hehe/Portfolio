#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Usage: node scripts/add-embed.js <video-url>');
  process.exit(1);
}

const url = process.argv[2];
if (!url) usage();

const embedsPath = path.resolve(__dirname, '..', 'app', 'my-edits', 'embeds.json');

function isYouTube(u) {
  return /youtube\.com|youtu\.be/i.test(u);
}

function isInstagram(u) {
  return /instagram\.com\/(p|reel)\//i.test(u);
}

function normalizeYouTube(u) {
  // Keep original URL; MyEditsGrid will extract ID and embed
  return u.trim();
}

function normalizeInstagram(u) {
  // Keep only the permalink (no query) and ensure trailing slash
  return u.split('?')[0].replace(/\/$/, '') + '/';
}

let embeds = [];
try {
  const raw = fs.readFileSync(embedsPath, 'utf8');
  embeds = JSON.parse(raw || '[]');
} catch (e) {
  // create file if missing
  embeds = [];
}

let entry;
// If the input looks like raw embed HTML, accept it as-is
if (/^\s*</.test(url) && /<iframe|<blockquote/i.test(url)) {
  entry = url.trim();
} else if (isYouTube(url)) {
  entry = normalizeYouTube(url);
} else if (isInstagram(url)) {
  entry = normalizeInstagram(url);
} else {
  console.error('Unsupported input. Provide a YouTube/Instagram URL or an embed snippet.');
  process.exit(2);
}

// avoid duplicates (simple string match)
if (embeds.includes(entry)) {
  console.log('Embed already exists in embeds.json');
  process.exit(0);
}

// add to beginning
embeds.unshift(entry);

fs.writeFileSync(embedsPath, JSON.stringify(embeds, null, 2) + '\n', 'utf8');
console.log('Added embed to', embedsPath);
