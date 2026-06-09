#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path("/Users/vesahe/Downloads")
MEDIA = ROOT / "media" / "varg_ka_khel"
ORIGINALS = MEDIA / "originals"
CUTOUTS = MEDIA / "cutouts"
FRAMES = MEDIA / "frames"
TIMELINE_PATH = MEDIA / "timeline.tsv"
METADATA_PATH = MEDIA / "timeline.json"
MANIFEST_PATH = MEDIA / "manifest.json"
AUDIO_SRC = DOWNLOADS / "Varg Ka Khel (The Square Game).mp3"
AUDIO_DST = MEDIA / "varg_ka_khel.mp3"


@dataclass(frozen=True)
class Board:
    source: Path
    original_name: str
    title_hi: str
    title_en: str
    scene_group: str
    boxes: list[tuple[int, int, int, int]]
    captions: list[tuple[str, str]]


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def image_cover_frame(source: Path, index: int, title_hi: str, title_en: str, note: str) -> dict:
    image = Image.open(source).convert("RGB")
    cutout_path = CUTOUTS / f"panel_{index:04d}_cover.jpg"
    frame_path = FRAMES / f"frame_{index:04d}.jpg"
    image.save(cutout_path, quality=94)
    compose_frame(image, frame_path, title_hi, title_en, badge="INTRO")
    return {
        "index": index,
        "source": source.name,
        "row": "cover",
        "col": "cover",
        "title": title_en,
        "title_hi": title_hi,
        "description": note,
        "old_file": rel(source),
        "new_file": rel(cutout_path),
        "frame_1080p": rel(frame_path),
    }


def compose_frame(panel: Image.Image, output: Path, title_hi: str, title_en: str, badge: str) -> None:
    width, height = 1920, 1080
    background = ImageOps.fit(panel, (width, height), method=Image.Resampling.LANCZOS)
    background = background.filter(ImageFilter.GaussianBlur(24))
    background = Image.blend(background, Image.new("RGB", (width, height), "#07131d"), 0.34)

    panel = ImageOps.contain(panel, (1480, 820), method=Image.Resampling.LANCZOS)
    px = (width - panel.width) // 2
    py = 58
    background.paste(panel, (px, py))

    # Draw text with PIL's default font intentionally omitted; the editor renders captions.
    # This keeps generated frames clean and avoids font-path drift across machines.
    output.parent.mkdir(parents=True, exist_ok=True)
    background.save(output, quality=92, subsampling=1)


def board_boxes(kind: str) -> list[tuple[int, int, int, int]]:
    if kind == "wide_2752":
        xs = [68, 736, 1404, 2074]
        w = 620
        return [(x, 52, x + w, 697) for x in xs] + [(x, 830, x + w, 1426) for x in xs]
    xs = [66, 756, 1445, 2134]
    w = 626
    return [(x, 78, x + w, 706) for x in xs] + [(x, 824, x + w, 1452) for x in xs]


def panels_from_board(board: Board, start_index: int) -> list[dict]:
    source_copy = ORIGINALS / board.original_name
    shutil.copy2(board.source, source_copy)
    image = Image.open(board.source).convert("RGB")
    records = []
    for offset, box in enumerate(board.boxes, start=1):
        index = start_index + offset - 1
        title_hi, title_en = board.captions[offset - 1]
        panel = image.crop(box)
        cutout_path = CUTOUTS / f"panel_{index:04d}.jpg"
        frame_path = FRAMES / f"frame_{index:04d}.jpg"
        panel.save(cutout_path, quality=94, subsampling=1)
        compose_frame(panel, frame_path, title_hi, title_en, board.scene_group)
        records.append({
            "index": index,
            "source": board.original_name,
            "row": "top" if offset <= 4 else "bottom",
            "col": str(((offset - 1) % 4) + 1),
            "title": title_en,
            "title_hi": title_hi,
            "description": f"{board.title_hi} / {board.title_en}",
            "old_file": rel(source_copy),
            "new_file": rel(cutout_path),
            "frame_1080p": rel(frame_path),
        })
    return records


def probe_audio() -> dict:
    command = [
        "ffprobe",
        "-hide_banner",
        "-of",
        "json",
        "-show_format",
        "-show_streams",
        str(AUDIO_DST),
    ]
    result = subprocess.run(command, check=True, capture_output=True)
    data = json.loads(result.stdout.decode("utf-8", errors="replace"))
    tags = data.get("format", {}).get("tags", {})
    return {
        "duration": float(data.get("format", {}).get("duration", 234.559979)),
        "title": tags.get("title", "Varg Ka Khel (The Square Game)"),
        "artist": tags.get("artist", ""),
        "lyrics": tags.get("lyrics-eng", ""),
        "bitrate": int(data.get("format", {}).get("bit_rate", 0) or 0),
    }


