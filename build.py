#!/usr/bin/env python3
"""LOOM build: src/template.html + src/*.css|js + src/assets/*.txt -> index.html"""
import re, sys, pathlib
R = pathlib.Path(__file__).parent
t = (R/'src/template.html').read_text(encoding='utf-8')
t = re.sub(r'\{\{FILE:([^}]+)\}\}', lambda m: (R/'src'/m.group(1)).read_text(encoding='utf-8'), t)
t = re.sub(r'\{\{ASSET:(\d+)\}\}', lambda m: (R/f'src/assets/asset{m.group(1)}.txt').read_text(), t)
out = R/(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
out.write_text(t, encoding='utf-8'); print('built', out, len(t.encode()), 'bytes')
