#!/usr/bin/env python3
"""
Compose the TuneSync intro video — **Chinese version** (zh-CN).

Reuses the v2-generated AI hero images; overlays Chinese subtitles and swaps
the open/close baked text to Chinese via PIL.
"""
import os
import subprocess
import sys
from typing import Optional
from PIL import Image, ImageDraw, ImageFont

ROOT = "/Users/qz/Desktop/TuneSync/site"
GEN_DIR = os.path.join(ROOT, "video/generated")
VIDEO_DIR = os.path.join(ROOT, "video")
BGM = os.path.join(VIDEO_DIR, "audio/bgm-A-upbeat.mp3")
OUT = os.path.join(VIDEO_DIR, "tunesync-intro-30s-9x16-zh-CN.mp4")

W, H, FPS = 1080, 1920, 30
TRANS = 0.4
OPEN_DUR = 2.4
CLOSE_DUR = 5.0
SHOT_DUR = 3.6

# (source_file, subtitle_text)
SHOTS = [
    ("shot_1.png", "首页 · 为你推荐"),
    ("shot_2.png", "WebDAV · SMB · NFS · FTP 整合"),
    ("shot_3.png", "歌词随曲逐行高亮"),
    ("shot_4.png", "去除原唱 · 跟伴奏演唱"),
    ("shot_5.png", "AI DJ 自动续接下一首"),
    ("shot_6.png", "自动补全封面、年份、歌词"),
    ("shot_7.png", "多平台榜单与发现"),
]

OPEN_FILE = "shot_0.png"
CLOSE_FILE = "shot_8.png"

CJK_FONT = "/System/Library/Fonts/STHeiti Medium.ttc"
LATIN_FONT = "/System/Library/Fonts/Helvetica.ttc"

OPEN_BANNED_TEXT = "YOUR MUSIC, ALL IN ONE PLACE."
OPEN_NEW_TEXT = "将分散于各处的音乐，重新汇于一处。"

CLOSE_BANNED_TOP = "AVAILABLE ON THE APP STORE"
CLOSE_BANNED_BOTTOM = "tunesync.app"
CLOSE_NEW_TOP = "立即下载  ·  App Store"
CLOSE_NEW_BOTTOM = "tunesync.app"


