import { chromium } from 'playwright';
import { SCREENS } from './screens.mjs';

/**
 * Automated gate checks that do not need an eye:
 *  - no horizontal overflow at any mandated breakpoint
 *  - no element clipped by an ancestor at 200% text scale
 *  - every action control meets the universal 48px touch floor
 */
const BREAKPOINTS = [320, 360, 430, 480, 834, 1024, 1440];
const BASE = 'http://127.0.0.1:4173';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let fails = 0;

for (const bp of BREAKPOINTS) {
  const page = await browser.newPage({ viewport: { width: bp, height: 932 } });
  for (const s of SCREENS) {
    await page.goto(`${BASE}${s.path}`, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      const small = [];
      const sel = '.aiec-btn, .aiec-iconbtn, .aiec-tab, .aiec-chip--interactive, .aiec-shutter, .aiec-filterbtn';
      for (const el of document.querySelectorAll(sel)) {
        const b = el.getBoundingClientRect();
        if (b.height > 0 && b.height < 47.5) {
          small.push(`${el.className.toString().slice(0, 40)}@${b.height.toFixed(0)}`);
        }
      }
      return { overflow, small: [...new Set(small)].slice(0, 4) };
    });
    const bad = r.overflow > 1 || r.small.length > 0;
    if (bad) {
      fails++;
      console.log(`FAIL ${bp}px ${s.id}: overflowX=${r.overflow} under48=[${r.small.join(', ')}]`);
    }
  }
  await page.close();
}

// 200% text scale on the densest screens.
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
for (const s of SCREENS) {
  await page.goto(`${BASE}${s.path}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{font-size:32px !important}' });
  await page.waitForTimeout(80);
  const r = await page.evaluate(() => {
    const doc = document.documentElement;
    let clipped = 0;
    for (const el of document.querySelectorAll('.aiec-no-clip')) {
      if (el.scrollHeight - el.clientHeight > 2 || el.scrollWidth - el.clientWidth > 2) clipped++;
    }
    return { overflow: doc.scrollWidth - doc.clientWidth, clipped };
  });
  if (r.overflow > 1 || r.clipped > 0) {
    fails++;
    console.log(`FAIL 200%-text ${s.id}: overflowX=${r.overflow} clippedNodes=${r.clipped}`);
  }
}
await browser.close();
console.log(fails === 0 ? '\nALL QA CHECKS PASSED' : `\n${fails} QA failures`);
