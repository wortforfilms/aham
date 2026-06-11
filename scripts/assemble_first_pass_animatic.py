#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import math
import shutil
import subprocess
import wave
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps, ImageStat


ROOT = Path(__file__).resolve().parents[1]
PYTHON_DEP_FFMPEG = Path("/opt/homebrew/Cellar/ffmpeg/8.1/bin/ffmpeg")
PYTHON_DEP_FFPROBE = Path("/opt/homebrew/Cellar/ffmpeg/8.1/bin/ffprobe")
DEFAULT_FPS = 24
WIDTH = 1920
HEIGHT = 1080


@dataclass
class Board:
    source: Path
    width: int
    height: int
    hash: int
    exact_sha: str
    duplicate_of: str | None = None


@dataclass
class Panel:
    source: Path
    board_index: int
    row: int
    col: int
    sequence: int
    image: Image.Image
    hash: int
    exact_sha: str
    score: float
    method: str
    duplicate_of: int | None = None


def rel(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def hamming(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def dhash(image: Image.Image, hash_size: int = 8) -> int:
    gray = image.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(gray.getdata())
    value = 0
    for y in range(hash_size):
        for x in range(hash_size):
            left = pixels[y * (hash_size + 1) + x]
            right = pixels[y * (hash_size + 1) + x + 1]
            value = (value << 1) | int(left > right)
    return value


def image_sha(image: Image.Image) -> str:
    normalized = image.convert("RGB").resize((128, 72), Image.Resampling.LANCZOS)
    return hashlib.sha256(normalized.tobytes()).hexdigest()


def rms_diff(left: Image.Image, right: Image.Image, size: tuple[int, int] = (96, 54)) -> float:
    a = left.convert("RGB").resize(size, Image.Resampling.LANCZOS)
    b = right.convert("RGB").resize(size, Image.Resampling.LANCZOS)
    total = 0
    pixels = size[0] * size[1] * 3
    for av, bv in zip(a.tobytes(), b.tobytes()):
        diff = av - bv
        total += diff * diff
    return math.sqrt(total / pixels)


def image_score(image: Image.Image) -> float:
    sample = image.convert("RGB").resize((180, 120), Image.Resampling.LANCZOS)
    stat = ImageStat.Stat(sample)
    contrast = sum(stat.stddev) / 3
    brightness = sum(stat.mean) / 3

    r, g, b = sample.split()
    rg = ImageStat.Stat(ImageChops.subtract(r, g)).stddev[0]
    yb = ImageStat.Stat(ImageChops.subtract(ImageChops.add(r, g, scale=2), b)).stddev[0]
    colorfulness = math.sqrt((rg * rg) + (yb * yb))

    edges = sample.convert("L").filter(ImageFilter.FIND_EDGES)
    edge_mean = ImageStat.Stat(edges).mean[0]
    entropy = sample.convert("L").entropy()
    blank_penalty = 0.55 if entropy < 3.0 or contrast < 16 else 1.0
    brightness_balance = 1.0 - min(abs(brightness - 82) / 180, 0.35)
    return (contrast * 1.45 + edge_mean * 1.2 + colorfulness * 0.38 + entropy * 9.5) * blank_penalty * brightness_balance


def grid_gutter_score(image: Image.Image) -> float:
    gray = image.convert("L")
    width, height = gray.size
    pixels = gray.load()
    scores: list[float] = []
    x_band = max(3, round(width * 0.004))
    y_band = max(3, round(height * 0.004))
    for x0 in [width / 4, width / 2, 3 * width / 4]:
        total = 0
        bright = 0
        for x in range(max(0, round(x0) - x_band), min(width, round(x0) + x_band + 1)):
            for y in range(height):
                total += 1
                bright += pixels[x, y] > 32
        scores.append(bright / total)
    for y0 in [height / 3, 2 * height / 3]:
        total = 0
        bright = 0
        for y in range(max(0, round(y0) - y_band), min(height, round(y0) + y_band + 1)):
            for x in range(width):
                total += 1
                bright += pixels[x, y] > 32
        scores.append(bright / total)
    return sum(scores) / len(scores)


def find_audio(audio_arg: str | None) -> Path:
    if audio_arg:
        audio = (ROOT / audio_arg).resolve()
        if not audio.exists():
            raise FileNotFoundError(f"Audio file not found: {audio}")
        return audio
    wavs = sorted(ROOT.glob("*.wav"), key=lambda p: (("varg" not in p.name.lower()), -p.stat().st_mtime))
    if not wavs:
        raise FileNotFoundError("No WAV files found in project root")
    return wavs[0]


def audio_duration(audio: Path) -> float:
    with wave.open(str(audio), "rb") as wav:
        return wav.getnframes() / float(wav.getframerate())


def find_storyboards() -> list[Path]:
    candidates = sorted(ROOT.glob("Gemini_Generated_Image*.png"), key=lambda p: (p.stat().st_mtime, p.name))
    if not candidates:
        candidates = sorted(ROOT.glob("*storyboard*.png"), key=lambda p: (p.stat().st_mtime, p.name))
    if not candidates:
        raise FileNotFoundError("No storyboard PNG candidates found")
    newest = max(p.stat().st_mtime for p in candidates)
    # Treat the latest import burst as "today's" storyboard set. The current batch
    # in this project is tightly grouped; this avoids dragging in older experiments.
    return [p for p in candidates if newest - p.stat().st_mtime <= 36 * 60 * 60]


def load_unique_boards(paths: list[Path]) -> tuple[list[Board], list[Board]]:
    unique: list[Board] = []
    all_boards: list[Board] = []
    for path in paths:
        image = Image.open(path).convert("RGB")
        board = Board(
            source=path,
            width=image.width,
            height=image.height,
            hash=dhash(image),
            exact_sha=image_sha(image),
        )
        for prior in unique:
            if board.exact_sha == prior.exact_sha or (hamming(board.hash, prior.hash) <= 3 and rms_diff(image, Image.open(prior.source)) <= 10):
                board.duplicate_of = prior.source.name
                break
        all_boards.append(board)
        if board.duplicate_of is None:
            unique.append(board)
    return unique, all_boards


def detected_panel_boxes(image: Image.Image) -> list[tuple[int, int, int, int]]:
    width, height = image.size
    target_width = 704
    scale = target_width / width
    small = image.resize((target_width, round(height * scale)), Image.Resampling.LANCZOS)
    small_width, small_height = small.size
    mask = small.convert("L").point(lambda value: 255 if value > 35 else 0, "L")
    mask = mask.filter(ImageFilter.MaxFilter(5))
    data = mask.load()
    visited = bytearray(small_width * small_height)
    boxes: list[tuple[int, int, int, int, int]] = []

    for y in range(small_height):
        for x in range(small_width):
            index = y * small_width + x
            if visited[index] or not data[x, y]:
                continue
            stack = [(x, y)]
            visited[index] = 1
            min_x = max_x = x
            min_y = max_y = y
            count = 0
            while stack:
                cx, cy = stack.pop()
                count += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for nx, ny in (
                    (cx + 1, cy),
                    (cx - 1, cy),
                    (cx, cy + 1),
                    (cx, cy - 1),
                    (cx + 1, cy + 1),
                    (cx - 1, cy - 1),
                    (cx + 1, cy - 1),
                    (cx - 1, cy + 1),
                ):
                    if nx < 0 or ny < 0 or nx >= small_width or ny >= small_height:
                        continue
                    neighbor = ny * small_width + nx
                    if not visited[neighbor] and data[nx, ny]:
                        visited[neighbor] = 1
                        stack.append((nx, ny))
            box_width = max_x - min_x + 1
            box_height = max_y - min_y + 1
            large_enough = count > small_width * small_height * 0.001
            panel_shaped = box_width > small_width * 0.08 and box_height > small_height * 0.08
            if large_enough and panel_shaped:
                pad = 4
                boxes.append((
                    max(0, min_x - pad),
                    max(0, min_y - pad),
                    min(small_width, max_x + pad),
                    min(small_height, max_y + pad),
                    count,
                ))

    boxes.sort(key=lambda box: (box[1], box[0]))
    scaled: list[tuple[int, int, int, int]] = []
    for left, top, right, bottom, _ in boxes:
        scaled.append((
            round(left / small_width * width),
            round(top / small_height * height),
            round(right / small_width * width),
            round(bottom / small_height * height),
        ))
    return scaled


def grid_panel_boxes(image: Image.Image) -> list[tuple[int, int, int, int]]:
    boxes = []
    cell_w = image.width / 4
    cell_h = image.height / 3
    inset_x = max(2, round(image.width * 0.0032))
    inset_y = max(2, round(image.height * 0.0032))
    for row in range(3):
        for col in range(4):
            boxes.append((
                round(col * cell_w + inset_x),
                round(row * cell_h + inset_y),
                round((col + 1) * cell_w - inset_x),
                round((row + 1) * cell_h - inset_y),
            ))
    return boxes


def extract_panels(boards: list[Board]) -> list[Panel]:
    panels: list[Panel] = []
    sequence = 0
    for board_index, board in enumerate(boards, start=1):
        image = Image.open(board.source).convert("RGB")
        gutter_score = grid_gutter_score(image)
        method = "detected" if gutter_score > 0.15 else "grid"
        boxes = detected_panel_boxes(image) if method == "detected" else grid_panel_boxes(image)
        if method == "detected" and len(boxes) < 4:
            method = "grid"
            boxes = grid_panel_boxes(image)

        for offset, box in enumerate(boxes):
            row = offset // 4 + 1 if method == "grid" else 0
            col = offset % 4 + 1 if method == "grid" else offset + 1
            crop = image.crop(box)
            panels.append(Panel(
                source=board.source,
                board_index=board_index,
                row=row,
                col=col,
                sequence=sequence,
                image=crop,
                hash=dhash(crop),
                exact_sha=image_sha(crop),
                score=image_score(crop),
                method=method,
            ))
            sequence += 1
    return panels


def dedupe_panels(panels: list[Panel]) -> list[Panel]:
    unique: list[Panel] = []
    for panel in panels:
        for idx, prior in enumerate(unique):
            same = panel.exact_sha == prior.exact_sha
            near = hamming(panel.hash, prior.hash) <= 3 and rms_diff(panel.image, prior.image) <= 12
            if same or near:
                panel.duplicate_of = prior.sequence
                if panel.score > prior.score:
                    unique[idx] = panel
                break
        if panel.duplicate_of is None:
            unique.append(panel)
    return sorted(unique, key=lambda p: p.sequence)


def select_strong_panels(unique_panels: list[Panel], duration: float, target: int | None) -> list[Panel]:
    if target is None:
        target = min(72, max(36, round(duration / 3.0)))
    if len(unique_panels) <= target:
        return unique_panels

    selected: list[Panel] = []
    used_sequences: set[int] = set()
    for slot in range(target):
        start = math.floor(slot * len(unique_panels) / target)
        end = math.floor((slot + 1) * len(unique_panels) / target)
        bucket = [p for p in unique_panels[start:max(end, start + 1)] if p.sequence not in used_sequences]
        if not bucket:
            continue
        chosen = max(bucket, key=lambda p: p.score)
        selected.append(chosen)
        used_sequences.add(chosen.sequence)
    return sorted(selected, key=lambda p: p.sequence)


def compose_frame(panel: Image.Image) -> Image.Image:
    panel = panel.convert("RGB")
    background = ImageOps.fit(panel, (WIDTH, HEIGHT), method=Image.Resampling.LANCZOS)
    background = background.filter(ImageFilter.GaussianBlur(22))
    shade = Image.new("RGB", (WIDTH, HEIGHT), "#07090c")
    background = Image.blend(background, shade, 0.36)

    foreground = ImageOps.contain(panel, (1780, 990), method=Image.Resampling.LANCZOS)
    x = (WIDTH - foreground.width) // 2
    y = (HEIGHT - foreground.height) // 2
    background.paste(foreground, (x, y))
    draw = ImageDraw.Draw(background)
    draw.rectangle((x - 2, y - 2, x + foreground.width + 1, y + foreground.height + 1), outline=(235, 235, 228), width=2)
    return background


def write_contact_sheet(panels: list[Panel], out: Path, cols: int = 8) -> None:
    thumb_w, thumb_h = 240, 135
    label_h = 28
    rows = math.ceil(len(panels) / cols)
    sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "#111111")
    draw = ImageDraw.Draw(sheet)
    for index, panel in enumerate(panels, start=1):
        frame = compose_frame(panel.image)
        frame.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        col = (index - 1) % cols
        row = (index - 1) // cols
        x = col * thumb_w + (thumb_w - frame.width) // 2
        y = row * (thumb_h + label_h)
        sheet.paste(frame, (x, y))
        label = f"{index:02d} b{panel.board_index:02d} r{panel.row}c{panel.col}"
        draw.text((col * thumb_w + 6, y + thumb_h + 5), label, fill=(235, 235, 235))
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, quality=90)


