import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';

/**
 * Drives the rider journey in a real browser and screenshots every action.
 * Each shot is the 430x932 viewport — what the rider actually sees.
 */
const BASE = 'http://127.0.0.1:4173';
const OUT = '.artifacts/journey';
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });

let n = 0;
async function shot(label) {
  n++;
  const file = `${OUT}/${String(n).padStart(2, '0')}-${label}.png`;
  await p.screenshot({ path: file });
  console.log(`${String(n).padStart(2, '0')}  ${label.padEnd(26)} ${p.url().replace(BASE, '') || '/'}`);
  return file;
}

async function tap(name, label) {
  const el = p.getByRole('button', { name }).or(p.getByRole('link', { name })).first();
  await el.click({ timeout: 4000 });
  await p.waitForTimeout(350);
  await shot(label);
}

await p.goto(BASE + '/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(300);
await shot('home-ride-map');

// 1. Start a capture from the nearest opportunity on the map screen.
await tap(/लीड कॅप्चर करा/, 'tap-capture-lead');

// 2. The shutter.
await p.locator('.aiec-shutter').click();
await p.waitForTimeout(350);
await shot('after-shutter');

// 3. Site photos step.
await tap(/पुढील करा/, 'photos-continue');

// 4. Payout method.
await tap(/सबमिट करा/, 'payout-submit');

// 5. Back to home from the confirmation.
await tap(/मुख्य स्क्रीनवर जा/, 'back-to-home');

// 6. My Leads via the tab bar.
await p.getByRole('link', { name: /माझे लीड्स/ }).click();
await p.waitForTimeout(400);
await shot('my-leads');

// 7. Open a lead.
await tap(/तपशील पहा/, 'lead-detail');

// 8. Earnings tab.
await p.getByRole('link', { name: /कमाई/ }).click();
await p.waitForTimeout(400);
await shot('earnings');

// 9. The money journey behind it.
await tap(/लीडपासून NOC/, 'money-pipeline');

await b.close();
console.log(`\n${n} screenshots in ${OUT}`);
