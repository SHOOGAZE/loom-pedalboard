"""LOOM smoke tests: python3 tests/test_loom.py  (needs playwright + chrome)"""
import json, pathlib, subprocess, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = 'file://' + str(ROOT / 'index.html')
fails = []
def check(name, ok, info=''):
    print(('PASS ' if ok else 'FAIL ') + name, info); 
    if not ok: fails.append(name)
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True)
    for w, h in [(390, 844), (820, 1180), (1280, 800), (1920, 1080)]:
        pg = b.new_page(viewport={'width': w, 'height': h}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(600)
        check(f'no errors @{w}', not errs, errs[:2])
        check(f'12 pedals @{w}', pg.evaluate('document.querySelectorAll(".pedal").length') == 12)
        ov = pg.evaluate('document.documentElement.scrollWidth - innerWidth')
        check(f'no horizontal overflow @{w}', ov <= 1, ov)
        pg.close()
    # migration: old state without cab, with unknown id and duplicates
    pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL)
    pg.evaluate('localStorage.setItem("loom.board.v1", "")')
    key = pg.evaluate('(function(){for(var i=0;i<localStorage.length;i++){}return null})()')
    pg.close()
    # find board key from source
    src = (ROOT / 'src/app.js').read_text()
    import re
    bk = re.search(r'BOARD_KEY\s*=\s*"([^"]+)"', src).group(1)
    pg = b.new_page(viewport={'width': 390, 'height': 844}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL)
    pg.evaluate('k=>localStorage.setItem(k,JSON.stringify({order:["gate","comp","ghost","comp","drive"],on:{}}))', bk)
    pg.reload(); pg.wait_for_timeout(500)
    order = pg.evaluate('JSON.stringify([].slice.call(document.querySelectorAll(".cslot:not(.fixed)")).map(function(e){return e.dataset.id}))')
    o = json.loads(order)
    check('migration keeps all ids once', sorted(o) == sorted(set(o)) and 'cab' in o and 'ghost' not in o and len(o) == 10, o)
    check('migration no errors', not errs, errs[:2])
    pg.close()
    b.close()
sys.exit(1 if fails else 0)
