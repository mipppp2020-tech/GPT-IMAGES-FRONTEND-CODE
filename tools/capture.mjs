import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';
import { SCREENS, VIEWPORT } from './screens.mjs';

const BASE = process.env.AIEC_BASE ?? 'http://127.0.0.1:4173';
const OUT = '.artifacts/shots';

/**
 * Renders every screen at the canonical viewport.
 *
 * Two images per screen:
 *   <id>.png       viewport-clipped 430x932 — what the reference frames
 *   <id>.full.png  full scroll height — used to check nothing is clipped
 */
// The environment preinstalls Chromium; point Playwright at it directly
// rather than downloading a matching build.
const browser = await chromium.launch({
  executablePath: process.env.AIEC_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const page = await browser.newPage({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
});

for (const s of SCREENS) {
  await page.goto(`${BASE}/#${s.path}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);

  await page.screenshot({ path: `${OUT}/${s.id}.png` });
  await page.screenshot({ path: `${OUT}/${s.id}.full.png`, fullPage: true });
  console.log(`captured ${s.id}`);
}

await browser.close();
