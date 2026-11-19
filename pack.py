"""Joins src/css/*.css and src/js/*.js (alphabetical) into css/style.css and js/app.js.
All JS sectors share one scope (one IIFE), so they are only valid joined together.
Run: python3 pack.py   |   python3 pack.py --single  (also writes single/index.html, one self-contained file)"""
import glob,sys,os
d=os.path.dirname(os.path.abspath(__file__))
r=lambda g:''.join(open(f,encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(d,g))))
css=r('src/css/*.css'); js='(function () {\n'+r('src/js/*.js')+'})();\n'
open(os.path.join(d,'css/style.css'),'w',encoding='utf-8').write(css); open(os.path.join(d,'js/app.js'),'w',encoding='utf-8').write(js)
if '--single' in sys.argv:
    h=open(os.path.join(d,'index.html'),encoding='utf-8').read()
    h=h.replace('<link rel="stylesheet" href="css/style.css">','<style>'+css+'</style>').replace('<script src="js/app.js" defer></script>','<script>'+js+'</script>')
    os.makedirs(os.path.join(d,'single'),exist_ok=True); open(os.path.join(d,'single/index.html'),'w',encoding='utf-8').write(h)
print('ok',len(css),len(js))
