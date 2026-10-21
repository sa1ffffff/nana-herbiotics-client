import json, sys, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
S = pathlib.Path(sys.argv[1]); spec = json.loads(pathlib.Path(sys.argv[2]).read_text()); out = pathlib.Path(sys.argv[3])
C = 1000
for name, sp in spec.items():
    im = Image.open(S / f"{sp['src']}.png").convert('RGBA')
    raw = Image.open(sp['raw']).convert('RGB')
    m = Image.new('L', im.size, 0); d = ImageDraw.Draw(m)
    if 'ellipse' in sp: d.ellipse(sp['ellipse'], fill=255)
    else: d.polygon([tuple(p) for p in sp['poly']], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(1.2))
    a = np.array(im); a[..., :3] = np.array(raw)
    a[..., 3] = np.minimum(a[..., 3], np.array(m)) if not sp.get('mask_only') else np.array(m)
    im = Image.fromarray(a)
    if sp.get('angle'): im = im.rotate(sp['angle'], resample=Image.BICUBIC, expand=True)
    im = im.crop(im.getbbox())
    if 'clip' in sp:
        x0,y0,x1,y1 = sp['clip']; a = np.array(im); k = np.zeros(a.shape[:2], bool); k[y0:y1, x0:x1] = True; a[~k, 3] = 0
        if 'opaque' in sp:
            o = Image.new('L', im.size, 0); ImageDraw.Draw(o).rounded_rectangle(sp['opaque'], radius=sp.get('r', 14), fill=255)
            a[..., 3] = np.maximum(a[..., 3], np.array(o))
        for x0,y0,x1,y1,smp in sp.get('patch', []):
            col = a[smp[1], smp[0], :3].copy()
            reg = a[y0:y1, x0:x1]; hole = reg[..., 3] < 200
            reg[hole, :3] = col; reg[hole, 3] = 255
        im = Image.fromarray(a); im = im.crop(im.getbbox())
    # fit
    box = sp.get('fit', 0.8)
    s = min(C*box/im.height, C*0.82/im.width); im = im.resize((round(im.width*s), round(im.height*s)), Image.LANCZOS)
    canvas = Image.new('RGBA', (C, C), (255,255,255,255))
    base = (C + im.height)//2 + 10
    sh = Image.new('L', (C, C), 0); w = im.width*0.55
    ImageDraw.Draw(sh).ellipse([C/2-w, base-22, C/2+w, base+14], fill=60)
    sh = sh.filter(ImageFilter.GaussianBlur(22))
    canvas.paste(Image.new('RGBA', (C,C), (20,40,30,255)), (0,0), sh)
    canvas.alpha_composite(im, ((C-im.width)//2, base-im.height))
    c = canvas.convert('RGB')
    c.save(out / f'{name}.webp', quality=84, method=6)
    c.resize((500,500), Image.LANCZOS).save(out / f'{name}-500.webp', quality=82, method=6)
    print(name)
