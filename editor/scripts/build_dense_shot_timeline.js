const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");
const MANIFEST_PATH = "build_frames/lineup_unique_art2/named_frames_1080p_jpg/named_frames_manifest.json";
const TIMELINE_PATH = "build_frames/lineup_unique_art2/prior_board_137_shot_timeline.tsv";
const METADATA_PATH = "build_frames/lineup_unique_art2/prior_board_137_shot_timeline.json";
const AUDIO_DURATION = 201.84;

const sections = [
  [1, 24, "Intro road, ney, shankh prelude"],
  [25, 35, "Sanskrit blast and red sonic rupture"],
  [36, 57, "Haryanvi chorus and concrete impact"],
  [58, 69, "Pakhtoon descent and mountain resolve"],
  [70, 84, "Blood manuscript and Natyashastra chamber"],
  [85, 97, "Unity, Ganga, Tulsi, shared grief"],
  [98, 108, "Brahman void and eclipse threshold"],
  [109, 137, "Bharat march, vibration, Om, final silence"],
];

function sectionFor(index) {
  const match = sections.find(([start, end]) => index >= start && index <= end);
  return match ? match[2] : "Board sequence";
}

function escapeTsv(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / ");
}

function weightFor(frame) {
  const text = `${frame.slug} ${frame.title} ${frame.description}`.toLowerCase();
  let weight = 1;
  if (/abstract|shadow|blank|black|dark|shards|cut/.test(text)) weight *= 0.72;
  if (/impact|blast|fracture|explosion|burst|waveform|vibration|fist|sonic/.test(text)) weight *= 1.18;
  if (/rubab|flute|ney|music|notes|bell|chant|om/.test(text)) weight *= 1.12;
  if (/ganga|tulsi|handshake|unity|bharat|brahman|eclipse|void|silence|final/.test(text)) weight *= 1.28;
  if (/wide|long|group|assembly|procession|march/.test(text)) weight *= 1.16;
  if (/close|detail|mouth|hands|eyes/.test(text)) weight *= 0.9;
  return Math.max(0.55, Math.min(weight, 1.8));
}

function rubabOverlayFor(frame) {
  const text = `${frame.slug} ${frame.title} ${frame.description}`.toLowerCase();
  return /rubab|music|flute|ney|notes/.test(text);
}

function effectsFor(frame) {
  const text = `${frame.slug} ${frame.title} ${frame.description}`.toLowerCase();
  const effects = ["grain", "vignette"];
  if (/dust|smoke|wind|debris|fracture|explosion|burst/.test(text)) effects.push("dust");
  if (/sonic|wave|vibration|blast|eclipse|om|vortex|rings/.test(text)) effects.push("sonic");
  return effects.join(",");
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(ROOT, MANIFEST_PATH), "utf8"));
  const frames = [...manifest.frames].sort((a, b) => a.index - b.index);
  const totalWeight = frames.reduce((sum, frame) => sum + weightFor(frame), 0);
  const scale = AUDIO_DURATION / totalWeight;
  let cursor = 0;

  const rows = [];
  const timeline = frames.map((frame, shotIndex) => {
    const duration = shotIndex === frames.length - 1 ? AUDIO_DURATION - cursor : weightFor(frame) * scale;
    const start = round(cursor);
    const end = shotIndex === frames.length - 1 ? AUDIO_DURATION : round(cursor + duration);
    cursor += duration;

    const shot = {
      frame: shotIndex + 1,
      source: frame.index,
      start,
      end,
      duration: round(end - start),
      title_hi: `Shot ${String(shotIndex + 1).padStart(3, "0")}`,
      title_en: `${String(shotIndex + 1).padStart(3, "0")} ${frame.title}`,
      image_path: frame.new_file,
      rubab_overlay: rubabOverlayFor(frame) ? "yes" : "no",
      effects: effectsFor(frame),
      note: `${sectionFor(frame.index)}. ${frame.description}`,
    };
    rows.push(shot);
    return {
      ...shot,
      slug: frame.slug,
      description: frame.description,
      weight: round(weightFor(frame)),
      source_old_file: frame.old_file,
    };
  });

  const headers = ["frame", "start", "end", "duration", "title_hi", "title_en", "source", "image_path", "rubab_overlay", "effects", "note"];
  const tsv = [
    headers.join("\t"),
    ...rows.map((row) => headers.map((header) => escapeTsv(row[header])).join("\t")),
  ].join("\n") + "\n";

  const metadata = {
    note: "Dense shot-level timeline extracted from prior scene boards using all 137 named unique frames.",
    timeline_id: "prior-board-137-shots",
    audio_duration_seconds: AUDIO_DURATION,
    source_manifest: MANIFEST_PATH,
    shot_count: rows.length,
    minimum_requested_shots: 80,
    exceeds_requested_shots: rows.length > 80,
    sections: sections.map(([start, end, title]) => ({ start_frame: start, end_frame: end, title })),
    timeline,
  };

  await fs.writeFile(path.join(ROOT, TIMELINE_PATH), tsv, "utf8");
  await fs.writeFile(path.join(ROOT, METADATA_PATH), JSON.stringify(metadata, null, 2), "utf8");
  console.log(`Wrote ${rows.length} shots to ${TIMELINE_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
