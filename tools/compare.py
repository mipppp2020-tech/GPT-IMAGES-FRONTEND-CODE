"""Build reference|render side-by-side composites at a common height.

The references are ~1.98x the 430x932 design viewport; renders are 2x. Both
are normalised to a common height so composition, density and vertical rhythm
can be judged directly against each other.
"""
from PIL import Image, ImageDraw
import os, sys

REF_DIR = os.environ.get(
    'AIEC_REFS',
    '/tmp/claude-0/-home-user-GPT-IMAGES-FRONTEND-CODE/064a4ad2-5b22-5351-9294-6d6d62e43d9f/'
    'scratchpad/AIEC_Build_Screens_Till_Now/screens',
)
SHOTS = '.artifacts/shots'
OUT = '.artifacts/compare'

PAIRS = [
    ('S-R-01-home', 'a_tall_smartphone_ui_screenshot_in_marathi_of_a_ma.png'),
    ('S-R-02-leads', 'a_vertical_smartphone_screenshot_of_a_marathi_app.png'),
    ('S-R-03-capture', 'a_tall_smartphone_ui_screenshot_mobile_app_with.png'),
    ('S-R-04-sitephotos', 'a_smartphone_app_screenshot_ui_portrait_mobile_sc.png'),
    ('S-R-05-payout', 'a_vertical_smartphone_app_ui_screenshot_clean_mob.png'),
    ('S-R-06-success', 'a_clean_mobile_app_success_confirmation_screen_sm.png'),
    ('S-R-07-leaddetail', 'a_clean_mobile_app_ui_screenshot_portrait_fixed.png'),
]

H = 900
os.makedirs(OUT, exist_ok=True)
only = sys.argv[1] if len(sys.argv) > 1 else None

for sid, ref in PAIRS:
    if only and only not in sid:
        continue
    rp = os.path.join(REF_DIR, ref)
    sp = os.path.join(SHOTS, f'{sid}.png')
    fp = os.path.join(SHOTS, f'{sid}.full.png')
    if not (os.path.exists(rp) and os.path.exists(sp)):
        print('skip', sid)
        continue

    def fit(p):
        im = Image.open(p).convert('RGB')
        return im.resize((int(im.width * H / im.height), H), Image.LANCZOS)

    a, b = fit(rp), fit(sp)
    c = fit(fp)
    gap = 14
    W = a.width + b.width + c.width + gap * 2
    m = Image.new('RGB', (W, H + 26), '#FFFFFF')
    m.paste(a, (0, 26))
    m.paste(b, (a.width + gap, 26))
    m.paste(c, (a.width + b.width + gap * 2, 26))
    d = ImageDraw.Draw(m)
    d.text((6, 8), 'REFERENCE', fill='#B00F02')
    d.text((a.width + gap + 6, 8), 'RENDER (viewport)', fill='#046936')
    d.text((a.width + b.width + gap * 2 + 6, 8), 'RENDER (full scroll)', fill='#0B4C9F')
    m.save(os.path.join(OUT, f'{sid}.png'))
    print('wrote', sid, m.size)
