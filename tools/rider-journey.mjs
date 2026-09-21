import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';

/**
 * The rider's day, start to end, in a real browser — one screenshot per
 * action. Navigation is in-app throughout, because a reload would discard
 * session state and the walk would no longer be a single continuous day.
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
  await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${label}.png` });
  console.log(`${String(n).padStart(2, '0')}  ${label.padEnd(24)} ${p.url().replace(BASE + '/#', '') || '/'}`);
}
async function tap(name, label, role = 'button') {
  await p.getByRole(role, { name }).first().click({ timeout: 5000 });
  await p.waitForTimeout(380);
  await shot(label);
}

await p.goto(BASE + '/#/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(300);
await shot('01-home-before-ride');

await tap(/राईड सुरू करा/, '02-ride-started');
await tap(/लीड कॅप्चर करा/, '03-capture-opened');

for (let i = 1; i <= 3; i++) {
  await p.locator('.aiec-shutter').click();
  await p.waitForTimeout(260);
  await shot(`0${3 + i}-photo-${i}-taken`);
}

await tap(/सबमिट करा/, '07-lead-submitted');
await p.getByRole('link', { name: /माझे लीड्स/ }).first().click();
await p.waitForTimeout(420);
await shot('08-new-lead-in-list');

await tap(/तपशील पहा/, '09-lead-detail');
await p.getByRole('link', { name: /कमाई/ }).first().click();
await p.waitForTimeout(420);
await shot('10-earnings-credited');

// The failure paths a rider actually hits (PRD 8.3).
await p.getByRole('link', { name: /मुख्य स्क्रीन/ }).first().click();
await p.waitForTimeout(350);
await p.getByRole('button', { name: /लीड कॅप्चर करा/ }).first().click();
await p.waitForTimeout(350);
for (let i = 0; i < 3; i++) { await p.locator('.aiec-shutter').click(); await p.waitForTimeout(160); }
await tap(/डुप्लिकेट म्हणून पाठवा/, '11-duplicate-blocked');
await tap(/GPS बंद करा/, '12-gps-off');

await b.close();
console.log(`\n${n} screenshots in ${OUT}`);
