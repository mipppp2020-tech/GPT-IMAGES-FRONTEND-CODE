import type { Lead } from './types'
import { formatINR } from './selectors'

/** The one thing a customer actually walks away with after paying for an
 * entire lift installation — a real file, not a button that does nothing.
 * No backend/PDF service exists in this MVP, so this builds a self-
 * contained, printable HTML certificate client-side and triggers a real
 * browser download — honest about what it is (open it, or print-to-PDF
 * from the browser), not a fake "downloaded!" toast. */
export function downloadNoc(lead: Lead, finalAmt: number) {
  const issuedOn = new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const html = `<!DOCTYPE html>
<html lang="mr">
<head>
<meta charset="UTF-8" />
<title>NOC — ${lead.buildingName}</title>
<style>
  body { font-family: 'Noto Sans Devanagari', 'Segoe UI', sans-serif; background: #f4f1ea; margin: 0; padding: 40px 20px; color: #1c1a15; }
  .cert { max-width: 640px; margin: 0 auto; background: #fffdf8; border: 3px solid #a8791f; border-radius: 4px; padding: 48px 40px; }
  .seal { width: 64px; height: 64px; border-radius: 50%; background: #a8791f; color: #fffdf8; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; }
  h1 { text-align: center; font-size: 24px; margin: 0 0 4px; letter-spacing: 0.5px; }
  .sub { text-align: center; color: #6b6455; font-size: 13px; margin-bottom: 32px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  td { padding: 10px 4px; border-bottom: 1px solid #e6dfcf; font-size: 15px; }
  td.label { color: #6b6455; width: 45%; }
  td.value { font-weight: 600; text-align: right; }
  .footer { text-align: center; font-size: 12px; color: #6b6455; margin-top: 32px; line-height: 1.6; }
  .amc { text-align: center; margin: 24px 0; padding: 14px; background: #f4f1ea; border-radius: 8px; font-size: 14px; }
</style>
</head>
<body>
  <div class="cert">
    <div class="seal">🎖️</div>
    <h1>ना हरकत प्रमाणपत्र (NOC) व वॉरंटी</h1>
    <p class="sub">AIEC — Automated India Elevator Company</p>
    <table>
      <tr><td class="label">इमारत</td><td class="value">${lead.buildingName}</td></tr>
      <tr><td class="label">पत्ता</td><td class="value">${lead.address}</td></tr>
      <tr><td class="label">लिफ्ट आयडी</td><td class="value">${lead.id}</td></tr>
      <tr><td class="label">मालक</td><td class="value">${lead.ownerName}</td></tr>
      <tr><td class="label">मजले · प्रवासी क्षमता</td><td class="value">${lead.floors} मजले · ${lead.passengers} प्रवासी</td></tr>
      <tr><td class="label">अंतिम पेमेंट स्वीकारले</td><td class="value">₹${formatINR(finalAmt)}</td></tr>
      <tr><td class="label">जारी केल्याची तारीख</td><td class="value">${issuedOn}</td></tr>
    </table>
    <div class="amc">AMC वर्ष 1 आजपासून सक्रिय — वार्षिक देखभाल यात समाविष्ट आहे.</div>
    <p class="footer">
      हे प्रमाणपत्र AIEC च्या डिजिटल पडताळणी प्रणालीद्वारे जारी केले गेले आहे — प्रत्येक टप्पा फोटो व GPS सह पडताळला गेला आहे.<br/>
      लिफ्ट आयडी ${lead.id} द्वारे पडताळणी उपलब्ध.
    </p>
  </div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `NOC-${lead.id}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
