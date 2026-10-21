import sys, pathlib
from PIL import Image
from rembg import remove, new_session

src = pathlib.Path(sys.argv[1])
out = pathlib.Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
model = sys.argv[3] if len(sys.argv) > 3 else 'isnet-general-use'
s = new_session(model)
for p in sorted(src.glob('*.jpg')):
    im = Image.open(p).convert('RGB')
    r = remove(im, session=s, post_process_mask=True)
    r.save(out / f'{p.stem}.png')
    print('done', p.name)
