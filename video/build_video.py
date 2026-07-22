#!/usr/bin/env python3
"""
Compose the TuneSync intro video in ONE ffmpeg pass:
- 30s vertical 9:16 (1080x1920)
- 7 screenshot shots + opening logo + outro logo + short subtitle line per shot
- Smooth Ken Burns (mild zoom-in) + xfade cross-dissolves between clips
- BGM (full track, fade in/out, looped if shorter)

Final duration math:
  sum(clip_dur) - (N_clips - 1)*trans_dur = total_out
  with 9 clips, trans=0.4s → sum = 30 + 8*0.4 = 33.2
  open=2.5, close=2.0 → 7 shots sum to 28.7 → each 4.1s
"""
import os
import subprocess
import sys
from typing import Optional
from PIL import Image, ImageDraw, ImageFont

ROOT = "/Users/qz/Desktop/TuneSync/site"
SHOTS_DIR = os.path.join(ROOT, "public/screenshots")
VIDEO_DIR = os.path.join(ROOT, "video")
BGM = os.path.join(VIDEO_DIR, "audio/bgm-A-upbeat.mp3")
LOGO_LIGHT = os.path.join(ROOT, "public/logo-light.png")
OUT = os.path.join(VIDEO_DIR, "tunesync-intro-30s-9x16.mp4")

W, H, FPS = 1080, 1920, 30
TRANS = 0.4
# Tuning notes:
#   The last xfade (s6 -> close) is at offset = OPEN + 7*SHOT - TRANS.
#   After the chain ends, ffmpeg produces <total> ≈ OPEN + 7*SHOT + CLOSE - 8*TRANS.
#   We cap with -t 30. To make close visibly hold the screen at the end, the chain
#   must overrun 30 s so the close segment is long enough in OUTPUT timeline.
#   Chosen: OPEN=2.4, SHOT=3.6, CLOSE=7.0 → theoretical total=31.4 → close_xfade
#   starts at 27.2 and close is fully visible from 27.6 to 30+ (well past the 30s cap).
OPEN_DUR = 2.4
CLOSE_DUR = 7.0
SHOT_DUR = 3.6

# (source_file, crop_y_after_1080_rescale, subtitle_text)
SHOTS = [
    ("home.png",          130, "Your music, all in one place."),
    ("library.png",       100, "One library from servers and folders."),
    ("player-lyrics.png", 240, "Lyrics in sync, line by line."),
    ("karaoke.png",       200, "Sing along — vocals removed, on-device."),
    ("ai-dj.png",         130, "AI DJ picks the next track."),
    ("metadata.png",      140, "Artwork, lyrics, year — filled in."),
    ("discovery.png",     180, "Charts and recommendations ready."),
]

OPEN_SUBTITLE = "Your music, all in one place."
CLOSE_SUBTITLE = "Download on the App Store  ·  tunesync.app"

HELVETICA = "/System/Library/Fonts/Helvetica.ttc"


