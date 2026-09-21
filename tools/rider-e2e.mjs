import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';

/**
 * Proves the rider loop is a workflow, not a slideshow:
 * capture a lead -> it exists in My Leads -> the wallet grew by the rate.
 */
const BASE = 'http://127.0.0.1:4173';
const OUT = '.artifacts/e2e';
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
let n = 0;
const shot = async (l) => { n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2,'0')}-${l}.png` }); };

// Navigate IN-APP, never via goto: a full reload would discard in-memory
// session state and the measurement would be of the reload, not the capture.
const tap = async (name) => {
  await p.getByRole('link', { name }).first().click();
  await p.waitForTimeout(400);
};
const readWallet = async () => {
  await tap(/कमाई/);
  const txt = await p.locator('.aiec-moneymeter__amount').innerText();
  return txt.replace(/[^\d]/g, '');
};
const countLeads = async () => {
  await tap(/माझे लीड्स/);
  return p.locator('.aiec-entity__title').count();
};

await p.goto(BASE + '/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await shot('home-before');

const walletBefore = await readWallet();
const leadsBefore = await countLeads();
console.log(`BEFORE  wallet total ₹${walletBefore}   leads ${leadsBefore}`);

// Start the ride, then capture: three shots and submit.
await tap(/मुख्य स्क्रीन/);
await p.getByRole('button', { name: /राईड सुरू करा/ }).click();
await p.waitForTimeout(250);
await shot('ride-started');

await p.getByRole('button', { name: /लीड कॅप्चर करा/ }).first().click();
await p.waitForTimeout(350);
await shot('capture-empty');

for (let i = 1; i <= 3; i++) {
  await p.locator('.aiec-shutter').click();
  await p.waitForTimeout(220);
  await shot(`shot-${i}`);
}

await p.getByRole('button', { name: /सबमिट करा/ }).click();
await p.waitForTimeout(450);
await shot('submitted');
console.log(`after submit, url = ${p.url().replace(BASE, '')}`);

const walletAfter = await readWallet();
await shot('earnings-after');
const leadsAfter = await countLeads();
await shot('leads-after');
console.log(`AFTER   wallet total ₹${walletAfter}   leads ${leadsAfter}`);

const grew = Number(walletAfter) - Number(walletBefore);
console.log(`\nwallet grew by ₹${grew} (expect 40)`);
console.log(`leads grew by ${leadsAfter - leadsBefore} (expect 1)`);

// Duplicate must be blocked and must NOT pay.
await tap(/मुख्य स्क्रीन/);
await p.getByRole('button', { name: /लीड कॅप्चर करा/ }).first().click();
await p.waitForTimeout(350);
for (let i = 0; i < 3; i++) { await p.locator('.aiec-shutter').click(); await p.waitForTimeout(150); }
await p.getByRole('button', { name: /डुप्लिकेट म्हणून पाठवा/ }).click();
await p.waitForTimeout(400);
await shot('duplicate-blocked');
const dupVisible = await p.getByText(/ही साइट आधीच नोंदवली आहे/).isVisible().catch(() => false);
const walletAfterDup = await readWallet();
console.log(`duplicate blocked on screen: ${dupVisible}`);
console.log(`wallet after duplicate ₹${walletAfterDup} (must equal ₹${walletAfter})`);

// A reload must not lose the rider's day (offline-first requirement).
const beforeReload = await readWallet();
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(400);
const afterReload = await p.locator('.aiec-moneymeter__amount').innerText();
console.log(`wallet before reload ₹${beforeReload}, after reload ₹${afterReload.replace(/[^\d]/g, '')}`);

await b.close();
