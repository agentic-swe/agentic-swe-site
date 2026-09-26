#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright-core');
const ffmpegPath = require('ffmpeg-static');

const FPS = Number(process.env.FPS || 60);
const DURATION = 15;
const POSTER_TIME = 2.9;
const OUT = path.join(__dirname, 'out');
const MASTER = path.join(OUT, 'agentic-swe-showreel.mp4');
const PUBLIC_MEDIA = path.join(__dirname, '..', 'public', 'media');
const DEFAULT_CHROME = path.join(
  process.env.HOME || '',
  'Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
);

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  return fs.existsSync(DEFAULT_CHROME) ? DEFAULT_CHROME : undefined;
}

function ffmpeg(args, stdin) {
  const ff = spawn(ffmpegPath, ['-y', '-loglevel', 'error', ...args], { stdio: [stdin ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => ff.on('close', (c) => (c === 0 ? resolve() : reject(new Error(`ffmpeg exit ${c}`)))));
  return { ff, done };
}

async function openPage() {
  const browser = await chromium.launch({ executablePath: chromePath() });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'showreel.html'));
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(['700 64px Sora', '400 20px "JetBrains Mono"', '400 20px "IBM Plex Sans"'].map((f) => document.fonts.load(f)));
  });
  return { browser, page };
}

const renderAt = (page, t) => page.evaluate((tt) => window.render(tt), t);

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const { browser, page } = await openPage();

  if (process.argv.includes('--stills')) {
    for (const t of [0.9, 2.9, 5.0, 7.2, 9.0, 9.9, 11.8, 13.2, 14.8]) {
      await renderAt(page, t);
      await page.screenshot({ path: path.join(OUT, `still-${t.toFixed(1)}.jpg`), type: 'jpeg', quality: 85 });
    }
    await browser.close();
    console.log('stills written to', OUT);
    return;
  }

  const { ff, done } = ffmpeg([
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', MASTER,
  ], true);
  const total = FPS * DURATION;
  for (let i = 0; i < total; i++) {
    await renderAt(page, i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`frame ${i}/${total}\n`);
  }
  ff.stdin.end();
  await done;

  fs.mkdirSync(PUBLIC_MEDIA, { recursive: true });
  await renderAt(page, POSTER_TIME);
  await page.screenshot({ path: path.join(PUBLIC_MEDIA, 'agentic-swe-showreel-poster.jpg'), type: 'jpeg', quality: 82 });
  await browser.close();

  await ffmpeg([
    '-i', MASTER, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', path.join(PUBLIC_MEDIA, 'agentic-swe-showreel.mp4'),
  ]).done;
  console.log('wrote', MASTER, 'and web assets in', PUBLIC_MEDIA);
}

main().catch((e) => { console.error(e); process.exit(1); });
