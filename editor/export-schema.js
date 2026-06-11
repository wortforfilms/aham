"use strict";
/**
 * Mahavisphot — render/export schema parity adapter (Step 6).
 *
 * Converts the verified timeline-runtime document model into a deterministic
 * export manifest that renderers, package writers, and evidence collectors can
 * consume. The adapter also accepts the current editor payload and builds a
 * timeline-runtime v2 document from it, so legacy scene-based exports and the
 * headless editor runtime share one contract.
 */
const crypto = require("node:crypto");
const timeline = require("./timeline-runtime");

const EXPORT_SCHEMA_VERSION = "mahavisphot.export.v1";
const EXPORT_SCHEMA_EVIDENCE_VERSION = "mahavisphot.export.evidence.v1";
const EXPORT_MODES = ["manifest", "preview-mp4", "pro-uhd"];
const EXPORT_RENDER_STATUSES = ["ready", "degraded", "blocked"];
const SYSTEM_TRACK_IDS = new Set([
  "track_scene_video",
  "track_master_audio",
  "track_captions",
  "track_vfx",
  "track_markers",
  "track_compositions",
]);

function clone(value, fallback = null) {
  try {
    return value == null ? fallback : JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function roundTime(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 1000000) / 1000000 : 0;
}

function positiveDuration(start, end, fallback = 1) {
  const duration = roundTime(Number(end) - Number(start));
  return duration > 0 ? duration : fallback;
}

function compactText(value, fallback = "") {
  const text = String(value ?? fallback).replace(/\s+/g, " ").trim();
  return text;
}

function stableId(prefix, raw, index = 0) {
  const text = String(raw ?? `${prefix}-${index + 1}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 72);
  return `${prefix}_${text || index + 1}`;
}

function sourceHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value ?? null)).digest("hex").slice(0, 16);
}

function validationResult(errors) {
  return { ok: errors.length === 0, errors };
}

function error(code, field, message) {
  return { code, field, message };
}

function normalizeScene(scene, index) {
  const start = roundTime(scene?.start);
  const end = roundTime(scene?.end);
  const duration = positiveDuration(start, end, roundTime(scene?.duration) || 1);
  return {
    id: String(scene?.id ?? index + 1),
    numericId: Number(scene?.id ?? index + 1),
    start,
    end: end > start ? end : roundTime(start + duration),
    duration,
    titleHi: compactText(scene?.titleHi),
    titleEn: compactText(scene?.titleEn, `Scene ${index + 1}`),
    frameIndex: scene?.frameIndex ?? null,
    imagePath: compactText(scene?.imagePath || scene?.path),
    image: compactText(scene?.image),
    rubabOverlay: Boolean(scene?.rubabOverlay),
    note: compactText(scene?.note),
    captions: compactText(scene?.captions || [scene?.titleHi, scene?.titleEn].filter(Boolean).join("\n")),
    composite: clone(scene?.composite, {}),
    effects: {
      grain: Boolean(scene?.effects?.grain),
      vignette: Boolean(scene?.effects?.vignette),
      dust: Boolean(scene?.effects?.dust),
      sonic: Boolean(scene?.effects?.sonic),
    },
    transition: {
      type: compactText(scene?.transition?.type, "cut"),
      duration: roundTime(scene?.transition?.duration),
    },
  };
}

function normalizeScenes(input) {
  return Array.isArray(input) ? input.map(normalizeScene).sort((a, b) => a.start - b.start) : [];
}

function validateExportRequest(input) {
  const errors = [];
  if (!isObject(input)) {
    return validationResult([error("invalid_payload", "payload", "Export request must be an object.")]);
  }
  if (input.schemaVersion !== undefined && typeof input.schemaVersion !== "string") {
    errors.push(error("invalid_schema_version", "schemaVersion", "Schema version must be a string when supplied."));
  }
  if (input.exportMode !== undefined && !EXPORT_MODES.includes(input.exportMode)) {
    errors.push(error("invalid_export_mode", "exportMode", `Export mode must be one of ${EXPORT_MODES.join(", ")}.`));
  }
  if (input.duration !== undefined && (!Number.isFinite(Number(input.duration)) || Number(input.duration) <= 0)) {
    errors.push(error("invalid_duration", "duration", "Export duration must be a positive number when supplied."));
  }
  if (input.audioPath !== undefined && typeof input.audioPath !== "string") {
    errors.push(error("invalid_audio_path", "audioPath", "Audio path must be a string when supplied."));
  }
  if (input.rubabPath !== undefined && typeof input.rubabPath !== "string") {
    errors.push(error("invalid_rubab_path", "rubabPath", "Rubab overlay path must be a string when supplied."));
  }
  if (input.timelineDoc !== undefined && !isObject(input.timelineDoc)) {
    errors.push(error("invalid_timeline_doc", "timelineDoc", "Timeline document must be an object when supplied."));
  }
  if (input.scenes !== undefined && !Array.isArray(input.scenes)) {
    errors.push(error("invalid_scenes", "scenes", "Scenes must be an array when supplied."));
  }
  if (input.dynamicTracks !== undefined && !Array.isArray(input.dynamicTracks)) {
    errors.push(error("invalid_dynamic_tracks", "dynamicTracks", "Dynamic tracks must be an array when supplied."));
  }
  if (input.compositions !== undefined && !Array.isArray(input.compositions)) {
    errors.push(error("invalid_compositions", "compositions", "Compositions must be an array when supplied."));
  }

  const scenes = Array.isArray(input.scenes) ? input.scenes : [];
  scenes.forEach((scene, index) => {
    const start = Number(scene?.start);
    const end = Number(scene?.end);
    if (!Number.isFinite(start)) errors.push(error("invalid_scene_start", `scenes[${index}].start`, "Scene start must be numeric."));
    if (!Number.isFinite(end)) errors.push(error("invalid_scene_end", `scenes[${index}].end`, "Scene end must be numeric."));
    if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
      errors.push(error("invalid_scene_range", `scenes[${index}]`, "Scene end must be greater than start."));
    }
  });

  const dynamicTracks = Array.isArray(input.dynamicTracks) ? input.dynamicTracks : [];
  dynamicTracks.forEach((track, trackIndex) => {
    if (!["video", "audio"].includes(track?.kind)) {
      errors.push(error("invalid_dynamic_track_kind", `dynamicTracks[${trackIndex}].kind`, "Dynamic track kind must be video or audio."));
    }
    if (track?.clips !== undefined && !Array.isArray(track.clips)) {
      errors.push(error("invalid_dynamic_clips", `dynamicTracks[${trackIndex}].clips`, "Dynamic track clips must be an array."));
    }
    (Array.isArray(track?.clips) ? track.clips : []).forEach((clip, clipIndex) => {
      const start = Number(clip?.start);
      const end = Number(clip?.end ?? (Number(clip?.start) + Number(clip?.duration)));
      if (!Number.isFinite(start)) errors.push(error("invalid_dynamic_clip_start", `dynamicTracks[${trackIndex}].clips[${clipIndex}].start`, "Dynamic clip start must be numeric."));
      if (!Number.isFinite(end)) errors.push(error("invalid_dynamic_clip_end", `dynamicTracks[${trackIndex}].clips[${clipIndex}].end`, "Dynamic clip end must be numeric or derivable from duration."));
      if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
        errors.push(error("invalid_dynamic_clip_range", `dynamicTracks[${trackIndex}].clips[${clipIndex}]`, "Dynamic clip end must be greater than start."));
      }
    });
  });

  if (!input.timelineDoc && scenes.length === 0 && dynamicTracks.length === 0) {
    errors.push(error("missing_timeline_source", "timelineDoc", "Provide timelineDoc, scenes, or dynamicTracks for export schema parity."));
  }
  return validationResult(errors);
}

function baseComposition(payload, duration) {
  return {
    id: "comp_main",
    name: compactText(payload.title, "Main"),
    parentId: null,
    width: Number(payload.width) || 1920,
    height: Number(payload.height) || 1080,
    root: true,
    start: 0,
    duration,
  };
}

function addTrack(doc, track) {
  if (!doc.tracks.some((item) => item.id === track.id)) doc.tracks.push(track);
  return track;
}

function addClip(doc, clip) {
  doc.clips.push(clip);
  return clip;
}

function timelineDocFromPayload(payload = {}) {
  const scenes = normalizeScenes(payload.scenes);
  const dynamicTracks = Array.isArray(payload.dynamicTracks) ? payload.dynamicTracks : [];
  const compositionPayloads = Array.isArray(payload.compositions) ? payload.compositions : [];
  const sceneDuration = scenes.length ? Math.max(...scenes.map((scene) => scene.end)) : 0;
  const dynamicDuration = dynamicTracks.flatMap((track) => Array.isArray(track.clips) ? track.clips : [])
    .reduce((max, clip) => Math.max(max, Number(clip.end ?? (Number(clip.start) + Number(clip.duration))) || 0), 0);
  const compositionDuration = compositionPayloads.reduce((max, comp) => Math.max(max, Number(comp.end ?? (Number(comp.start) + Number(comp.duration))) || 0), 0);
  const duration = roundTime(Number(payload.duration) || sceneDuration || dynamicDuration || compositionDuration || 1);
  const root = baseComposition(payload, duration);
  const doc = {
    schemaVersion: timeline.CURRENT_VERSION,
    id: stableId("project", payload.projectId || payload.title || payload.sourceTimeline?.id || `export-${sourceHash(payload)}`),
    name: compactText(payload.title, "Mahavisphot Export"),
    fps: Number(payload.fps) || 24,
    duration,
    compositions: [root],
    tracks: [],
    clips: [],
  };

  addTrack(doc, { id: "track_scene_video", compositionId: root.id, kind: "video", name: "V1 Scene Plate", index: 0, locked: false, muted: false, meta: { system: true, role: "scene_plate" } });
  addTrack(doc, { id: "track_compositions", compositionId: root.id, kind: "video", name: "VC Nested Compositions", index: 1, locked: false, muted: false, meta: { system: true, role: "composition_instances" } });
  addTrack(doc, { id: "track_captions", compositionId: root.id, kind: "caption", name: "CC Captions", index: 2, locked: false, muted: false, meta: { system: true, role: "captions" } });
  addTrack(doc, { id: "track_vfx", compositionId: root.id, kind: "vfx", name: "FX VFX Windows", index: 3, locked: false, muted: false, meta: { system: true, role: "vfx" } });
  addTrack(doc, { id: "track_markers", compositionId: root.id, kind: "marker", name: "M Markers", index: 4, locked: false, muted: false, meta: { system: true, role: "markers" } });
  addTrack(doc, { id: "track_master_audio", compositionId: root.id, kind: "audio", name: "A1 Master Audio", index: 5, locked: false, muted: false, meta: { system: true, role: "master_audio" } });

  scenes.forEach((scene, index) => {
    const assetId = scene.imagePath || scene.image || `scene:${scene.id}`;
    addClip(doc, {
      id: stableId("clip_scene", scene.id, index),
      trackId: "track_scene_video",
      source: { type: "asset", id: assetId },
      name: scene.titleEn || scene.titleHi || `Scene ${scene.id}`,
      start: scene.start,
      duration: scene.duration,
      in: 0,
      out: scene.duration,
      meta: { sceneId: scene.id, imagePath: scene.imagePath, transition: scene.transition, composite: scene.composite, effects: scene.effects },
    });
    if (scene.captions) {
      addClip(doc, {
        id: stableId("clip_caption", scene.id, index),
        trackId: "track_captions",
        source: { type: "asset", id: `caption:${scene.id}` },
        name: `Caption ${scene.id}`,
        start: scene.start,
        duration: scene.duration,
        meta: { sceneId: scene.id, text: scene.captions, titleHi: scene.titleHi, titleEn: scene.titleEn },
      });
    }
    const enabledEffects = Object.entries(scene.effects).filter(([, enabled]) => enabled).map(([key]) => key);
    if (enabledEffects.length || scene.rubabOverlay) {
      addClip(doc, {
        id: stableId("clip_vfx", scene.id, index),
        trackId: "track_vfx",
        source: { type: "asset", id: `vfx:${scene.id}` },
        name: `VFX ${scene.id}`,
        start: scene.start,
        duration: scene.duration,
        meta: { sceneId: scene.id, effects: enabledEffects, rubabOverlay: scene.rubabOverlay },
      });
    }
  });

  if (payload.audioPath) {
    addClip(doc, {
      id: "clip_master_audio",
      trackId: "track_master_audio",
      source: { type: "asset", id: payload.audioPath },
      name: compactText(payload.audioMix?.masterName || payload.audioPath, "Master Audio"),
      start: 0,
      duration,
      in: 0,
      out: duration,
      meta: { audioMix: clone(payload.audioMix, {}), path: payload.audioPath },
    });
  }

  (Array.isArray(payload.markers) ? payload.markers : []).forEach((marker, index) => {
    const at = roundTime(marker?.time ?? marker?.atSec ?? marker?.start);
    addClip(doc, {
      id: stableId("clip_marker", marker?.id || marker?.label, index),
      trackId: "track_markers",
      source: { type: "asset", id: `marker:${marker?.id || index + 1}` },
      name: compactText(marker?.label, `Marker ${index + 1}`),
      start: at,
      duration: 0.001,
      meta: clone(marker, {}),
    });
  });

  dynamicTracks.forEach((track, trackIndex) => {
    const kind = track.kind === "audio" ? "audio" : "video";
    const trackId = stableId("track_dynamic", track.id || track.label, trackIndex);
    addTrack(doc, {
      id: trackId,
      compositionId: root.id,
      kind,
      name: compactText(track.title || track.label, `${kind.toUpperCase()} Dynamic ${trackIndex + 1}`),
      index: 10 + trackIndex,
      locked: Boolean(track.locked),
      muted: track.visible === false,
      meta: { dynamic: true, sourceId: track.id || null, label: track.label || null },
    });
    (Array.isArray(track.clips) ? track.clips : []).forEach((clip, clipIndex) => {
      const start = roundTime(clip.start);
      const end = roundTime(clip.end ?? (Number(clip.start) + Number(clip.duration)));
      const durationValue = positiveDuration(start, end, 1);
      addClip(doc, {
        id: stableId("clip_dynamic", `${track.id || trackIndex}-${clip.id || clip.title || clipIndex}`, clipIndex),
        trackId,
        source: { type: "asset", id: clip.path || clip.imagePath || clip.image || clip.sourceId || `${trackId}:${clipIndex + 1}` },
        name: compactText(clip.title, `${track.label || trackId} Clip ${clipIndex + 1}`),
        start,
        duration: durationValue,
        in: roundTime(clip.trimIn ?? clip.in ?? 0),
        out: roundTime(clip.trimOut ?? clip.out ?? durationValue),
        meta: { dynamicTrackId: track.id || trackId, sourceType: clip.sourceType || kind, sceneId: clip.sceneId ?? null, frameIndex: clip.frameIndex ?? null },
      });
    });
  });

  compositionPayloads.forEach((composition, compositionIndex) => {
    const compId = stableId("comp", composition.id || composition.name, compositionIndex);
    const compStart = roundTime(composition.start);
    const compDuration = roundTime(composition.duration || positiveDuration(composition.start, composition.end, 1));
    doc.compositions.push({
      id: compId,
      name: compactText(composition.name, `Composition ${compositionIndex + 1}`),
      parentId: root.id,
      width: Number(composition.width) || root.width,
      height: Number(composition.height) || root.height,
      root: false,
      start: compStart,
      duration: compDuration,
      meta: { sourceId: composition.id || null },
    });
    addClip(doc, {
      id: stableId("clip_comp", compId, compositionIndex),
      trackId: "track_compositions",
      source: { type: "composition", id: compId },
      name: compactText(composition.name, `Composition ${compositionIndex + 1}`),
      start: compStart,
      duration: compDuration,
      meta: { compositionId: compId, sourceId: composition.id || null },
    });

    const compTrackIds = new Map();
    (Array.isArray(composition.clips) ? composition.clips : []).forEach((clip, clipIndex) => {
      const kind = clip.mediaKind === "audio" ? "audio" : "video";
      if (!compTrackIds.has(kind)) {
        const id = `${compId}_${kind}`;
        compTrackIds.set(kind, id);
        addTrack(doc, {
          id,
          compositionId: compId,
          kind,
          name: `${kind.toUpperCase()} ${compositionIndex + 1}`,
          index: clip.mediaKind === "audio" ? 1 : 0,
          locked: false,
          muted: false,
          meta: { compositionTrack: true },
        });
      }
      const start = roundTime(clip.relativeStart ?? clip.start ?? 0);
      const end = roundTime(clip.relativeEnd ?? (start + Number(clip.duration || 1)));
      addClip(doc, {
        id: stableId("clip_comp_child", `${compId}-${clip.id || clipIndex}`, clipIndex),
        trackId: compTrackIds.get(kind),
        source: { type: "asset", id: clip.imagePath || clip.path || clip.image || `${compId}:clip:${clipIndex + 1}` },
        name: compactText(clip.title, `${composition.name || compId} Clip ${clipIndex + 1}`),
        start,
        duration: positiveDuration(start, end, 1),
        meta: { sourceType: clip.sourceType || kind, sceneId: clip.sceneId ?? null, sourceCompositionId: composition.id || compId },
      });
    });
  });

  return timeline.migrate(doc);
}

function normalizeTimelineDoc(payload) {
  return timeline.migrate(payload.timelineDoc ? clone(payload.timelineDoc, {}) : timelineDocFromPayload(payload));
}

function sortedTracks(doc) {
  return [...(doc.tracks || [])].sort((a, b) => {
    if (a.compositionId !== b.compositionId) return String(a.compositionId).localeCompare(String(b.compositionId));
    return (Number(a.index) || 0) - (Number(b.index) || 0) || String(a.id).localeCompare(String(b.id));
  });
}

function sortedClips(doc) {
  const trackMap = new Map((doc.tracks || []).map((track) => [track.id, track]));
  return [...(doc.clips || [])].sort((a, b) => {
    const at = trackMap.get(a.trackId);
    const bt = trackMap.get(b.trackId);
    if ((at?.compositionId || "") !== (bt?.compositionId || "")) return String(at?.compositionId || "").localeCompare(String(bt?.compositionId || ""));
    return (a.start - b.start) || String(a.trackId).localeCompare(String(b.trackId)) || String(a.id).localeCompare(String(b.id));
  });
}

function clipEnd(clip) {
  return roundTime(Number(clip.start) + Number(clip.duration));
}

function buildExportManifest(payload = {}, options = {}) {
  const validation = validateExportRequest(payload);
  if (!validation.ok) return { ok: false, errors: validation.errors };

  const doc = normalizeTimelineDoc(payload);
  const docErrors = timeline.validate(doc);
  if (docErrors.length) {
    return {
      ok: false,
      errors: docErrors.map((message) => error("invalid_timeline_document", "timelineDoc", message)),
    };
  }

  const mode = EXPORT_MODES.includes(options.mode || payload.exportMode) ? (options.mode || payload.exportMode) : "manifest";
  const scenes = normalizeScenes(payload.scenes);
  const trackMap = new Map((doc.tracks || []).map((track) => [track.id, track]));
  const clipRecords = sortedClips(doc).map((clip) => {
    const track = trackMap.get(clip.trackId) || {};
    const end = clipEnd(clip);
    return {
      id: clip.id,
      trackId: clip.trackId,
      compositionId: track.compositionId || null,
      kind: track.kind || "unknown",
      name: clip.name || clip.id,
      start: roundTime(clip.start),
      end,
      duration: roundTime(clip.duration),
      in: clip.in ?? null,
      out: clip.out ?? null,
      sourceType: clip.source?.type || "asset",
      sourceId: clip.source?.id ?? null,
      renderable: ["video", "audio", "caption", "vfx"].includes(track.kind),
      meta: clone(clip.meta, {}),
    };
  });
  const tracks = sortedTracks(doc).map((track) => ({
    id: track.id,
    compositionId: track.compositionId,
    kind: track.kind,
    name: track.name,
    index: Number(track.index) || 0,
    locked: Boolean(track.locked),
    muted: Boolean(track.muted),
    dynamic: Boolean(track.meta?.dynamic),
    clipCount: clipRecords.filter((clip) => clip.trackId === track.id).length,
    meta: clone(track.meta, {}),
  }));
  const dynamicTracks = tracks.filter((track) => track.dynamic);
  const compositions = (doc.compositions || []).map((composition) => ({
    id: composition.id,
    name: composition.name,
    parentId: composition.parentId ?? null,
    root: Boolean(composition.root),
    width: Number(composition.width) || 1920,
    height: Number(composition.height) || 1080,
    start: roundTime(composition.start),
    duration: roundTime(composition.duration || doc.duration),
    trackCount: tracks.filter((track) => track.compositionId === composition.id).length,
    clipCount: clipRecords.filter((clip) => clip.compositionId === composition.id).length,
  }));
  const captions = clipRecords
    .filter((clip) => clip.kind === "caption")
    .map((clip) => ({
      clipId: clip.id,
      sceneId: clip.meta?.sceneId ?? null,
      start: clip.start,
      end: clip.end,
      text: clip.meta?.text || clip.name,
      titleHi: clip.meta?.titleHi || "",
      titleEn: clip.meta?.titleEn || "",
    }));
  const vfx = clipRecords
    .filter((clip) => clip.kind === "vfx")
    .map((clip) => ({
      clipId: clip.id,
      sceneId: clip.meta?.sceneId ?? null,
      start: clip.start,
      end: clip.end,
      effects: Array.isArray(clip.meta?.effects) ? clip.meta.effects : [],
      rubabOverlay: Boolean(clip.meta?.rubabOverlay),
    }));
  const audio = {
    tracks: tracks.filter((track) => track.kind === "audio").map((track) => track.id),
    clips: clipRecords.filter((clip) => clip.kind === "audio"),
    mix: clone(payload.audioMix, {}),
  };
  const assetReferences = [...new Map(clipRecords
    .filter((clip) => clip.sourceType === "asset" && clip.sourceId)
    .map((clip) => [String(clip.sourceId), { id: String(clip.sourceId), firstClipId: clip.id, kind: clip.kind }])).values()];
  const unsupportedPreviewVfx = [...new Set(vfx.flatMap((node) => node.effects).filter((effectName) => !["vignette"].includes(effectName)))];
  const renderStatus = mode === "manifest"
    ? "ready"
    : unsupportedPreviewVfx.length
      ? "degraded"
      : "ready";
  const duration = roundTime(Number(payload.duration) || doc.duration || Math.max(0, ...clipRecords.map((clip) => clip.end)));
  const manifest = {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    generatedAt: options.generatedAt || new Date().toISOString(),
    mode,
    source: {
      projectId: payload.projectId || doc.id,
      title: payload.title || doc.name,
      sourceSchemaVersion: payload.schemaVersion || null,
      timelineDocumentVersion: doc.schemaVersion,
      sourceTimeline: clone(payload.sourceTimeline, null),
    },
    timelineDocument: {
      id: doc.id,
      name: doc.name,
      fps: doc.fps,
      duration,
      valid: docErrors.length === 0,
      hash: sourceHash(doc),
    },
    resolution: {
      width: Number(payload.width) || compositions.find((composition) => composition.root)?.width || 1920,
      height: Number(payload.height) || compositions.find((composition) => composition.root)?.height || 1080,
    },
    tracks,
    clips: clipRecords,
    dynamicTracks,
    compositions,
    captions,
    vfx,
    audio,
    markers: clipRecords.filter((clip) => clip.kind === "marker"),
    scenes: scenes.map((scene) => ({
      id: scene.id,
      start: scene.start,
      end: scene.end,
      titleHi: scene.titleHi,
      titleEn: scene.titleEn,
      imagePath: scene.imagePath,
      rubabOverlay: scene.rubabOverlay,
    })),
    assets: assetReferences,
    renderPlan: {
      status: renderStatus,
      duration,
      fps: doc.fps,
      videoWindows: clipRecords.filter((clip) => clip.kind === "video"),
      audioWindows: clipRecords.filter((clip) => clip.kind === "audio"),
      captionWindows: captions,
      vfxWindows: vfx,
      unsupportedPreviewVfx,
      mp4PreviewRenderer: mode === "preview-mp4" ? "ffmpeg concat + caption/vignette/rubab overlay" : null,
    },
  };
  manifest.parity = exportParityReport(manifest);
  return { ok: true, manifest, doc };
}

function exportParityReport(manifest) {
  const dynamicClipCount = manifest.dynamicTracks.reduce((total, track) => total + track.clipCount, 0);
  const compositionClipCount = manifest.compositions.reduce((total, composition) => total + composition.clipCount, 0);
  return {
    fullSchemaRead: true,
    timelineDocument: {
      read: true,
      valid: manifest.timelineDocument.valid,
      schemaVersion: manifest.source.timelineDocumentVersion,
      hash: manifest.timelineDocument.hash,
    },
    dynamicTracks: {
      read: true,
      count: manifest.dynamicTracks.length,
      clipCount: dynamicClipCount,
    },
    compositions: {
      read: true,
      count: manifest.compositions.length,
      clipCount: compositionClipCount,
      rootCount: manifest.compositions.filter((composition) => composition.root).length,
    },
    captions: {
      read: true,
      count: manifest.captions.length,
      manifestCovered: manifest.captions.length > 0,
    },
    vfx: {
      read: true,
      nodeCount: manifest.vfx.length,
      manifestCovered: true,
      unsupportedPreviewVfx: manifest.renderPlan.unsupportedPreviewVfx,
    },
    audio: {
      read: true,
      trackCount: manifest.audio.tracks.length,
      clipCount: manifest.audio.clips.length,
      mixKeys: Object.keys(manifest.audio.mix || {}).sort(),
    },
    render: {
      read: true,
      mode: manifest.mode,
      status: manifest.renderPlan.status,
      previewMp4Parity: manifest.mode === "preview-mp4" && manifest.renderPlan.status === "ready",
      schemaParity: true,
    },
  };
}

module.exports = {
  EXPORT_SCHEMA_VERSION,
  EXPORT_SCHEMA_EVIDENCE_VERSION,
  EXPORT_MODES,
  EXPORT_RENDER_STATUSES,
  validateExportRequest,
  timelineDocFromPayload,
  buildExportManifest,
  exportParityReport,
};
