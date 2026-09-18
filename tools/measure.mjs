import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 430, height: 932 } });
await p.goto('http://127.0.0.1:4173/leads', { waitUntil: 'networkidle' });
const r = await p.evaluate(() => {
  const cards = [...document.querySelectorAll('.aiec-card')].filter(c => c.querySelector('.aiec-entity'));
  const b0 = cards[0].getBoundingClientRect(), b1 = cards[1].getBoundingClientRect();
  const q = (s) => { const e = cards[0].querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
  return {
    cardH: +b0.height.toFixed(1),
    pitch: +(b1.top - b0.top).toFixed(1),
    thumb: q('.aiec-entity__thumb'),
    title: q('.aiec-entity__title'),
    sub: q('.aiec-entity__sub'),
    chip: q('.aiec-status'),
    meta: q('.aiec-entity__meta'),
    rail: q('.aiec-entity__rail'),
    cta: q('.aiec-entity__cta'),
    earn: q('.aiec-entity__earn'),
    body: q('.aiec-entity__body'),
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
