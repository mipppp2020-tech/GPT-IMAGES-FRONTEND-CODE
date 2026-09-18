import { chromium } from 'playwright';

/**
 * Clicks every control on every rider route and reports which ones do
 * nothing. "Does nothing" = no URL change and no DOM change after the click.
 * This is the only honest way to find dead ends; reading JSX finds handlers,
 * not outcomes.
 */
const BASE = 'http://127.0.0.1:4173';
const ROUTES = [
  ['/', 'R1 Ride Map (home)'],
  ['/capture', 'R2 Capture'],
  ['/photos', 'R2b Site photos'],
  ['/payout', 'R2c Payout'],
  ['/success', 'R2d Submitted'],
  ['/leads', 'R3 My Leads'],
  ['/leads/l1', 'R3b Lead detail'],
  ['/earnings', 'R5 Earnings'],
  ['/notifications', 'Notifications'],
  ['/profile', 'Profile'],
];

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const results = [];

for (const [route, name] of ROUTES) {
  const p = await b.newPage({ viewport: { width: 430, height: 932 } });
  await p.goto(BASE + route, { waitUntil: 'networkidle' });

  const count = await p.locator('button, a[href]').count();
  const dead = [];
  for (let i = 0; i < count; i++) {
    const page = await b.newPage({ viewport: { width: 430, height: 932 } });
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const el = page.locator('button, a[href]').nth(i);
    let label = (await el.innerText().catch(() => '')) || (await el.getAttribute('aria-label')) || `#${i}`;
    label = label.replace(/\s+/g, ' ').trim().slice(0, 34);
    const beforeUrl = page.url();
    const beforeDom = await page.evaluate(() => document.body.innerHTML.length);
    try {
      await el.click({ timeout: 1500 });
      await page.waitForTimeout(220);
    } catch {
      await page.close();
      continue;
    }
    const afterUrl = page.url();
    const afterDom = await page.evaluate(() => document.body.innerHTML.length);
    if (beforeUrl === afterUrl && beforeDom === afterDom) dead.push(label);
    await page.close();
  }
  results.push({ route, name, total: count, dead });
  await p.close();
}

await b.close();

let totalDead = 0;
for (const r of results) {
  totalDead += r.dead.length;
  const status = r.dead.length === 0 ? 'OK ' : 'DEAD';
  console.log(`${status} ${r.name.padEnd(22)} ${String(r.total).padStart(3)} controls, ${r.dead.length} dead`);
  for (const d of r.dead) console.log(`        · ${d}`);
}
console.log(`\nTOTAL DEAD CONTROLS: ${totalDead}`);