def render_subtitle_png(text: str, size_px: int = 56, max_w: int = 950) -> str:
    """Render subtitle text to a tight transparent PNG. Returns path."""
    out_path = f"/tmp/_ts_sub_{abs(hash(text))}.png"
    # pick a font by index; Helvetica.ttc has multiple faces. Use a regular weight.
    font = ImageFont.truetype(HELVETICA, size_px, index=0)
    # measure text
    tmp = Image.new("RGBA", (10, 10), (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp)
    bbox = d.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    pad_x, pad_y = 36, 18
    canvas_w = min(text_w + pad_x * 2, max_w + pad_x * 2)
    canvas_h = text_h + pad_y * 2
    img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # background pill
    d.rounded_rectangle(
        [(0, 0), (canvas_w - 1, canvas_h - 1)],
        radius=canvas_h // 2,
        fill=(0, 0, 0, 178),
    )
    # text centered
    tx = (canvas_w - text_w) // 2 - bbox[0]
    ty = (canvas_h - text_h) // 2 - bbox[1]
    d.text((tx, ty), text, font=font, fill=(255, 255, 255, 255))
    img.save(out_path, "PNG")
    return out_path


def make_logo_png(out_path, subtitle: Optional[str] = None, big_subtitle: Optional[str] = None):
    """Build 1080x1920 black PNG with centered white logo + optional subtitle bar."""
    LOGO_SIZE = 540
    # Step 1: create transparent-canvas logo
    tmp_logo = "/tmp/_ts_logo_tmp.png"
    subprocess.run([
        "magick", LOGO_LIGHT,
        "-resize", f"{LOGO_SIZE}x{LOGO_SIZE}",
        "-background", "none",
        "-gravity", "center",
        "-extent", f"{LOGO_SIZE}x{LOGO_SIZE}",
        tmp_logo,
    ], check=True, capture_output=True)

    # Step 2: compose background + logo + optional subtitle with PIL
    bg = Image.new("RGB", (W, H), (0, 0, 0))
    logo_img = Image.open(tmp_logo).convert("RGBA")
    lx = (W - logo_img.width) // 2
    ly = (H - logo_img.height) // 2 - 80
    bg.paste(logo_img, (lx, ly), mask=logo_img.split()[3])

    d = ImageDraw.Draw(bg)
    if big_subtitle:
        f_big = ImageFont.truetype(HELVETICA, 78, index=0)
        bb = d.textbbox((0, 0), big_subtitle, font=f_big)
        bw = bb[2] - bb[0]
        bh = bb[3] - bb[1]
        d.text(((W - bw) // 2 - bb[0], H - 380 - bb[1]), big_subtitle, font=f_big, fill=(255, 255, 255))

    if subtitle:
        # render pill
        sub_path = render_subtitle_png(subtitle, size_px=48)
        sub_img = Image.open(sub_path).convert("RGBA")
        sx = (W - sub_img.width) // 2
        sy = H - 220
        bg.paste(sub_img, (sx, sy), mask=sub_img.split()[3])
        os.remove(sub_path)

    bg.save(out_path, "PNG")
    if os.path.exists(tmp_logo):
        os.remove(tmp_logo)


def preprocess_shot_png(src_path: str, out_path: str, y_off: int):
    """Pre-scale + crop source 1206x2622 to 1080x1920 frame, centered around y_off."""
    subprocess.run([
        "ffmpeg", "-y", "-i", src_path,
        "-vf", f"scale=1080:-1,crop=1080:1920:0:{y_off}",
        "-frames:v", "1",
        out_path,
    ], check=True, capture_output=True)


def build_filtergraph(opening_input_idx: int, shot_input_indices, closing_input_idx: int, bgm_input_idx: int) -> str:
    """Compose the full filter_complex graph."""
    parts = []
    # Pre-processed shots: 9 inputs total (0=open, 1..7=shots, 8=close)
    # Per-shot: zoompan + format=yuv420p
    for i, idx in enumerate(shot_input_indices):
        nframes = int(round(SHOT_DUR * FPS))
        z_expr = "1+0.0009*on"
        dx = (i % 3 - 1) * 4
        dy = (i % 4 - 1.5) * 3
        x_expr = f"iw/2-(iw/zoom/2)+{dx:.2f}*on"
        y_expr = f"ih/2-(ih/zoom/2)+{dy:.2f}*on"
        parts.append(
            f"[{idx}:v]"
            f"zoompan=z='{z_expr}':x='{x_expr}':y='{y_expr}':d={nframes}:s={W}x{H}:fps={FPS},"
            f"format=yuv420p"
            f"[s{i}];"
        )

    # Open + close: just format
    parts.append(f"[{opening_input_idx}:v]format=yuv420p[o0];")
    parts.append(f"[{closing_input_idx}:v]format=yuv420p[c0];")

    # xfade chain
    out_chain = "vxf"
    cursor = OPEN_DUR
    # open -> shot0
    o1 = cursor - TRANS
    parts.append(f"[o0][s0]xfade=transition=fade:duration={TRANS}:offset={o1:.3f}[x0];")
    cur_label = "[x0]"
    for i in range(1, len(shot_input_indices)):
        cursor += SHOT_DUR
        o = cursor - TRANS
        parts.append(f"{cur_label}[s{i}]xfade=transition=fade:duration={TRANS}:offset={o:.3f}[x{i}];")
        cur_label = f"[x{i}]"
    # final xfade into close — cursor is end of last intra-shots xfade.
    # We need s6 -> close at OPEN + 7*SHOT - TRANS, so advance cursor once more.
    cursor += SHOT_DUR
    offset_close = cursor - TRANS
    parts.append(f"{cur_label}[c0]xfade=transition=fade:duration={TRANS}:offset={offset_close:.3f}[{out_chain}];")

    # Audio
    parts.append(
        f"[{bgm_input_idx}:a]aresample=44100,"
        f"afade=t=in:st=0:d=0.8,"
        f"afade=t=out:st={30-0.8:.3f}:d=0.8,"
        f"volume=0.5"
        f"[aout];"
    )

    # Pad vxf to exactly 30s with last-frame hold (so video matches audio length)
    # Use tpad on the very last video stream.
    # Actually we patch in main() to keep the filter API clean. Done.

    return "".join(parts)


def main():
    frames = os.path.join(VIDEO_DIR, "frames")
    os.makedirs(frames, exist_ok=True)

    # 1. Render open + close logo PNGs
    open_png = os.path.join(frames, "open.png")
    close_png = os.path.join(frames, "close.png")
    if not os.path.exists(open_png):
        make_logo_png(open_png, big_subtitle=OPEN_SUBTITLE)

    if not os.path.exists(close_png):
        make_logo_png(close_png, subtitle=CLOSE_SUBTITLE)

    # 2. Pre-process each shot PNG: scale-to-1080 + crop-to-1920
    shot_pngs = []
    for i, (src, y_off, _) in enumerate(SHOTS):
        out = os.path.join(frames, f"shot_{i:02d}.png")
        if not os.path.exists(out):
            preprocess_shot_png(os.path.join(SHOTS_DIR, src), out, y_off)
        shot_pngs.append(out)

    # 3. Render subtitle PNGs
    subtitle_pngs = []
    for _, _, sub in SHOTS:
        subtitle_pngs.append(render_subtitle_png(sub, size_px=48))

    # 4. Build ffmpeg inputs list
    inputs = []
    # index 0: open
    inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{OPEN_DUR}", "-i", open_png])
    # indices 1..7: shots
    shot_input_indices = []
    for i, path in enumerate(shot_pngs):
        inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{SHOT_DUR}", "-i", path])
        shot_input_indices.append(i + 1)
    # index 8: close
    closing_input_idx = len(shot_pngs) + 1
    inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{CLOSE_DUR}", "-i", close_png])
    # index next: bgm (looped)
    bgm_input_idx = closing_input_idx + 1
    inputs.extend(["-stream_loop", "-1", "-i", BGM])

    # 5. Build filter_complex: video chain + subtitle overlays
    fg_main = build_filtergraph(0, shot_input_indices, closing_input_idx, bgm_input_idx)

    # 5b. Subtitle overlays: chained sequentially so each consumes the prior output.
    # Each shot is fully visible from OPEN_DUR + i*SHOT_DUR to OPEN_DUR + (i+1)*SHOT_DUR - TRANS.
    # Subtitle avoids the crossfade regions (start +TRANS into shot, end -TRANS before shot ends).
    sub_input_offset = bgm_input_idx + 1
    cur = "[vxf]"
    last_v_label = "[vxf]"
    for i, (_, _, _) in enumerate(SHOTS):
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

    fg = fg_main

    cmd = [
        "ffmpeg", "-y",
        *inputs,
        # Add subtitle inputs
        *(item for path in subtitle_pngs for item in ["-framerate", str(FPS), "-loop", "1", "-t", str(SHOT_DUR + 0.5), "-i", path]),
        "-filter_complex", fg,
        "-map", last_v_label, "-map", "[aout]",
        "-t", "30",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
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