def timeline_sections(duration: float) -> list[tuple[str, float, float, str]]:
    sections = [
        ("Intro", 0.00, 8.00, "Upbeat acoustic guitar intro, claps, tabla synth beat"),
        ("Chorus", 8.00, 34.00, "आओ करें घात की बात"),
        ("Confusion / Satire", 34.00, 62.00, "Pythagoras bag, rote learning pressure"),
        ("Dark Confusion", 62.00, 88.00, "Blackboard shadow and formula overload"),
        ("Playful Turn", 88.00, 118.00, "रटना छोड़ो, अब देखो ये खेल"),
        ("Simple Math", 118.00, 146.00, "3-4-5, squares and clear arithmetic"),
        ("Area Visual Magic", 146.00, 170.00, "Base square plus height square"),
        ("Secret Codes", 170.00, 194.00, "5, 12, 13 code language"),
        ("Proud History", 194.00, 218.00, "Baudhayan, Shulba Sutra, ancient discovery"),
        ("Chorus / Outro", 218.00, duration, "Kids chorus, applause, happy fade"),
    ]
    return [(name, start, min(end, duration), note) for name, start, end, note in sections if start < duration]


def build_timeline(records: list[dict], audio: dict) -> list[dict]:
    duration = audio["duration"]
    sections = timeline_sections(duration)
    groups = [
        (0, 1),
        (1, 9),
        (9, 17),
        (17, 25),
        (25, 33),
        (33, 41),
        (41, 49),
        (49, 57),
    ]
    # Split late boards across the lyric sections they visually support.
    section_for_record = []
    for index, record in enumerate(records):
        if index == 0:
            section_for_record.append(0)
        elif index < 9:
            section_for_record.append(1 if index < 5 else 2)
        elif index < 17:
            section_for_record.append(3)
        elif index < 25:
            section_for_record.append(4 if index < 21 else 5)
        elif index < 33:
            section_for_record.append(6 if index < 29 else 7)
        elif index < 41:
            section_for_record.append(8)
        elif index < 49:
            section_for_record.append(8 if index < 45 else 9)
        else:
            section_for_record.append(9)

    timeline = []
    for section_index, section in enumerate(sections):
        _, start, end, _ = section
        members = [i for i, value in enumerate(section_for_record) if value == section_index]
        if not members:
            continue
        step = (end - start) / len(members)
        for local, record_index in enumerate(members):
            record = records[record_index]
            scene_start = start + step * local
            scene_end = start + step * (local + 1)
            effects = []
            if section_index in {2, 3}:
                effects = ["grain", "vignette"]
            elif section_index in {6, 7, 9}:
                effects = ["grain", "sonic"]
            elif section_index in {4, 5}:
                effects = ["dust"]
            timeline.append({
                "frame": record["index"],
                "start": round(scene_start, 3),
                "end": round(scene_end, 3),
                "duration": round(scene_end - scene_start, 3),
                "source": str(record["index"]),
                "title_hi": record["title_hi"],
                "title_en": record["title"],
                "image_path": record["frame_1080p"],
                "rubab_overlay": "no",
                "effects": ",".join(effects),
                "note": f"{sections[section_index][0]}: {sections[section_index][3]}",
            })
    timeline.sort(key=lambda row: row["start"])
    return timeline