def render_video(ffmpeg: Path, concat_path: Path, audio: Path, output: Path, fps: int) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    command = [
        str(ffmpeg),
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_path),
        "-i",
        str(audio),
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-vf",
        f"fps={fps},format=yuv420p",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "20",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        "-shortest",
        str(output),
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        tail = "\n".join(result.stderr.splitlines()[-24:])
        raise RuntimeError(f"ffmpeg render failed:\n{tail}")


def probe_video(ffprobe: Path, output: Path) -> dict:
    result = subprocess.run([
        str(ffprobe),
        "-hide_banner",
        "-show_entries",
        "format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate",
        "-of",
        "json",
        str(output),
    ], capture_output=True, text=True)
    if result.returncode != 0:
        return {"ok": False, "stderr": result.stderr}
    return {"ok": True, **json.loads(result.stdout)}


def main() -> None:
    parser = argparse.ArgumentParser(description="Assemble a first-pass animatic from storyboard PNG sheets and a WAV.")
    parser.add_argument("--audio", help="Audio path relative to project root. Defaults to the first root WAV.")
    parser.add_argument("--target-panels", type=int, default=None)
    parser.add_argument("--fps", type=int, default=DEFAULT_FPS)
    parser.add_argument("--out-dir", default=None)
    parser.add_argument("--ffmpeg", default=str(PYTHON_DEP_FFMPEG if PYTHON_DEP_FFMPEG.exists() else shutil.which("ffmpeg") or "ffmpeg"))
    parser.add_argument("--ffprobe", default=str(PYTHON_DEP_FFPROBE if PYTHON_DEP_FFPROBE.exists() else shutil.which("ffprobe") or "ffprobe"))
    args = parser.parse_args()

    audio = find_audio(args.audio)
    duration = audio_duration(audio)
    stamp = datetime.now().strftime("%Y%m%dT%H%M%S")
    out_dir = ROOT / (args.out_dir or f"exports/varg_first_pass_animatic_{stamp}")
    frames_dir = out_dir / "frames"
    panels_dir = out_dir / "panel_crops"
    if frames_dir.exists():
        shutil.rmtree(frames_dir)
    if panels_dir.exists():
        shutil.rmtree(panels_dir)
    frames_dir.mkdir(parents=True, exist_ok=True)
    panels_dir.mkdir(parents=True, exist_ok=True)

    candidates = find_storyboards()
    unique_boards, all_boards = load_unique_boards(candidates)
    raw_panels = extract_panels(unique_boards)
    unique_panels = dedupe_panels(raw_panels)
    selected = select_strong_panels(unique_panels, duration, args.target_panels)
    per_panel = duration / len(selected)

    timeline_rows = []
    concat_lines = []
    for index, panel in enumerate(selected, start=1):
        crop_path = panels_dir / f"panel_{index:03d}_b{panel.board_index:02d}_r{panel.row}c{panel.col}.jpg"
        frame_path = frames_dir / f"frame_{index:03d}.jpg"
        panel.image.save(crop_path, quality=94, subsampling=1)
        compose_frame(panel.image).save(frame_path, quality=92, subsampling=1)
        start = (index - 1) * per_panel
        end = duration if index == len(selected) else index * per_panel
        timeline_rows.append({
            "index": index,
            "start": round(start, 3),
            "end": round(end, 3),
            "duration": round(end - start, 3),
            "source": panel.source.name,
            "board_index": panel.board_index,
            "row": panel.row,
            "col": panel.col,
            "sequence": panel.sequence,
            "score": round(panel.score, 3),
            "method": panel.method,
            "crop": rel(crop_path),
            "frame": rel(frame_path),
        })
        concat_lines.append(f"file '{frame_path.as_posix()}'")
        concat_lines.append(f"duration {end - start:.6f}")
    concat_lines.append(f"file '{(frames_dir / f'frame_{len(selected):03d}.jpg').as_posix()}'")

    concat_path = out_dir / "frames.concat.txt"
    timeline_tsv = out_dir / "timeline.tsv"
    contact_sheet = out_dir / "selected_panels_contact.jpg"
    manifest_path = out_dir / "manifest.json"
    output_video = out_dir / "varg_first_pass_animatic.mp4"

    concat_path.write_text("\n".join(concat_lines) + "\n", encoding="utf-8")
    headers = ["index", "start", "end", "duration", "source", "board_index", "row", "col", "sequence", "score", "method", "crop", "frame"]
    timeline_tsv.write_text(
        "\t".join(headers) + "\n" + "\n".join("\t".join(str(row[h]) for h in headers) for row in timeline_rows) + "\n",
        encoding="utf-8",
    )
    write_contact_sheet(selected, contact_sheet)

    render_video(Path(args.ffmpeg), concat_path, audio, output_video, args.fps)
    probe = probe_video(Path(args.ffprobe), output_video)

    manifest = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "audio": {
            "path": rel(audio),
            "duration": round(duration, 3),
        },
        "storyboards": {
            "candidateCount": len(candidates),
            "uniqueCount": len(unique_boards),
            "duplicates": [
                {"source": board.source.name, "duplicateOf": board.duplicate_of}
                for board in all_boards
                if board.duplicate_of
            ],
        },
        "panels": {
            "rawPanelCount": len(raw_panels),
            "uniquePanelCount": len(unique_panels),
            "selectedPanelCount": len(selected),
            "targetPanelCount": args.target_panels,
            "secondsPerPanel": round(per_panel, 3),
            "cropMethods": {
                method: sum(1 for panel in raw_panels if panel.method == method)
                for method in sorted({panel.method for panel in raw_panels})
            },
        },
        "outputs": {
            "video": rel(output_video),
            "timeline": rel(timeline_tsv),
            "contactSheet": rel(contact_sheet),
            "concat": rel(concat_path),
        },
        "probe": probe,
        "timeline": timeline_rows,
    }
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"audio: {audio.name} ({duration:.3f}s)")
    print(f"storyboards: {len(candidates)} candidates, {len(unique_boards)} unique")
    print(f"panels: {len(raw_panels)} raw, {len(unique_panels)} unique, {len(selected)} selected")
    print(f"video: {output_video}")
    print(f"manifest: {manifest_path}")


if __name__ == "__main__":
    main()
