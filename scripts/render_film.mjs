#!/usr/bin/env node
/**
 * Mahavisphot — film render.
 * Renders the 16-beat storyboard montage over the master audio with
 * Ken Burns motion, cinematic grade, film grain, and burned-in captions.
 *
 * Usage:
 *   node scripts/render_film.mjs [--res 1280x720] [--fps 30]
 *        [--captions on|off] [--motion 1.0] [--looks "..."] [--intensity 1.0]
 *        [--out mahavisphot_film.mp4] [--start 0] [--end 999] [--finalize]
 *
 * Chunked rendering: render ranges with --start/--end (TMP persists in
 * .render_tmp/), then pass --finalize on the last call to concat + mux audio.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FRAMES = 'build_frames/lineup_unique_art2/named_frames_1080p_jpg';
const AUDIO = 'अहं ब्रह्मास्मि.wav';

const args = Object.fromEntries(process.argv.slice(2).join(' ')
  .split('--').filter(Boolean).map(s => { const [k, ...v] = s.trim().split(/\s+/); return [k, v.join(' ') || true]; }));
const [W, H] = (args.res || '1280x720').split('x').map(Number);
const FPS = +(args.fps || 30);
const CAPTIONS = (args.captions || 'on') !== 'off';
const MOTION = args.motion === undefined ? 1.0 : +args.motion;
const INTENSITY = args.intensity === undefined ? 1.0 : +args.intensity;
const OUT = (typeof args.out === 'string' && args.out) || 'mahavisphot_film.mp4';
const START = +(args.start || 0);
const END = +(args.end || 99999);
const FINALIZE = !!args.finalize;

const story = JSON.parse(readFileSync(join(ROOT, 'editor/reconstructed_storyline.json'), 'utf8'));
const fm = JSON.parse(readFileSync(join(ROOT, FRAMES, 'named_frames_manifest.json'), 'utf8'));
const slugFile = {};
for (const f of fm.frames) {
  const stem = f.new_file.split('/').pop().replace(/\.jpg$/, '');
  slugFile[stem] = join(ROOT, FRAMES, stem + '.jpg');
}
const t2s = t => { const [m, s] = t.split(':'); return (+m) * 60 + parseFloat(s); };

const fontCandidates = [
  '/usr/share/fonts/truetype/lato/Lato-Black.ttf',
  '/usr/share/fonts/truetype/lato/Lato-Heavy.ttf',
  '/usr/share/fonts/truetype/lato/Lato-Bold.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
];
const FONT = fontCandidates.find(existsSync) || fontCandidates[3];
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, '’');

// build deterministic segment list (montage: split each beat across member frames)
const segs = [];
for (const b of story.beats) {
  const start = t2s(b.start), end = t2s(b.end), dur = end - start;
  const members = [b.primary_frame, ...(b.supporting_frames || [])]
    .filter((v, i, a) => v && slugFile[v] && a.indexOf(v) === i);
  const list = members.length ? members : [b.primary_frame];
  const per = dur / list.length;
  list.forEach((slug, i) => segs.push({
    beat: b.beat, title_en: b.title_en, file: slugFile[slug], dur: per, idx: segs.length,
  }));
}

const TMP = (typeof args.tmp === 'string' && args.tmp) || join(ROOT, '.render_tmp');
if (START === 0 && !FINALIZE) {
  if (existsSync(TMP)) { try { rmSync(TMP, { recursive: true, force: true, maxRetries: 3 }); } catch (e) {} }
}
mkdirSync(TMP, { recursive: true });

function vf(seg, frames, isFirst, isLast) {
  const zoomIn = seg.idx % 2 === 0;
  const amt = (0.0016 * MOTION).toFixed(5);
  const z = MOTION <= 0 ? '1'
    : zoomIn ? `min(zoom+${amt},1.16)` : `if(eq(on,1),1.16,max(zoom-${amt},1.0))`;
  const chain = [
    `scale=2400:1350:force_original_aspect_ratio=increase`,
    `crop=2400:1350`,
    `zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${FPS}`,
    `eq=contrast=${(1 + 0.07 * INTENSITY).toFixed(3)}:saturation=${(1 + 0.12 * INTENSITY).toFixed(3)}:brightness=0.01`,
    `vignette=PI/${(5 - INTENSITY).toFixed(2)}`,
    `noise=alls=${Math.round(6 * INTENSITY)}:allf=t`,
  ];
  if (CAPTIONS) {
    const yTitle = `h-h/7`, yBeat = `h-h/7-52`;
    chain.push(`drawbox=x=58:y=${yBeat}+2:w=4:h=86:color=0xFF2E3E@0.9:t=fill`);
    chain.push(`drawtext=fontfile=${FONT}:text='BEAT ${String(seg.beat).padStart(2, '0')} / 16':x=78:y=${yBeat}:fontsize=20:fontcolor=0xE8C06A:shadowx=1:shadowy=1:shadowcolor=black`);
    chain.push(`drawtext=fontfile=${FONT}:text='${esc(seg.title_en.toUpperCase())}':x=78:y=${yTitle}:fontsize=46:fontcolor=white:shadowx=2:shadowy=2:shadowcolor=0x000000AA`);
  }
  if (isFirst) chain.push(`fade=t=in:st=0:d=0.8`);
  if (isLast) chain.push(`fade=t=out:st=${Math.max(0, seg.dur - 0.9).toFixed(2)}:d=0.9`);
  chain.push('format=yuv420p');
  return chain.join(',');
}

const hi = Math.min(END, segs.length);
console.log(`[render] segs ${START}..${hi - 1} of ${segs.length} · ${W}x${H}@${FPS} captions=${CAPTIONS} motion=${MOTION} I=${INTENSITY}`);
for (let i = START; i < hi; i++) {
  const seg = segs[i];
  const frames = Math.max(2, Math.round(FPS * seg.dur));
  const out = join(TMP, `seg_${String(i).padStart(3, '0')}.mp4`);
  const r = spawnSync('ffmpeg', [
    '-y', '-loop', '1', '-i', seg.file,
    '-vf', vf(seg, frames, i === 0, i === segs.length - 1),
    '-frames:v', String(frames),
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p', '-r', String(FPS), out,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  if (r.status !== 0) { console.error(`seg ${i} FAILED\n` + (r.stderr || '').toString().split('\n').slice(-8).join('\n')); process.exit(1); }
  if (i % 8 === 0 || i === hi - 1) console.log(`  ${i + 1}/${segs.length} (beat ${seg.beat})`);
}

if (!FINALIZE) { console.log(`[render] chunk done (${START}..${hi - 1})`); process.exit(0); }

// finalize: concat all seg_*.mp4 in order, then mux audio
const files = readdirSync(TMP).filter(f => /^seg_\d+\.mp4$/.test(f)).sort();
console.log(`[render] finalize: concat ${files.length} segments`);
const listPath = join(TMP, 'concat.txt');
writeFileSync(listPath, files.map(f => `file '${join(TMP, f)}'`).join('\n'));
const silent = join(TMP, '_video.mp4');
let r = spawnSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', silent],
  { stdio: ['ignore', 'ignore', 'pipe'] });
if (r.status !== 0) { console.error('concat failed\n' + r.stderr.toString().split('\n').slice(-12).join('\n')); process.exit(1); }
const outPath = join(ROOT, OUT);
r = spawnSync('ffmpeg', ['-y', '-i', silent, '-i', join(ROOT, AUDIO),
  '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', outPath],
  { stdio: ['ignore', 'ignore', 'pipe'] });
if (r.status !== 0) { console.error('mux failed\n' + r.stderr.toString().split('\n').slice(-12).join('\n')); process.exit(1); }
try { rmSync(TMP, { recursive: true, force: true, maxRetries: 3 }); } catch (e) {}
console.log(`[render] DONE -> ${OUT}`);