def write_tsv(rows: list[dict]) -> None:
    headers = ["frame", "start", "end", "duration", "source", "title_hi", "title_en", "image_path", "rubab_overlay", "effects", "note"]
    lines = ["\t".join(headers)]
    for row in rows:
        lines.append("\t".join(str(row.get(header, "")).replace("\t", " ") for header in headers))
    TIMELINE_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    CUTOUTS.mkdir(parents=True, exist_ok=True)
    FRAMES.mkdir(parents=True, exist_ok=True)
    shutil.copy2(AUDIO_SRC, AUDIO_DST)

    boards = [
        Board(
            DOWNLOADS / "Gemini_Generated_Image_hwjfbdhwjfbdhwjf.png",
            "board_02_intro_chorus.png",
            "दृश्य 1-2",
            "Intro, Chorus, and Rote Confusion",
            "INTRO",
            board_boxes("wide_2752"),
            [
                ("आओ करें घात की बात", "Let's Talk About Exponents"),
                ("सात का वर्ग मतलब सात गुना सात", "Seven Squared Means Seven Times Seven"),
                ("त्रिभुज के जो हैं तीन हाथ", "Triangle's Three Hands"),
                ("कमाल खेल है वर्ग के साथ", "Squares Are a Wonderful Game"),
                ("पाइथागोरस के नाम पर बस्ता जो खुलवाया", "Bag Opened in Pythagoras' Name"),
                ("बेचारे कुचली-कुचली को कुछ समझ ना आया", "Kutchli-Kutchli Couldn't Understand"),
                ("रट-रट कर फॉर्मूला उसकी बुद्धि चकराई", "Rote Formula Confused Her Mind"),
                ("ब्लैकबोर्ड की काली छाया सपने में भी आई", "Blackboard Shadow in Her Dreams"),
            ],
        ),
        Board(
            DOWNLOADS / "Gemini_Generated_Image_uaokbyuaokbyuaok.png",
            "board_03_confusion_cave.png",
            "दृश्य 2",
            "Confusion Cave",
            "DARK",
            board_boxes("wide_2816"),
            [
                ("रटने का बोझ", "Weight of Rote Learning"),
                ("कुचली-कुचली - बोझ बढ़ रहा है", "The Pressure Grows"),
                ("सबसे काला श्यामपट", "The Darkest Blackboard"),
                ("भ्रम ना की गूंज", "Echo of Confusion"),
                ("भ्रम की गूंज", "Confusion Echo"),
                ("चरम बिंदु", "Peak Pressure"),
                ("गहरी गुफा", "Deep Cave"),
                ("रट-रट कर बुद्धि चकराई", "Rote Learning Spins the Mind"),
            ],
        ),
        Board(
            DOWNLOADS / "Gemini_Generated_Image_99n1699n1699n169.png",
            "board_04_playful_turn.png",
            "दृश्य 3",
            "The Playful Turn",
            "PLAY",
            board_boxes("wide_2816"),
            [
                ("खेल का समय", "Time to Play"),
                ("अंकों का नाच - बोझ अब नहीं", "Numbers Dance, No More Burden"),
                ("नया ब्लैकबोर्ड, साफ मन", "New Blackboard, Clear Mind"),
                ("साथी हाथ बढ़ाना, मिलकर सीखना", "Learn Together"),
                ("जंगल का रास्ता, अब साफ है", "The Path is Clear"),
                ("मस्तिष्क का द्वार, प्रकाश का खेल", "Mind Door Opens"),
                ("सीखने का सफर, हर कदम नया", "Learning Journey"),
                ("रचनात्मक मज़ा, गणित है खेल", "Creative Math Play"),
            ],
        ),
        Board(
            DOWNLOADS / "Gemini_Generated_Image_3zcmxn3zcmxn3zcm.png",
            "board_05_exponents_codes.png",
            "दृश्य 8",
            "Exponents and Codes",
            "CODE",
            board_boxes("wide_2816"),
            [
                ("कोड की भाषा", "Code Language"),
                ("घात का जादू - नए कोड की खोज", "Exponent Magic"),
                ("रस्सी तिरछी मुस्काई, मज़ा आया", "The Slanted Rope Smiles"),
                ("गुप्त ट्रिक - ५, १२ और १३ का खेल", "Secret 5-12-13 Trick"),
                ("आधार पे एक चौकोर सजाओ", "Build a Square on the Base"),
                ("लंब पे भी एक वैसा ही बनाओ", "Build One on the Height"),
                ("तिरछी लाइन का वर्ग बन जाएगा!", "The Diagonal Square Appears"),
                ("गणित का मज़ा घात के साथ!", "Math Joy with Exponents"),
            ],
        ),
        Board(
            DOWNLOADS / "Gemini_Generated_Image_2isj3b2isj3b2isj.png",
            "board_06_ancient_history.png",
            "दृश्य 5",
            "Ancient Discovery",
            "HISTORY",
            board_boxes("wide_2816"),
            [
                ("प्राचीन खोज की खोज", "Ancient Search"),
                ("समय का खेल - एक नया रूप", "Time Game, New Form"),
                ("तिरछी रस्सी की खोज - रहस्य खुला", "Slanted Rope Discovery"),
                ("महान ट्रिक का राज - एक गहरा संबंध", "Great Trick Revealed"),
                ("प्राचीन आधार पे एक चौकोर सजाओ", "Ancient Base Square"),
                ("लंब पे भी एक वैसा ही बनाओ", "Height Square Too"),
                ("तिरछी लाइन का वर्ग बन जाएगा!", "Diagonal Square Forms"),
                ("महान शुल्ब - भारत का ज्ञान", "Shulba Wisdom of India"),
            ],
        ),
        Board(
            DOWNLOADS / "Gemini_Generated_Image_hqrrolhqrrolhqrr.png",
            "board_07_modern_legacy.png",
            "दृश्य 6",
            "The Modern Legacy",
            "LEGACY",
            board_boxes("wide_2816"),
            [
                ("भविष्य की नीव", "Foundation of the Future"),
                ("समय का खेल - नया अवतार", "Time Game, New Avatar"),
                ("तिरछी रस्सी का नया रास्ता - नेटवर्क खुला", "Rope Becomes Network"),
                ("महान ट्रिक का कोड - वैश्विक ज्ञान", "Global Code of the Trick"),
                ("प्राचीन आधार - नया रूप", "Ancient Base, New Form"),
                ("लंब की कहानी - एक साथ", "Height Story Together"),
                ("तिरछी लाइन का वर्ग बन जाएगा! - दुनिया बनी", "Diagonal Square Builds a World"),
                ("महान शुल्ब - भारत का ज्ञान, दुनिया का उपहार", "India's Knowledge, World's Gift"),
            ],
        ),
        Board(
            DOWNLOADS / "Gemini_Generated_Image_7t4wge7t4wge7t4w.png",
            "board_08_final_triumph.png",
            "दृश्य 7",
            "Final Triumph",
            "FINAL",
            board_boxes("wide_2816"),
            [
                ("कोड की भाषा", "Code Language"),
                ("घात का जादू - नए कोड की खोज", "Exponent Magic Reprise"),
                ("रस्सी तिरछी मुस्काई, मज़ा आया", "Slanted Rope Smiles Again"),
                ("गुप्त ट्रिक - ५, १२ और १३ का खेल", "Secret Trick Returns"),
                ("आधार पे एक चौकोर सजाओ", "Build the Base Square"),
                ("लंब पे भी एक वैसा ही बनाओ", "Build the Height Square"),
                ("तिरछी लाइन का वर्ग बन जाएगा!", "Diagonal Square Victory"),
                ("गणित का मज़ा घात के साथ!", "Final Math Joy"),
            ],
        ),
    ]

    cover_src = DOWNLOADS / "Gemini_Generated_Image_dlbjl4dlbjl4dlbj.png"
    cover_copy = ORIGINALS / "board_01_cover.png"
    shutil.copy2(cover_src, cover_copy)
    records = [
        image_cover_frame(
            cover_copy,
            1,
            "आओ करें घात की बात",
            "Varg Ka Khel: Let's Talk About Exponents",
            "Opening cover poster for the song edit.",
        )
    ]
    next_index = 2
    for board in boards:
        batch = panels_from_board(board, next_index)
        records.extend(batch)
        next_index += len(batch)

    audio = probe_audio()
    timeline = build_timeline(records, audio)
    write_tsv(timeline)

    manifest = {
        "project": "Varg Ka Khel (The Square Game)",
        "generated_at": subprocess.check_output(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"], text=True).strip(),
        "audio": {
            "path": rel(AUDIO_DST),
            **audio,
        },
        "frame_count": len(records),
        "timeline_path": rel(TIMELINE_PATH),
        "metadata_path": rel(METADATA_PATH),
        "frames": records,
        "lyric_sections": [
            {"name": name, "start": start, "end": end, "note": note}
            for name, start, end, note in timeline_sections(audio["duration"])
        ],
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    metadata = {
        "note": "Varg Ka Khel generated from supplied storyboard boards and embedded song lyrics.",
        "audio_duration_seconds": audio["duration"],
        "shot_count": len(timeline),
        "lyrics": audio["lyrics"],
        "lyric_sections": manifest["lyric_sections"],
        "frame_manifest": rel(MANIFEST_PATH),
    }
    METADATA_PATH.write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps({
        "ok": True,
        "frames": len(records),
        "timeline_shots": len(timeline),
        "duration": audio["duration"],
        "manifest": rel(MANIFEST_PATH),
        "timeline": rel(TIMELINE_PATH),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
