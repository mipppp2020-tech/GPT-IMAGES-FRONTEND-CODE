import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

/** Walks the money pipeline in a real browser, proving the gates hold. */
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
await mkdir('.artifacts/pipeline', { recursive: true });

await p.goto('http://127.0.0.1:4173/pipeline', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: '.artifacts/pipeline/01-gate1-shut.full.png', fullPage: true });

const advance = () => p.getByRole('button', { name: /पुढे जा|Move forward/ }).click();
const turnKey = () => p.getByRole('button', { name: /किल्ली द्या|Turn the key/ }).click();

// Gate 1: try to move with no token — must refuse.
await advance();
await p.waitForTimeout(120);
const blockedText = await p.locator('.aiec-alert__title').allInnerTexts();
console.log('after blind advance, alerts:', JSON.stringify(blockedText));
await p.screenshot({ path: '.artifacts/pipeline/02-refused.full.png', fullPage: true });

// Supply the token, then walk as far as the engine allows.
await turnKey();
await p.waitForTimeout(100);
let steps = 0;
for (let i = 0; i < 25; i++) {
  const before = await p.locator('.aiec-pstage--here .aiec-pstage__name').innerText().catch(() => '');
  await advance();
  await p.waitForTimeout(80);
  const after = await p.locator('.aiec-pstage--here .aiec-pstage__name').innerText().catch(() => '');
  if (before === after) break;
  steps++;
}
const stuckAt = await p.locator('.aiec-pstage--here .aiec-pstage__name').innerText().catch(() => '?');
console.log(`advanced ${steps} stages, now standing at: ${stuckAt}`);
await p.screenshot({ path: '.artifacts/pipeline/03-stuck-at-next-gate.full.png', fullPage: true });

await b.close();