def render_subtitle_png(text: str, size_px: int = 44, max_w: int = 920) -> str:
    """Render CJK subtitle pill (mixed CJK + Latin supported)."""
    out_path = f"/tmp/_ts_sub_zh_{abs(hash(text))}.png"
    font = ImageFont.truetype(CJK_FONT, size_px, index=0)
    tmp = Image.new("RGBA", (10, 10), (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp)
    bbox = d.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    pad_x, pad_y = 30, 14
    canvas_w = min(text_w + pad_x * 2, max_w + pad_x * 2)
    canvas_h = text_h + pad_y * 2
    img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(
        [(0, 0), (canvas_w - 1, canvas_h - 1)],
        radius=canvas_h // 2,
        fill=(0, 0, 0, 178),
    )
    tx = (canvas_w - text_w) // 2 - bbox[0]
    ty = (canvas_h - text_h) // 2 - bbox[1]
    d.text((tx, ty), text, font=font, fill=(255, 255, 255, 255))
    img.save(out_path, "PNG")
    return out_path


def remake_open(out_path: str):
    """Take shot_0, mask the English tagline row, paint Chinese tagline."""
    src = Image.open(os.path.join(GEN_DIR, OPEN_FILE)).convert("RGB")
    bg = src.resize((W, H), Image.LANCZOS)
    d = ImageDraw.Draw(bg)

    # Mask a horizontal band where "YOUR MUSIC, ALL IN ONE PLACE." lives (~y=1280-1380).
    band_y0, band_y1 = 1280, 1390
    d.rectangle([(0, band_y0), (W, band_y1)], fill=(0, 0, 0))

    # Draw Chinese tagline centered in that band
    font = ImageFont.truetype(CJK_FONT, 38, index=0)
    bb = d.textbbox((0, 0), OPEN_NEW_TEXT, font=font)
    tw = bb[2] - bb[0]
    th = bb[3] - bb[1]
    tx = (W - tw) // 2 - bb[0]
    ty = (band_y0 + band_y1) // 2 - th // 2 - bb[1]
    d.text((tx, ty), OPEN_NEW_TEXT, font=font, fill=(220, 220, 220))
    bg.save(out_path, "PNG")


def remake_close(out_path: str):
    """Build a clean Chinese close frame: black bg + logo cropped from shot_8 + Chinese CTAs."""
    src = Image.open(os.path.join(GEN_DIR, CLOSE_FILE)).convert("RGB")
    bg = Image.new("RGB", (W, H), (0, 0, 0))

    # Crop logo region from shot_8 (where orange logo lives, plus a halo margin).
    # Source shot_8 is 768x1376. Scale to 1080x1920 first to find consistent crop coords.
    src_big = src.resize((W, H), Image.LANCZOS)
    # Logo is centered around y=815 in 1080x1920, extends ~y=540 to y=1100 incl. halo.
    logo_crop = src_big.crop((220, 520, 860, 1110))  # 640 wide x 590 tall
    bg.paste(logo_crop, (220, 520))

    d = ImageDraw.Draw(bg)

    # "TuneSync" big heading below logo
    f_big = ImageFont.truetype(LATIN_FONT, 92, index=0)
    bb = d.textbbox((0, 0), "TuneSync", font=f_big)
    bw = bb[2] - bb[0]
    d.text(((W - bw) // 2 - bb[0], 1180 - bb[1]), "TuneSync", font=f_big, fill=(255, 255, 255))

    # "立即下载 · App Store" Chinese CTA
    f_top = ImageFont.truetype(CJK_FONT, 38, index=0)
    bb = d.textbbox((0, 0), CLOSE_NEW_TOP, font=f_top)
    tw = bb[2] - bb[0]
    d.text(((W - tw) // 2 - bb[0], 1320 - bb[1]), CLOSE_NEW_TOP, font=f_top, fill=(220, 220, 220))

    # Subtle divider dot row
    f_btm = ImageFont.truetype(LATIN_FONT, 30, index=0)
    url_text = f"·  {CLOSE_NEW_BOTTOM}  ·"
    bb = d.textbbox((0, 0), url_text, font=f_btm)
    bw = bb[2] - bb[0]
    d.text(((W - bw) // 2 - bb[0], 1700 - bb[1]), url_text, font=f_btm, fill=(180, 180, 180))

    bg.save(out_path, "PNG")


def upsample(src: str, dst: str):
    subprocess.run([
        "ffmpeg", "-y", "-i", src,
        "-vf", "scale=1080:1920:flags=lanczos",
        "-frames:v", "1", dst,
    ], check=True, capture_output=True)


def build_filtergraph(opening_input_idx, shot_input_indices, closing_input_idx, bgm_input_idx) -> str:
    parts = []
    for i, idx in enumerate(shot_input_indices):
        nframes = int(round(SHOT_DUR * FPS))
        dx = (i % 3 - 1) * 1.5
        dy = (i % 4 - 1.5) * 1.2
        z_expr = "1+0.0006*on"
        x_expr = f"iw/2-(iw/zoom/2)+{dx:.2f}*on"
        y_expr = f"ih/2-(ih/zoom/2)+{dy:.2f}*on"
        parts.append(
            f"[{idx}:v]"
            f"zoompan=z='{z_expr}':x='{x_expr}':y='{y_expr}':d={nframes}:s={W}x{H}:fps={FPS},"
            f"format=yuv420p"
            f"[s{i}];"
        )

    parts.append(f"[{opening_input_idx}:v]format=yuv420p[o0];")
    parts.append(f"[{closing_input_idx}:v]format=yuv420p[c0];")

    cursor = OPEN_DUR
    o1 = cursor - TRANS
    parts.append(f"[o0][s0]xfade=transition=fade:duration={TRANS}:offset={o1:.3f}[x0];")
    cur_label = "[x0]"
    for i in range(1, len(shot_input_indices)):
        cursor += SHOT_DUR
        o = cursor - TRANS
        parts.append(f"{cur_label}[s{i}]xfade=transition=fade:duration={TRANS}:offset={o:.3f}[x{i}];")
        cur_label = f"[x{i}]"
    cursor += SHOT_DUR
    offset_close = cursor - TRANS
    parts.append(f"{cur_label}[c0]xfade=transition=fade:duration={TRANS}:offset={offset_close:.3f}[vxf];")

    parts.append(
        f"[{bgm_input_idx}:a]aresample=44100,"
        f"afade=t=in:st=0:d=0.8,"
        f"afade=t=out:st={30-0.8:.3f}:d=0.8,"
        f"volume=0.5"
        f"[aout];"
    )

    return "".join(parts)


def main():
    frames = os.path.join(VIDEO_DIR, "frames_zh")
    os.makedirs(frames, exist_ok=True)

    # Open & close — composite Chinese over AI source frames
    open_png = os.path.join(frames, "open.png")
    close_png = os.path.join(frames, "close.png")
    if not os.path.exists(open_png):
        remake_open(open_png)
    if not os.path.exists(close_png):
        remake_close(close_png)

    # Shot frames — upscale AI images
    for i, (src_filename, _) in enumerate(SHOTS):
        src_path = os.path.join(GEN_DIR, src_filename)
        dst_path = os.path.join(frames, f"shot_{i:02d}.png")
        if not os.path.exists(dst_path):
            print(f"upscaling {src_filename}")
            upsample(src_path, dst_path)

    subtitle_pngs = [render_subtitle_png(sub, size_px=44) for _, sub in SHOTS]

    inputs = []
    inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{OPEN_DUR}", "-i", open_png])
    shot_input_indices = []
    for i, (src_filename, _) in enumerate(SHOTS):
        inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{SHOT_DUR}", "-i",
                       os.path.join(frames, f"shot_{i:02d}.png")])
        shot_input_indices.append(i + 1)
    closing_input_idx = len(SHOTS) + 1
    inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{CLOSE_DUR}", "-i", close_png])
    bgm_input_idx = closing_input_idx + 1
    inputs.extend(["-stream_loop", "-1", "-i", BGM])

    fg_main = build_filtergraph(0, shot_input_indices, closing_input_idx, bgm_input_idx)

    sub_input_offset = bgm_input_idx + 1
    cur = "[vxf]"
    last_v_label = "[vxf]"
    for i, (_, _) in enumerate(SHOTS):
        shot_start = OPEN_DUR + i * SHOT_DUR
        shot_end = OPEN_DUR + (i + 1) * SHOT_DUR
        start = shot_start + TRANS + 0.05
        end = shot_end - TRANS - 0.05
        sub_label = f"[{sub_input_offset + i}:v]"
        out_label = f"[vout{i}]"
        overlay = (
            f"{cur}{sub_label}"
            f"overlay=(W-w)/2:H-h-180:"
            f"enable='between(t\\,{start:.3f}\\,{end:.3f})'"
            f"{out_label};"
        )
        fg_main += overlay
        cur = out_label
        last_v_label = out_label

    cmd = [
        "ffmpeg", "-y",
        *inputs,
        *(item for path in subtitle_pngs for item in
          ["-framerate", str(FPS), "-loop", "1", "-t", str(SHOT_DUR + 0.5), "-i", path]),
        "-filter_complex", fg_main,
        "-map", last_v_label, "-map", "[aout]",
        "-t", "30",
        "-c:v", "libx264", "-preset", "medium", "-crf", "19",
        "-pix_fmt", "yuv420p", "-r", str(FPS),
        "-c:a", "aac", "-b:a", "160k",
        "-ar", "44100", "-ac", "2",
        "-movflags", "+faststart",
        OUT,
    ]
    print("Running ffmpeg...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print("STDOUT:", res.stdout[-1500:])
    if res.returncode != 0:
        print("STDERR:", res.stderr[-3000:])
        sys.exit(res.returncode)
    print(f"\nOK -> {OUT}")
    print(f"Size: {os.path.getsize(OUT)} bytes")


if __name__ == "__main__":
    main()
