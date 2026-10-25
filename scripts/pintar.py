# Kuwahara generalizado (Papari et al.) en GPU + gradación de color.
# Uso: python painterly.py entrada salida --radios 7,4 --ancho 2400 --grade under|none
import argparse, math, numpy as np, torch, torch.nn.functional as F
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("dst")
ap.add_argument("--radios", default="7,4")
ap.add_argument("--ancho", type=int, default=0)
ap.add_argument("--grade", default="none")
ap.add_argument("--q", type=float, default=10.0)
ap.add_argument("--depth", default="")
a = ap.parse_args()
dev = "cuda" if torch.cuda.is_available() else "cpu"

im = Image.open(a.src).convert("RGB")
if a.ancho and im.width > a.ancho:
    im = im.resize((a.ancho, round(im.height * a.ancho / im.width)), Image.LANCZOS)
x = torch.from_numpy(np.asarray(im).astype(np.float32) / 255).permute(2, 0, 1)[None].to(dev)

def kernels(r, n=8):
    ys, xs = torch.meshgrid(torch.arange(-r, r + 1), torch.arange(-r, r + 1), indexing="ij")
    d = torch.sqrt(xs.float() ** 2 + ys.float() ** 2)
    g = torch.exp(-(d ** 2) / (2 * (r / 2.2) ** 2)) * (d <= r)
    th = torch.atan2(ys.float(), xs.float())
    ks = []
    for i in range(n):
        phi = 2 * math.pi * i / n
        w = torch.clamp(torch.cos(th - phi), min=0) ** 3
        w[r, r] = 1.0 / n
        k = w * g
        ks.append(k / k.sum())
    return torch.stack(ks)[:, None].to(dev)  # (n,1,k,k)

def kuwahara(img, r, q):
    K = kernels(r)
    n = K.shape[0]
    B, C, H, W = img.shape
    pad = F.pad(img, (r, r, r, r), mode="reflect")
    flat = pad.reshape(C, 1, H + 2 * r, W + 2 * r)
    m = F.conv2d(flat, K)            # (C,n,H,W)
    s = F.conv2d(flat ** 2, K) - m ** 2
    var = s.clamp(min=0).sum(0)      # (n,H,W)
    w = 1.0 / (1.0 + 255.0 * var) ** q
    w = w / w.sum(0, keepdim=True)
    out = (m * w[None]).sum(1)       # (C,H,W)
    return out[None]

for r in [int(v) for v in a.radios.split(",")]:
    x = kuwahara(x, r, a.q)

# realce suave de bordes (unsharp) para recuperar el dibujo
blur = F.avg_pool2d(F.pad(x, (2, 2, 2, 2), mode="reflect"), 5, stride=1)
x = (x + 0.45 * (x - blur)).clamp(0, 1)

def mapa(lum, paradas):
    # mapa de degradado por tramos: paradas = [(pos, (r,g,b)), ...]
    out = torch.zeros(lum.shape[0], 3, *lum.shape[2:], device=dev)
    tramos = list(zip(paradas, paradas[1:]))
    for i, ((p0, c0), (p1, c1)) in enumerate(tramos):
        t = ((lum - p0) / (p1 - p0)).clamp(0, 1)
        c0 = torch.tensor(c0, device=dev)[None, :, None, None]; c1 = torch.tensor(c1, device=dev)[None, :, None, None]
        m = ((lum >= p0) & ((lum < p1) if i < len(tramos) - 1 else (lum <= p1))).float()
        out = out + m * (c0 + (c1 - c0) * t)
    return out

if a.grade in ("under", "upper"):
    lum = (0.2126 * x[:, 0] + 0.7152 * x[:, 1] + 0.0722 * x[:, 2])[:, None].clamp(0, 1)
    lum = lum ** 0.85
    if a.grade == "under":
        paradas = [(0.0, (0.03, 0.07, 0.09)), (0.28, (0.08, 0.22, 0.25)), (0.55, (0.30, 0.45, 0.44)),
                   (0.78, (0.93, 0.62, 0.34)), (1.0, (1.0, 0.92, 0.74))]
        bruma = (0.25, 0.55, 0.55)
    else:
        paradas = [(0.0, (0.07, 0.04, 0.05)), (0.3, (0.24, 0.12, 0.14)), (0.6, (0.62, 0.38, 0.22)),
                   (0.85, (0.98, 0.72, 0.36)), (1.0, (1.0, 0.94, 0.78))]
        bruma = (0.45, 0.30, 0.40)
    tono = mapa(lum, paradas)
    x = (0.25 * x + 0.75 * tono).clamp(0, 1)
    if a.depth:
        d = torch.from_numpy(np.asarray(Image.open(a.depth).convert("L").resize((x.shape[3], x.shape[2]), Image.BILINEAR)).astype(np.float32) / 255).to(dev)[None, None]
        lejos = (1 - d).clamp(0, 1) ** 2.2
        x = x * (1 - 0.45 * lejos) + torch.tensor(bruma, device=dev)[None, :, None, None] * 0.45 * lejos * (0.4 + lum)
    x = ((x - 0.5) * 1.1 + 0.49).clamp(0, 1)

out = (x[0].permute(1, 2, 0).cpu().numpy() * 255).round().astype(np.uint8)
Image.fromarray(out).save(a.dst, quality=92)
print("ok", a.dst, out.shape)
