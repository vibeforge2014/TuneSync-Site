#!/usr/bin/env python3
"""
Compose the TuneSync intro video — **16:9 cinematic version**.

Same storyboard as the 9:16 build, but with 16:9 AI-generated hero images
designed for landscape viewing (Twitter, YouTube, web hero).
"""
import os
import subprocess
import sys
from typing import Optional
from PIL import Image, ImageDraw, ImageFont

ROOT = "/Users/qz/Desktop/TuneSync/site"
GEN_DIR = os.path.join(ROOT, "video/generated_169")
VIDEO_DIR = os.path.join(ROOT, "video")
BGM = os.path.join(VIDEO_DIR, "audio/bgm-A-upbeat.mp3")
OUT = os.path.join(VIDEO_DIR, "tunesync-intro-30s-16x9.mp4")

W, H, FPS = 1920, 1080, 30
TRANS = 0.4
OPEN_DUR = 2.4
CLOSE_DUR = 5.0
SHOT_DUR = 3.6

SHOTS = [
    ("shot_1.png", "Your music, all in one place."),
    ("shot_2.png", "One library from servers and folders."),
    ("shot_3.png", "Lyrics in sync, line by line."),
    ("shot_4.png", "Sing along — vocals removed, on-device."),
    ("shot_5.png", "AI DJ picks the next track."),
    ("shot_6.png", "Artwork, lyrics, year — filled in."),
    ("shot_7.png", "Charts and recommendations ready."),
]

OPEN_FILE = "shot_0.png"
CLOSE_FILE = "shot_8.png"
HELVETICA = "/System/Library/Fonts/Helvetica.ttc"


def render_subtitle_png(text: str, size_px: int = 44, max_w: int = 920) -> str:
    out_path = f"/tmp/_ts_sub_169_{abs(hash(text))}.png"
    font = ImageFont.truetype(HELVETICA, size_px, index=0)
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


def build_filtergraph(opening_input_idx, shot_input_indices, closing_input_idx, bgm_input_idx) -> str:
    parts = []
    for i, idx in enumerate(shot_input_indices):
        nframes = int(round(SHOT_DUR * FPS))
        dx = (i % 3 - 1) * 2.5
        dy = (i % 4 - 1.5) * 2.0
        z_expr = "1+0.0005*on"
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
    frames = os.path.join(VIDEO_DIR, "frames_169")
    os.makedirs(frames, exist_ok=True)

    # All 16:9 source images are already exactly 2752×1536 (close enough to 16:9).
    # Rescale once to 1920×1080 via ffmpeg lanczos.
    sources = [(OPEN_FILE, "open")] + [(s[0], f"shot_{i:02d}") for i, s in enumerate(SHOTS)] + [(CLOSE_FILE, "close")]
    for src_filename, dst_basename in sources:
        src_path = os.path.join(GEN_DIR, src_filename)
        dst_path = os.path.join(frames, f"{dst_basename}.png")
        if not os.path.exists(dst_path):
            print(f"upscaling {src_filename} -> {dst_basename}.png")
            subprocess.run([
                "ffmpeg", "-y", "-i", src_path,
                "-vf", "scale=1920:1080:flags=lanczos",
                "-frames:v", "1", dst_path,
            ], check=True, capture_output=True)

    subtitle_pngs = [render_subtitle_png(sub, size_px=44) for _, sub in SHOTS]

    inputs = []
    inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{OPEN_DUR}", "-i", os.path.join(frames, "open.png")])
    shot_input_indices = []
    for i, _ in enumerate(SHOTS):
        inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{SHOT_DUR}", "-i",
                       os.path.join(frames, f"shot_{i:02d}.png")])
        shot_input_indices.append(i + 1)
    closing_input_idx = len(SHOTS) + 1
    inputs.extend(["-framerate", str(FPS), "-loop", "1", "-t", f"{CLOSE_DUR}", "-i", os.path.join(frames, "close.png")])
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
            f"overlay=(W-w)/2:H-h-110:"
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
