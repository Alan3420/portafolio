# Uso: python depth.py entrada.jpg salida_depth.png
import sys, numpy as np, torch
from PIL import Image
from transformers import pipeline
src, dst = sys.argv[1], sys.argv[2]
pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf", device=0 if torch.cuda.is_available() else -1)
im = Image.open(src).convert("RGB")
d = pipe(im)["predicted_depth"]
d = torch.nn.functional.interpolate(d[None] if d.dim()==3 else d[None,None], size=(im.height, im.width), mode="bicubic", align_corners=False)[0,0].cpu().numpy()
d = (d - d.min()) / (d.max() - d.min() + 1e-8)   # 1 = cerca
Image.fromarray((d*255).astype(np.uint8)).save(dst)
print("ok", dst, im.size)
