#!/usr/bin/env python3
"""
Generate MP4: 4 background images (2s each) with
upward-scrolling chat bubbles on the right side.
"""

import os, subprocess
from PIL import Image, ImageDraw, ImageFont

VDIR = "/Users/tal/Desktop/AAA/ZZZ/02 产品力拓展/视频"
OUT  = f"{VDIR}/产品演示.mp4"

IMAGE_FILES = [
    f"{VDIR}/侧导布局.png",
    f"{VDIR}/警示弹窗Alert.png",
    f"{VDIR}/全部试卷-1.png",
    f"{VDIR}/全部试卷.png",
]

BUBBLES = [
    "提效挺多的",
    "省得自己封装组件了",
    "30%差不多",
    "后期应该会更快",
    "这个很不错",
]

FPS      = 30
IMG_SECS = 3
W, H     = 1280, 800
TOTAL_F  = FPS * IMG_SECS * len(IMAGE_FILES)  # 360

# ── Load & resize ──────────────────────────────────────────────────────
imgs = [
    Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
    for f in IMAGE_FILES
]

# ── Font ───────────────────────────────────────────────────────────────
FONT_PATH = "/System/Library/Fonts/STHeiti Medium.ttc"
FONT_SIZE = 32

try:
    font = ImageFont.truetype(FONT_PATH, FONT_SIZE)
except Exception:
    font = ImageFont.load_default()

# ── Bubble geometry ────────────────────────────────────────────────────
PAD_X    = 22
PAD_Y    = 12
RADIUS   = 24   # right-side corner radius
R_MARGIN = 30   # gap from right edge of frame

def text_size(text):
    probe = Image.new("RGBA", (2000, 200))
    d = ImageDraw.Draw(probe)
    bb = d.textbbox((0, 0), text, font=font)
    return bb[2] - bb[0], bb[3] - bb[1]

def make_bubble(text):
    """Return RGBA Image of bubble.
    Corners: top-right=0 (sharp), top-left=20, bottom-left=20, bottom-right=20.
    Background: black 20% opacity.
    """
    tw, th = text_size(text)
    bw = tw + PAD_X * 2
    bh = th + PAD_Y * 2
    R  = RADIUS   # 20px
    A  = int(255 * 0.60)   # 60% opacity
    img = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    d   = ImageDraw.Draw(img)
    C   = (0, 0, 0, A)
    BG  = (0, 0, 0, 0)

    # Fill entire rectangle (all corners sharp)
    d.rectangle([0, 0, bw - 1, bh - 1], fill=C)

    # Cut top-left corner then re-add as quarter-circle
    d.rectangle([0, 0, R - 1, R - 1], fill=BG)
    d.ellipse([0, 0, R * 2 - 1, R * 2 - 1], fill=C)

    # Cut bottom-left corner then re-add as quarter-circle
    d.rectangle([0, bh - R, R - 1, bh - 1], fill=BG)
    d.ellipse([0, bh - R * 2, R * 2 - 1, bh - 1], fill=C)

    # Cut bottom-right corner then re-add as quarter-circle
    d.rectangle([bw - R, bh - R, bw - 1, bh - 1], fill=BG)
    d.ellipse([bw - R * 2, bh - R * 2, bw - 1, bh - 1], fill=C)

    # top-right stays sharp (no cut needed)

    # Text — full opacity white
    d.text((PAD_X, PAD_Y), text, font=font, fill=(255, 255, 255, 255))
    return img

# Pre-render all bubbles
bubble_imgs = [make_bubble(t) for t in BUBBLES]
bubble_dims = [b.size for b in bubble_imgs]   # (bw, bh)

# ── Scroll animation ───────────────────────────────────────────────────
# Fixed 50px visual gap between consecutive bubbles.
# All bubbles share the same scroll speed V (px/frame), so their relative
# distance stays constant: spacing = bh + 50.
# Interval in frames = spacing / V → V = spacing / INTERVAL_F.
BH_MAX     = max(bh for _, bh in bubble_dims)   # tallest bubble height
BUBBLE_GAP = 50                                  # desired px gap between bubbles
SPACING    = BH_MAX + BUBBLE_GAP                 # center-to-center distance = 105px
INTERVAL_F = 42                                  # frames between spawns (1.4s @ 30fps)
SCROLL_V   = SPACING / INTERVAL_F               # px/frame  ≈ 2.5
FADE_PX    = 40   # fade distance at top and bottom edges

def bubble_y(bi, fn):
    start = int(bi * INTERVAL_F)
    if fn < start:
        return None
    elapsed = fn - start
    return int(H - elapsed * SCROLL_V)

def clip_paste(base, bimg, x, y):
    """Composite bimg onto base at (x,y), clipping to frame bounds."""
    bw, bh = bimg.size
    if y + bh < 0 or y > H or x + bw < 0 or x > W:
        return

    # Crop source if it extends beyond frame
    sx0 = max(0, -x)
    sy0 = max(0, -y)
    sx1 = min(bw, W - x)
    sy1 = min(bh, H - y)
    if sx1 <= sx0 or sy1 <= sy0:
        return

    src  = bimg.crop((sx0, sy0, sx1, sy1))
    dx   = max(0, x)
    dy   = max(0, y)

    # Fade at bottom (entering) and top (exiting)
    bottom_edge = y + bh
    top_edge    = y
    if bottom_edge > H - FADE_PX:
        ratio = max(0.0, (H - top_edge) / (bh + FADE_PX))
        src   = src.copy()
        src.putalpha(
            src.split()[3].point(lambda p: int(p * min(1.0, ratio)))
        )
    elif top_edge < FADE_PX:
        ratio = max(0.0, (top_edge + bh) / (bh + FADE_PX))
        src   = src.copy()
        src.putalpha(
            src.split()[3].point(lambda p: int(p * min(1.0, ratio)))
        )

    base.alpha_composite(src, (dx, dy))

# ── Frame renderer ─────────────────────────────────────────────────────
def make_frame(fn):
    img_idx = min(fn // (FPS * IMG_SECS), len(imgs) - 1)
    frame   = imgs[img_idx].copy().convert("RGBA")

    for bi in range(len(BUBBLES)):
        y = bubble_y(bi, fn)
        if y is None:
            continue
        bw, bh = bubble_dims[bi]
        x = W - bw - R_MARGIN
        clip_paste(frame, bubble_imgs[bi], x, y)

    return frame.convert("RGB")

# ── Encode via ffmpeg ──────────────────────────────────────────────────
cmd = [
    "ffmpeg", "-y",
    "-f", "rawvideo", "-vcodec", "rawvideo",
    "-s", f"{W}x{H}", "-pix_fmt", "rgb24",
    "-r", str(FPS), "-i", "-",
    "-vcodec", "libx264", "-pix_fmt", "yuv420p",
    "-crf", "18", "-movflags", "+faststart",
    OUT,
]

print(f"Rendering {TOTAL_F} frames @ {W}×{H} → {OUT}")
proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
for fn in range(TOTAL_F):
    proc.stdin.write(make_frame(fn).tobytes())
    if fn % 60 == 0:
        print(f"  {fn}/{TOTAL_F}")
proc.stdin.close()
ret = proc.wait()
print("✅ Done" if ret == 0 else "❌ ffmpeg error")
