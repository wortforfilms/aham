const state = {
  project: null,
  scenes: [],
  selectedId: null,
  assetTab: "all",
  assetQuery: "",
  uxNotes: [],
  uxNoteFilter: "all",
  storyline: null,
  currentTime: 0,
  timelineZoom: 5,
  timelineVerticalZoom: 1,
  timelineMode: "all",
  timelineLayout: "stacked",
  timelineOptions: {
    thumbnails: true,
    labels: true,
    markers: true,
    notes: true,
    followPlayhead: false,
  },
  pinchAxis: "both",
  pinchGesture: {
    lastScale: 1,
    pointers: new Map(),
    lastDistance: 0,
  },
  playing: false,
  playTimer: null,
  exporting: false,
  workspaceMode: "edit",
  activePanel: "inspector",
  tool: "select",
  snap: true,
  safeGuides: true,
  markers: [],
  keyframes: [],
  markerPointerDrag: null,
  layerOrder: ["vfx", "captions", "rubab", "video", "audio"],
  draggingLayerKey: null,
  layerPointerDrag: null,
  timelineResize: null,
  layerVisibility: {
    vfx: true,
    captions: true,
    rubab: true,
    video: true,
    audio: true,
  },
  layerLocked: {
    vfx: false,
    captions: false,
    rubab: false,
    video: false,
    audio: false,
  },
  audio: {
    master: 90,
    voice: 92,
    music: 80,
    rubab: 86,
    rubabSolo: false,
  },
  access: {
    captions: true,
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    dyslexia: false,
    focusMode: false,
    colorMode: "none",
    density: "comfortable",
  },
  layout: {
    leftWidth: 250,
    rightWidth: 320,
    viewerHeight: 360,
  },
  handwriting: {
    tool: "pen",
    color: "#f1d17b",
    size: 2,
    layout: "inline",
    drawing: false,
    hasInk: false,
    draft: null,
    lastX: 0,
    lastY: 0,
  },
  hud: {
    message: "Ready",
    timer: null,
  },
};

const els = {
  workspace: document.querySelector(".workspace"),
  centerPanel: document.querySelector(".center-panel"),
  resetLayoutBtn: document.getElementById("resetLayoutBtn"),
  leftPanelResizer: document.getElementById("leftPanelResizer"),
  rightPanelResizer: document.getElementById("rightPanelResizer"),
  timelineSplitResizer: document.getElementById("timelineSplitResizer"),
  sceneList: document.getElementById("sceneList"),
  layerStack: document.getElementById("layerStack"),
  activeToolText: document.getElementById("activeToolText"),
  workspaceModeTabs: document.getElementById("workspaceModeTabs"),
  panelTabs: document.getElementById("panelTabs"),
  previewStage: document.getElementById("previewStage"),
  previewImage: document.getElementById("previewImage"),
  rubabOverlay: document.getElementById("rubabOverlay"),
  effectLayer: document.getElementById("effectLayer"),
  safeGuides: document.getElementById("safeGuides"),
  captionOverlay: document.getElementById("captionOverlay"),
  previewTime: document.getElementById("previewTime"),
  previewTitle: document.getElementById("previewTitle"),
  viewerZoom: document.getElementById("viewerZoom"),
  viewerColor: document.getElementById("viewerColor"),
  viewerFps: document.getElementById("viewerFps"),
  smartHud: document.getElementById("smartHud"),
  hudPrimary: document.getElementById("hudPrimary"),
  hudTimecode: document.getElementById("hudTimecode"),
  hudTool: document.getElementById("hudTool"),
  hudScene: document.getElementById("hudScene"),
  hudLayer: document.getElementById("hudLayer"),
  hudComposite: document.getElementById("hudComposite"),
  hudTimeline: document.getElementById("hudTimeline"),
  hudAudio: document.getElementById("hudAudio"),
  hudAccess: document.getElementById("hudAccess"),
  hudLayout: document.getElementById("hudLayout"),
  waveformScope: document.getElementById("waveformScope"),
  vectorScope: document.getElementById("vectorScope"),
  loudnessReadout: document.getElementById("loudnessReadout"),
  playPauseBtn: document.getElementById("playPauseBtn"),
  jumpBackBtn: document.getElementById("jumpBackBtn"),
  frameBackBtn: document.getElementById("frameBackBtn"),
  jogSlider: document.getElementById("jogSlider"),
  frameForwardBtn: document.getElementById("frameForwardBtn"),
  jumpForwardBtn: document.getElementById("jumpForwardBtn"),
  playerClock: document.getElementById("playerClock"),
  timelineReadout: document.getElementById("timelineReadout"),
  splitSceneBtn: document.getElementById("splitSceneBtn"),
  setStartBtn: document.getElementById("setStartBtn"),
  setEndBtn: document.getElementById("setEndBtn"),
  addMarkerBtn: document.getElementById("addMarkerBtn"),
  addTransitionBtn: document.getElementById("addTransitionBtn"),
  nudgeLeftBtn: document.getElementById("nudgeLeftBtn"),
  nudgeRightBtn: document.getElementById("nudgeRightBtn"),
  rippleBtn: document.getElementById("rippleBtn"),
  fitSelectionBtn: document.getElementById("fitSelectionBtn"),
  fitTimelineBtn: document.getElementById("fitTimelineBtn"),
  zoomInput: document.getElementById("zoomInput"),
  hZoomOutBtn: document.getElementById("hZoomOutBtn"),
  hZoomInBtn: document.getElementById("hZoomInBtn"),
  verticalZoomInput: document.getElementById("verticalZoomInput"),
  vZoomOutBtn: document.getElementById("vZoomOutBtn"),
  vZoomInBtn: document.getElementById("vZoomInBtn"),
  timelineModeTabs: document.getElementById("timelineModeTabs"),
  timelineViewOptions: document.getElementById("timelineViewOptions"),
  timelineLayoutInput: document.getElementById("timelineLayoutInput"),
  pinchAxisInput: document.getElementById("pinchAxisInput"),
  timelineViewport: document.getElementById("timelineViewport"),
  timelineMiniMap: document.getElementById("timelineMiniMap"),
  timelineMiniMapTrack: document.getElementById("timelineMiniMapTrack"),
  timelineMiniMapWindow: document.getElementById("timelineMiniMapWindow"),
  timelineHud: document.getElementById("timelineHud"),
  timelineHudZoom: document.getElementById("timelineHudZoom"),
  timelineHudMode: document.getElementById("timelineHudMode"),
  timelineHudGesture: document.getElementById("timelineHudGesture"),
  timelineCanvas: document.getElementById("timelineCanvas"),
  timelineRuler: document.getElementById("timelineRuler"),
  markerLayer: document.getElementById("markerLayer"),
  videoLayer: document.getElementById("videoLayer"),
  overlayLayer: document.getElementById("overlayLayer"),
  vfxLayer: document.getElementById("vfxLayer"),
  captionLayer: document.getElementById("captionLayer"),
  audioLayer: document.getElementById("audioLayer"),
  playhead: document.getElementById("playhead"),
  audioPlayer: document.getElementById("audioPlayer"),
  titleEnInput: document.getElementById("titleEnInput"),
  titleHiInput: document.getElementById("titleHiInput"),
  startInput: document.getElementById("startInput"),
  endInput: document.getElementById("endInput"),
  rubabInput: document.getElementById("rubabInput"),
  noteInput: document.getElementById("noteInput"),
  assetRef: document.getElementById("assetRef"),
  transformXInput: document.getElementById("transformXInput"),
  transformYInput: document.getElementById("transformYInput"),
  scaleInput: document.getElementById("scaleInput"),
  rotationInput: document.getElementById("rotationInput"),
  opacityInput: document.getElementById("opacityInput"),
  blendModeInput: document.getElementById("blendModeInput"),
  grainInput: document.getElementById("grainInput"),
  vignetteInput: document.getElementById("vignetteInput"),
  dustInput: document.getElementById("dustInput"),
  sonicInput: document.getElementById("sonicInput"),
  addKeyframeBtn: document.getElementById("addKeyframeBtn"),
  keyframeList: document.getElementById("keyframeList"),
  masterVolumeInput: document.getElementById("masterVolumeInput"),
  voiceVolumeInput: document.getElementById("voiceVolumeInput"),
  musicVolumeInput: document.getElementById("musicVolumeInput"),
  rubabVolumeInput: document.getElementById("rubabVolumeInput"),
  masterMeter: document.getElementById("masterMeter"),
  voiceMeter: document.getElementById("voiceMeter"),
  musicMeter: document.getElementById("musicMeter"),
  rubabMeter: document.getElementById("rubabMeter"),
  soloRubabBtn: document.getElementById("soloRubabBtn"),
  captionsInput: document.getElementById("captionsInput"),
  highContrastInput: document.getElementById("highContrastInput"),
  largeTextInput: document.getElementById("largeTextInput"),
  reduceMotionInput: document.getElementById("reduceMotionInput"),
  dyslexiaInput: document.getElementById("dyslexiaInput"),
  focusModeInput: document.getElementById("focusModeInput"),
  colorModeInput: document.getElementById("colorModeInput"),
  densityInput: document.getElementById("densityInput"),
  resetAccessBtn: document.getElementById("resetAccessBtn"),
  assetTabs: document.getElementById("assetTabs"),
  assetSearch: document.getElementById("assetSearch"),
  assetGrid: document.getElementById("assetGrid"),
  uxNoteCategoryInput: document.getElementById("uxNoteCategoryInput"),
  uxNotePriorityInput: document.getElementById("uxNotePriorityInput"),
  uxNoteTextInput: document.getElementById("uxNoteTextInput"),
  uxNoteFilterInput: document.getElementById("uxNoteFilterInput"),
  addUxNoteBtn: document.getElementById("addUxNoteBtn"),
  exportUxNotesBtn: document.getElementById("exportUxNotesBtn"),
  clearDoneUxNotesBtn: document.getElementById("clearDoneUxNotesBtn"),
  handwritingTool: document.getElementById("handwritingTool"),
  handwritingLayoutTabs: document.getElementById("handwritingLayoutTabs"),
  handwritingToolTabs: document.getElementById("handwritingToolTabs"),
  handwritingColorTabs: document.getElementById("handwritingColorTabs"),
  handwritingSizeInput: document.getElementById("handwritingSizeInput"),
  handwritingCanvas: document.getElementById("handwritingCanvas"),
  handwritingStatus: document.getElementById("handwritingStatus"),
  clearHandwritingBtn: document.getElementById("clearHandwritingBtn"),
  attachSketchBtn: document.getElementById("attachSketchBtn"),
  uxNotesCount: document.getElementById("uxNotesCount"),
  uxNotesContext: document.getElementById("uxNotesContext"),
  uxNotesList: document.getElementById("uxNotesList"),
  storyCurrentTime: document.getElementById("storyCurrentTime"),
  storyCurrentTitle: document.getElementById("storyCurrentTitle"),
  storyCurrentAction: document.getElementById("storyCurrentAction"),
  storyFrameRefs: document.getElementById("storyFrameRefs"),
  storyLogline: document.getElementById("storyLogline"),
  storyBeatList: document.getElementById("storyBeatList"),
  fitStorylineBtn: document.getElementById("fitStorylineBtn"),
  baselineTitle: document.getElementById("baselineTitle"),
  baselineTime: document.getElementById("baselineTime"),
  baselineAsset: document.getElementById("baselineAsset"),
  baselineInspectBtn: document.getElementById("baselineInspectBtn"),
  baselineResetBtn: document.getElementById("baselineResetBtn"),
  baselineCommandsBtn: document.getElementById("baselineCommandsBtn"),
  baselineTsvBtn: document.getElementById("baselineTsvBtn"),
  baselineBoardBtn: document.getElementById("baselineBoardBtn"),
  matrixInspectBtn: document.getElementById("matrixInspectBtn"),
  statusText: document.getElementById("statusText"),
  lastExportLink: document.getElementById("lastExportLink"),
  exportVideoBtn: document.getElementById("exportVideoBtn"),
  loadGeneratedTimelineBtn: document.getElementById("loadGeneratedTimelineBtn"),
  loadDenseTimelineBtn: document.getElementById("loadDenseTimelineBtn"),
  openStorylineBtn: document.getElementById("openStorylineBtn"),
  downloadJsonBtn: document.getElementById("downloadJsonBtn"),
  downloadTsvBtn: document.getElementById("downloadTsvBtn"),
  downloadBoardBtn: document.getElementById("downloadBoardBtn"),
  duplicateSceneBtn: document.getElementById("duplicateSceneBtn"),
  deleteSceneBtn: document.getElementById("deleteSceneBtn"),
  commandPaletteBtn: document.getElementById("commandPaletteBtn"),
  commandPalette: document.getElementById("commandPalette"),
  commandInput: document.getElementById("commandInput"),
  commandList: document.getElementById("commandList"),
  snapToggleBtn: document.getElementById("snapToggleBtn"),
  safeGuidesBtn: document.getElementById("safeGuidesBtn"),
};

const FPS = 24;
const MIN_SCENE_SECONDS = 0.25;
const H_ZOOM_MIN = 2;
const H_ZOOM_MAX = 18;
const V_ZOOM_MIN = 0.55;
const V_ZOOM_MAX = 2.2;
const LAYOUT_DEFAULTS = {
  leftWidth: 250,
  rightWidth: 320,
  viewerHeight: 360,
};
const LAYOUT_LIMITS = {
  leftMin: 180,
  leftMax: 420,
  rightMin: 240,
  rightMax: 540,
  centerMin: 360,
  viewerMin: 240,
  timelineMin: 220,
};
const UX_NOTES_STORAGE_KEY = "mahavisphot.uxNotes";

const defaultComposite = {
  x: 0,
  y: 0,
  scale: 100,
  rotation: 0,
  opacity: 100,
  blendMode: "normal",
};

const defaultEffects = {
  grain: true,
  vignette: true,
  dust: false,
  sonic: false,
};

const defaultTransition = {
  type: "cut",
  duration: 0,
};

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

function roundTime(value) {
  return Math.round((Number(value) || 0) * 1000) / 1000;
}

function fmt(seconds) {
  const value = Number(seconds) || 0;
  const mins = Math.floor(value / 60);
  const secs = value - mins * 60;
  return `${mins}:${secs.toFixed(2).padStart(5, "0")}`;
}

function parseStoryTime(value) {
  if (Number.isFinite(Number(value))) return Number(value);
  const parts = String(value || "0").split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(parts[0]) || 0;
}

function sceneLength(scene) {
  return Math.max(MIN_SCENE_SECONDS, Number(scene.end) - Number(scene.start));
}

function projectDuration() {
  const sceneEnd = Math.max(0, ...state.scenes.map((scene) => Number(scene.end) || 0));
  return Math.max(sceneEnd, Number(state.project?.duration) || 0);
}

function pixelsPerSecond() {
  return Number(state.timelineZoom) * 12;
}

function timelineLayoutScale() {
  const scales = {
    compact: 0.72,
    stacked: 1,
    expanded: 1.42,
    filmstrip: 1.18,
  };
  return scales[state.timelineLayout] || 1;
}

function timelineRowHeight() {
  return Math.round(58 * state.timelineVerticalZoom * timelineLayoutScale());
}

function timelineMarkerHeight() {
  return Math.round(38 * state.timelineVerticalZoom * timelineLayoutScale());
}

function timelineClipHeight() {
  return Math.max(22, Math.round(timelineRowHeight() * 0.76));
}

function timelineSmallClipHeight() {
  return Math.max(18, Math.round(timelineRowHeight() * 0.52));
}

function visibleTimelineWidth() {
  return Math.max(1, (els.timelineViewport?.clientWidth || 0) - 86);
}

function fitTimelineView() {
  const duration = projectDuration();
  const targetZoom = clamp(visibleTimelineWidth() / Math.max(1, duration) / 12, H_ZOOM_MIN, H_ZOOM_MAX);
  state.timelineZoom = targetZoom;
  els.zoomInput.value = state.timelineZoom;
  renderTimeline();
  els.timelineViewport.scrollLeft = 0;
  renderTimelineMinimap();
  showHud("Timeline fit to view");
}

function followTimelinePlayhead() {
  if (!state.timelineOptions.followPlayhead || !els.timelineViewport) return;
  const playheadX = 86 + state.currentTime * pixelsPerSecond();
  const visibleLeft = els.timelineViewport.scrollLeft;
  const visibleRight = visibleLeft + els.timelineViewport.clientWidth;
  if (playheadX < visibleLeft + 130 || playheadX > visibleRight - 130) {
    els.timelineViewport.scrollLeft = Math.max(0, playheadX - els.timelineViewport.clientWidth / 2);
    renderTimelineMinimap();
  }
}

function setTimelineHorizontalZoom(value, anchorClientX = null) {
  const viewport = els.timelineViewport;
  const beforePps = pixelsPerSecond();
  const rect = viewport.getBoundingClientRect();
  const anchorX = anchorClientX == null ? rect.left + rect.width / 2 : anchorClientX;
  const anchorOffset = Math.max(0, viewport.scrollLeft + anchorX - rect.left - 86);
  const anchorTime = anchorOffset / beforePps;
  state.timelineZoom = clamp(value, H_ZOOM_MIN, H_ZOOM_MAX);
  els.zoomInput.value = state.timelineZoom;
  renderTimeline();
  requestAnimationFrame(() => {
    viewport.scrollLeft = Math.max(0, anchorTime * pixelsPerSecond() - (anchorX - rect.left - 86));
    renderTimelineMinimap();
  });
  if (state.project) showHud(`Timeline H zoom ${state.timelineZoom.toFixed(1)}`);
}

function setTimelineVerticalZoom(value) {
  state.timelineVerticalZoom = clamp(value, V_ZOOM_MIN, V_ZOOM_MAX);
  els.verticalZoomInput.value = state.timelineVerticalZoom.toFixed(2);
  renderTimeline();
  if (state.project) showHud(`Timeline V zoom ${state.timelineVerticalZoom.toFixed(2)}`);
}

function applyTimelineZoomFactor(factor, axis = state.pinchAxis, anchorClientX = null) {
  const nextFactor = Number.isFinite(factor) && factor > 0 ? factor : 1;
  const horizontal = axis === "horizontal" || axis === "both";
  const vertical = axis === "vertical" || axis === "both";
  if (horizontal) setTimelineHorizontalZoom(state.timelineZoom * nextFactor, anchorClientX);
  if (vertical) setTimelineVerticalZoom(state.timelineVerticalZoom * nextFactor);
  setStatus(`Timeline zoom ${axis}: H ${state.timelineZoom.toFixed(1)} / V ${state.timelineVerticalZoom.toFixed(2)}`);
  showHud(`Timeline zoom ${axis}`);
}

function applyTimelineViewState() {
  els.timelineViewport.dataset.mode = state.timelineMode;
  els.timelineViewport.dataset.layout = state.timelineLayout;
  els.timelineViewport.dataset.thumbnails = state.timelineOptions.thumbnails ? "on" : "off";
  els.timelineViewport.dataset.labels = state.timelineOptions.labels ? "on" : "off";
  els.timelineViewport.style.setProperty("--timeline-row-h", `${timelineRowHeight()}px`);
  els.timelineViewport.style.setProperty("--timeline-marker-h", `${timelineMarkerHeight()}px`);
  els.timelineViewport.style.setProperty("--timeline-clip-h", `${timelineClipHeight()}px`);
  els.timelineViewport.style.setProperty("--timeline-small-clip-h", `${timelineSmallClipHeight()}px`);
  els.zoomInput.value = state.timelineZoom;
  els.verticalZoomInput.value = state.timelineVerticalZoom.toFixed(2);
  els.timelineLayoutInput.value = state.timelineLayout;
  els.pinchAxisInput.value = state.pinchAxis;
  for (const button of els.timelineModeTabs.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.timelineMode === state.timelineMode);
  }
  for (const button of els.timelineViewOptions.querySelectorAll("button")) {
    const key = button.dataset.timelineOption;
    button.classList.toggle("active", Boolean(state.timelineOptions[key]));
  }
}

function titleCase(value) {
  const text = String(value || "");
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : "";
}

function activeLayerSummary() {
  const scene = selectedScene();
  if (state.activePanel === "audio" || state.timelineMode === "audio") {
    return state.layerVisibility.audio ? "A1 Master Audio" : "A1 hidden";
  }
  if (state.activePanel === "vfx" || state.timelineMode === "vfx") {
    return state.layerVisibility.vfx ? "FX Bus" : "FX hidden";
  }
  if (state.activePanel === "accessibility" || state.timelineMode === "captions") {
    return state.layerVisibility.captions ? "CC Caption Track" : "CC hidden";
  }
  if (scene?.rubabOverlay) {
    return state.layerVisibility.rubab ? "V2 Rubab PiP" : "V2 hidden";
  }
  return state.layerVisibility.video ? "V1 Scene Plate" : "V1 hidden";
}

function orderedLayerKeys() {
  const known = ["vfx", "captions", "rubab", "video", "audio"];
  return [...state.layerOrder.filter((key) => known.includes(key)), ...known.filter((key) => !state.layerOrder.includes(key))];
}

function layerZIndex(key) {
  const order = orderedLayerKeys();
  const index = order.indexOf(key);
  return String((order.length - Math.max(0, index)) * 10);
}

function moveLayerBefore(layerKey, targetKey) {
  if (!layerKey || !targetKey || layerKey === targetKey) return;
  const order = orderedLayerKeys().filter((key) => key !== layerKey);
  const targetIndex = order.indexOf(targetKey);
  order.splice(targetIndex < 0 ? order.length : targetIndex, 0, layerKey);
  state.layerOrder = order;
  setDirty();
  renderLayerStack();
  renderPreview();
  showHud(`${titleCase(layerKey)} layer moved`);
}

function moveLayerToEnd(layerKey) {
  if (!layerKey) return;
  state.layerOrder = [...orderedLayerKeys().filter((key) => key !== layerKey), layerKey];
  setDirty();
  renderLayerStack();
  renderPreview();
  showHud(`${titleCase(layerKey)} layer moved`);
}

function beginLayerPointerDrag(event, layerKey) {
  event.preventDefault();
  event.stopPropagation();
  state.draggingLayerKey = layerKey;
  state.layerPointerDrag = { key: layerKey, lastTarget: null };
  document.body.classList.add("is-dragging-layer");
  showHud("Dragging layer", { sticky: true });

  function move(pointerEvent) {
    const drag = state.layerPointerDrag;
    if (!drag) return;
    const target = document.elementFromPoint(pointerEvent.clientX, pointerEvent.clientY)?.closest(".layer-stack-row");
    const targetKey = target?.dataset.layerKey;
    if (targetKey && targetKey !== drag.key && targetKey !== drag.lastTarget) {
      drag.lastTarget = targetKey;
      state.draggingLayerKey = drag.key;
      moveLayerBefore(drag.key, targetKey);
    }
  }

  function stop() {
    document.body.classList.remove("is-dragging-layer");
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", stop);
    document.removeEventListener("pointercancel", stop);
    state.draggingLayerKey = null;
    state.layerPointerDrag = null;
    renderLayerStack();
    showHud("Layer order updated");
  }

  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", stop);
  document.addEventListener("pointercancel", stop);
}

function accessSummary() {
  const active = [];
  if (state.access.captions) active.push("captions");
  if (state.access.highContrast) active.push("contrast");
  if (state.access.largeText) active.push("large text");
  if (state.access.reduceMotion) active.push("reduced motion");
  if (state.access.dyslexia) active.push("readable");
  if (state.access.focusMode) active.push("focus");
  if (state.access.colorMode !== "none") active.push(`${state.access.colorMode} safe`);
  return active.length ? active.slice(0, 3).join(", ") : "standard";
}

function renderHud(message = state.hud.message) {
  if (!els.smartHud) return;
  const scene = selectedScene();
  const composite = selectedComposite();
  const timelineLabel = `${titleCase(state.timelineMode)} / ${titleCase(state.timelineLayout)}`;
  const zoomLabel = `H ${state.timelineZoom.toFixed(1)} / V ${state.timelineVerticalZoom.toFixed(2)}`;
  const layoutLabel = `L ${Math.round(state.layout.leftWidth)} R ${Math.round(state.layout.rightWidth)} V ${Math.round(state.layout.viewerHeight)}`;
  const audioLabel = state.audio.rubabSolo
    ? `M${state.audio.master}% Rubab solo`
    : `M${state.audio.master}% R${state.audio.rubab}%`;

  els.hudPrimary.textContent = message || "Ready";
  els.hudTimecode.textContent = `${fmt(state.currentTime)} / ${fmt(projectDuration())}`;
  els.hudTool.textContent = `${titleCase(state.tool)} · snap ${state.snap ? "on" : "off"} · guides ${state.safeGuides ? "on" : "off"}`;
  els.hudScene.textContent = scene ? `${String(scene.id).padStart(2, "0")} ${scene.titleEn || "Untitled"}` : "No scene";
  els.hudLayer.textContent = activeLayerSummary();
  els.hudComposite.textContent = `${composite.opacity}% ${composite.blendMode} · scale ${composite.scale}%`;
  els.hudTimeline.textContent = `${timelineLabel} · ${zoomLabel}`;
  els.hudAudio.textContent = audioLabel;
  els.hudAccess.textContent = accessSummary();
  els.hudLayout.textContent = layoutLabel;

  els.timelineHudZoom.textContent = zoomLabel;
  els.timelineHudMode.textContent = timelineLabel;
  els.timelineHudGesture.textContent = `Pinch ${state.pinchAxis}`;
}

function hideHud() {
  document.body.classList.remove("hud-visible");
  state.hud.timer = null;
}

function showHud(message = state.hud.message, options = {}) {
  state.hud.message = message || state.hud.message;
  if (options.announce !== false) {
    els.statusText.textContent = state.hud.message;
  }
  renderHud(state.hud.message);
  document.body.classList.add("hud-visible");
  if (state.hud.timer) window.clearTimeout(state.hud.timer);
  if (options.sticky) {
    state.hud.timer = null;
    return;
  }
  state.hud.timer = window.setTimeout(hideHud, state.access.reduceMotion ? 3200 : 2400);
}

function maxLeftWidth() {
  const width = els.workspace?.clientWidth || window.innerWidth;
  return Math.max(LAYOUT_LIMITS.leftMin, Math.min(LAYOUT_LIMITS.leftMax, width - state.layout.rightWidth - LAYOUT_LIMITS.centerMin - 16));
}

function maxRightWidth() {
  const width = els.workspace?.clientWidth || window.innerWidth;
  return Math.max(LAYOUT_LIMITS.rightMin, Math.min(LAYOUT_LIMITS.rightMax, width - state.layout.leftWidth - LAYOUT_LIMITS.centerMin - 16));
}

function maxViewerHeight() {
  const height = els.centerPanel?.clientHeight || 720;
  return Math.max(LAYOUT_LIMITS.viewerMin, height - LAYOUT_LIMITS.timelineMin - 8);
}

function saveLayoutState() {
  try {
    localStorage.setItem("mahavisphot.layout", JSON.stringify(state.layout));
  } catch {
    // Local storage can be unavailable in strict browser modes.
  }
}

function loadLayoutState() {
  try {
    const saved = JSON.parse(localStorage.getItem("mahavisphot.layout") || "null");
    if (!saved || typeof saved !== "object") return;
    state.layout.leftWidth = clamp(saved.leftWidth, LAYOUT_LIMITS.leftMin, LAYOUT_LIMITS.leftMax);
    state.layout.rightWidth = clamp(saved.rightWidth, LAYOUT_LIMITS.rightMin, LAYOUT_LIMITS.rightMax);
    state.layout.viewerHeight = clamp(saved.viewerHeight, LAYOUT_LIMITS.viewerMin, 900);
  } catch {
    // Ignore malformed saved layouts.
  }
}

function applyLayoutState(options = {}) {
  state.layout.leftWidth = clamp(state.layout.leftWidth, LAYOUT_LIMITS.leftMin, maxLeftWidth());
  state.layout.rightWidth = clamp(state.layout.rightWidth, LAYOUT_LIMITS.rightMin, maxRightWidth());
  state.layout.viewerHeight = clamp(state.layout.viewerHeight, LAYOUT_LIMITS.viewerMin, maxViewerHeight());

  document.documentElement.style.setProperty("--left-panel-w", `${Math.round(state.layout.leftWidth)}px`);
  document.documentElement.style.setProperty("--right-panel-w", `${Math.round(state.layout.rightWidth)}px`);
  document.documentElement.style.setProperty("--viewer-panel-h", `${Math.round(state.layout.viewerHeight)}px`);

  updateResizerA11y();
  renderHud();
  if (options.persist) saveLayoutState();
  if (options.rerenderTimeline && state.project) renderTimeline();
}

function updateResizerA11y() {
  const specs = [
    [els.leftPanelResizer, state.layout.leftWidth, LAYOUT_LIMITS.leftMin, maxLeftWidth()],
    [els.rightPanelResizer, state.layout.rightWidth, LAYOUT_LIMITS.rightMin, maxRightWidth()],
    [els.timelineSplitResizer, state.layout.viewerHeight, LAYOUT_LIMITS.viewerMin, maxViewerHeight()],
  ];
  for (const [handle, value, min, max] of specs) {
    handle.setAttribute("aria-valuemin", String(Math.round(min)));
    handle.setAttribute("aria-valuemax", String(Math.round(max)));
    handle.setAttribute("aria-valuenow", String(Math.round(value)));
  }
}

function resetLayout() {
  state.layout = { ...LAYOUT_DEFAULTS };
  setStatus("Layout reset");
  applyLayoutState({ persist: true, rerenderTimeline: true });
  showHud("Layout reset");
}

function resizeLayout(kind, delta, options = {}) {
  if (kind === "left") {
    state.layout.leftWidth = clamp(state.layout.leftWidth + delta, LAYOUT_LIMITS.leftMin, maxLeftWidth());
  }
  if (kind === "right") {
    state.layout.rightWidth = clamp(state.layout.rightWidth + delta, LAYOUT_LIMITS.rightMin, maxRightWidth());
  }
  if (kind === "split") {
    state.layout.viewerHeight = clamp(state.layout.viewerHeight + delta, LAYOUT_LIMITS.viewerMin, maxViewerHeight());
  }
  applyLayoutState({ persist: options.persist !== false, rerenderTimeline: true });
  showHud("Layout resized");
}

function beginLayoutResize(kind, event) {
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const start = { ...state.layout };
  document.body.classList.add("is-resizing-layout");
  showHud("Resizing layout", { sticky: true });

  function move(pointerEvent) {
    if (kind === "left") {
      state.layout.leftWidth = clamp(start.leftWidth + pointerEvent.clientX - startX, LAYOUT_LIMITS.leftMin, maxLeftWidth());
    }
    if (kind === "right") {
      state.layout.rightWidth = clamp(start.rightWidth - (pointerEvent.clientX - startX), LAYOUT_LIMITS.rightMin, maxRightWidth());
    }
    if (kind === "split") {
      state.layout.viewerHeight = clamp(start.viewerHeight + pointerEvent.clientY - startY, LAYOUT_LIMITS.viewerMin, maxViewerHeight());
    }
    applyLayoutState({ rerenderTimeline: true });
    renderHud("Resizing layout");
  }

  function stop() {
    document.body.classList.remove("is-resizing-layout");
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", stop);
    saveLayoutState();
    setStatus("Layout resized");
    showHud("Layout resized");
  }

  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", stop);
}

function handleLayoutResizerKey(kind, event) {
  const step = event.shiftKey ? 40 : 16;
  let handled = true;
  if (kind === "left") {
    if (event.key === "ArrowLeft") resizeLayout("left", -step);
    else if (event.key === "ArrowRight") resizeLayout("left", step);
    else handled = false;
  }
  if (kind === "right") {
    if (event.key === "ArrowLeft") resizeLayout("right", step);
    else if (event.key === "ArrowRight") resizeLayout("right", -step);
    else handled = false;
  }
  if (kind === "split") {
    if (event.key === "ArrowUp") resizeLayout("split", -step);
    else if (event.key === "ArrowDown") resizeLayout("split", step);
    else handled = false;
  }
  if (event.key === "Home") {
    if (kind === "left") state.layout.leftWidth = LAYOUT_LIMITS.leftMin;
    if (kind === "right") state.layout.rightWidth = LAYOUT_LIMITS.rightMin;
    if (kind === "split") state.layout.viewerHeight = LAYOUT_LIMITS.viewerMin;
    applyLayoutState({ persist: true, rerenderTimeline: true });
    handled = true;
  }
  if (event.key === "End") {
    if (kind === "left") state.layout.leftWidth = maxLeftWidth();
    if (kind === "right") state.layout.rightWidth = maxRightWidth();
    if (kind === "split") state.layout.viewerHeight = maxViewerHeight();
    applyLayoutState({ persist: true, rerenderTimeline: true });
    handled = true;
  }
  if (handled) {
    event.preventDefault();
    setStatus("Layout resized");
    showHud("Layout resized");
  }
}

function selectedScene() {
  return state.scenes.find((scene) => scene.id === state.selectedId) || state.scenes[0];
}

function sortedScenes() {
  return [...state.scenes].sort((a, b) => Number(a.start) - Number(b.start));
}

function sceneAt(time) {
  const value = Number(time) || 0;
  return sortedScenes().find((scene) => value >= Number(scene.start) && value < Number(scene.end)) || sortedScenes().at(-1);
}

function sceneAfter(scene) {
  const scenes = sortedScenes();
  const index = scenes.findIndex((item) => item.id === scene?.id);
  return index >= 0 ? scenes[index + 1] : null;
}

function nextSceneId() {
  return Math.max(0, ...state.scenes.map((scene) => Number(scene.id) || 0)) + 1;
}

function ensureSceneDefaults(scene) {
  if (!scene) return scene;
  scene.composite = { ...defaultComposite, ...(scene.composite || {}) };
  scene.effects = { ...defaultEffects, ...(scene.effects || {}) };
  scene.transition = { ...defaultTransition, ...(scene.transition || {}) };
  scene.captions = scene.captions || `${scene.titleHi || ""}${scene.titleHi ? "\n" : ""}${scene.titleEn || ""}`;
  return scene;
}

function selectedComposite() {
  return ensureSceneDefaults(selectedScene())?.composite || defaultComposite;
}

function selectedEffects() {
  return ensureSceneDefaults(selectedScene())?.effects || defaultEffects;
}

function scenePayload() {
  return sortedScenes().map((scene, index) => ({
    id: index + 1,
    start: Number(scene.start),
    end: Number(scene.end),
    duration: Number(scene.end) - Number(scene.start),
    titleHi: scene.titleHi,
    titleEn: scene.titleEn,
    frameIndex: scene.frameIndex,
    imagePath: scene.imagePath,
    rubabOverlay: Boolean(scene.rubabOverlay),
    note: scene.note || "",
    composite: ensureSceneDefaults(scene).composite,
    effects: ensureSceneDefaults(scene).effects,
    transition: ensureSceneDefaults(scene).transition,
    captions: scene.captions || "",
  }));
}

function setStatus(text) {
  els.statusText.textContent = text;
  state.hud.message = text;
  renderHud(text);
}

function setDirty() {
  setStatus("Edited");
}

function saveUxNotes() {
  try {
    localStorage.setItem(UX_NOTES_STORAGE_KEY, JSON.stringify(state.uxNotes));
  } catch {
    // Local storage can be unavailable in strict browser modes.
  }
}

function loadUxNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(UX_NOTES_STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return;
    state.uxNotes = saved
      .filter((note) => note && typeof note === "object" && typeof note.text === "string")
      .map((note) => ({
        id: note.id || `ux-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        sceneId: Number(note.sceneId) || null,
        sceneTitle: note.sceneTitle || "",
        time: roundTime(note.time),
        category: note.category || "layout",
        priority: note.priority || "P2",
        status: note.status || "open",
        text: note.text,
        sketch: note.sketch || null,
        createdAt: note.createdAt || new Date().toISOString(),
      }));
  } catch {
    state.uxNotes = [];
  }
}

function uxNoteContext(scene = selectedScene()) {
  return scene
    ? `Scene ${String(scene.id).padStart(2, "0")} · ${fmt(state.currentTime)}`
    : fmt(state.currentTime);
}

function addUxNote(options = {}) {
  const sketch = options.sketch || state.handwriting.draft || null;
  const text = (options.text ?? els.uxNoteTextInput.value).trim();
  if (!text && !sketch) {
    setStatus("Write or sketch a UX note first");
    showHud("Write or sketch a UX note first");
    if (state.handwriting.hasInk) els.attachSketchBtn.focus();
    else els.uxNoteTextInput.focus();
    return;
  }
  const scene = selectedScene();
  state.uxNotes.unshift({
    id: `ux-${Date.now()}`,
    sceneId: scene?.id || null,
    sceneTitle: scene?.titleEn || "",
    time: roundTime(state.currentTime),
    category: els.uxNoteCategoryInput.value,
    priority: els.uxNotePriorityInput.value,
    status: "open",
    text: text || "Handwritten UX design note",
    sketch,
    createdAt: new Date().toISOString(),
  });
  els.uxNoteTextInput.value = "";
  state.handwriting.draft = null;
  if (sketch) clearHandwriting(false);
  state.activePanel = "notes";
  saveUxNotes();
  setDirty();
  render();
  showHud("UX note added");
}

function updateUxNote(id, patch) {
  const note = state.uxNotes.find((item) => item.id === id);
  if (!note) return;
  Object.assign(note, patch);
  saveUxNotes();
  setDirty();
  renderUxNotes();
  renderTimeline();
  showHud("UX note updated");
}

function deleteUxNote(id) {
  state.uxNotes = state.uxNotes.filter((note) => note.id !== id);
  saveUxNotes();
  setDirty();
  renderUxNotes();
  renderTimeline();
  showHud("UX note deleted");
}

function focusUxNote(note) {
  if (!note) return;
  if (note.sceneId && state.scenes.some((scene) => scene.id === note.sceneId)) {
    state.selectedId = note.sceneId;
  }
  state.currentTime = roundTime(note.time);
  state.activePanel = "notes";
  render();
  showHud("UX note located");
}

function clearDoneUxNotes() {
  const before = state.uxNotes.length;
  state.uxNotes = state.uxNotes.filter((note) => note.status !== "done");
  if (state.uxNotes.length === before) {
    setStatus("No done UX notes");
    showHud("No done UX notes");
    return;
  }
  saveUxNotes();
  setDirty();
  render();
  showHud("Done UX notes cleared");
}

function uxNotesPayload() {
  return state.uxNotes.map((note) => ({
    id: note.id,
    status: note.status,
    priority: note.priority,
    category: note.category,
    time: Number(note.time),
    timecode: fmt(note.time),
    sceneId: note.sceneId,
    sceneTitle: note.sceneTitle,
    text: note.text,
    sketch: note.sketch,
    createdAt: note.createdAt,
  }));
}

function toUxNotesMarkdown() {
  const rows = uxNotesPayload();
  const lines = [
    "# Mahavisphot UX Enhancement Notes",
    "",
    `Exported: ${new Date().toISOString()}`,
    `Notes: ${rows.length}`,
    "",
  ];
  for (const note of rows) {
    lines.push(`## ${note.priority} / ${note.category} / ${note.status}`);
    lines.push(`Timecode: ${note.timecode}`);
    lines.push(`Scene: ${String(note.sceneId || "-").padStart(2, "0")} ${note.sceneTitle || ""}`.trim());
    lines.push("");
    lines.push(note.text);
    if (note.sketch) lines.push("\nHandwriting sketch: attached in project JSON.");
    lines.push("");
  }
  return lines.join("\n");
}

function openUxNotesTool() {
  state.tool = "note";
  state.activePanel = "notes";
  render();
  els.uxNoteTextInput.focus();
  showHud("UX notes tool");
}

function handwritingContext() {
  return els.handwritingCanvas.getContext("2d");
}

function handwritingPoint(event) {
  const rect = els.handwritingCanvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (els.handwritingCanvas.width / rect.width),
    y: (event.clientY - rect.top) * (els.handwritingCanvas.height / rect.height),
  };
}

function drawHandwritingGrid() {
  const ctx = handwritingContext();
  ctx.save();
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = "rgba(10, 12, 14, 0.94)";
  ctx.fillRect(0, 0, els.handwritingCanvas.width, els.handwritingCanvas.height);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.045)";
  ctx.lineWidth = 1;
  for (let x = 0; x < els.handwritingCanvas.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, els.handwritingCanvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < els.handwritingCanvas.height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(els.handwritingCanvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function clearHandwriting(announce = true) {
  const ctx = handwritingContext();
  ctx.clearRect(0, 0, els.handwritingCanvas.width, els.handwritingCanvas.height);
  drawHandwritingGrid();
  state.handwriting.hasInk = false;
  state.handwriting.draft = null;
  renderHandwritingControls();
  if (announce) showHud("Handwriting cleared");
}

function renderHandwritingControls() {
  if (!els.handwritingTool) return;
  els.handwritingTool.dataset.layout = state.handwriting.layout;
  els.handwritingSizeInput.value = state.handwriting.size;
  els.handwritingStatus.textContent = `${state.handwriting.layout} / ${state.handwriting.tool} / ${state.handwriting.size}px`;

  for (const button of els.handwritingLayoutTabs.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.handwritingLayout === state.handwriting.layout);
  }
  for (const button of els.handwritingToolTabs.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.handwritingTool === state.handwriting.tool);
  }
  for (const button of els.handwritingColorTabs.querySelectorAll("button")) {
    button.style.setProperty("--swatch", button.dataset.inkColor);
    button.classList.toggle("active", button.dataset.inkColor === state.handwriting.color);
  }
}

function setHandwritingLayout(layout) {
  state.handwriting.layout = layout;
  renderHandwritingControls();
  showHud(`${titleCase(layout)} handwriting layout`);
}

function setHandwritingTool(tool) {
  state.handwriting.tool = tool;
  renderHandwritingControls();
  showHud(`${titleCase(tool)} handwriting`);
}

function setHandwritingColor(color) {
  state.handwriting.color = color;
  renderHandwritingControls();
  showHud("Ink color selected");
}

function beginHandwriting(event) {
  event.preventDefault();
  const point = handwritingPoint(event);
  state.handwriting.drawing = true;
  state.handwriting.lastX = point.x;
  state.handwriting.lastY = point.y;
  els.handwritingCanvas.setPointerCapture(event.pointerId);
}

function moveHandwriting(event) {
  if (!state.handwriting.drawing) return;
  event.preventDefault();
  const point = handwritingPoint(event);
  const ctx = handwritingContext();
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = state.handwriting.tool === "eraser" ? state.handwriting.size * 5 : state.handwriting.size;
  if (state.handwriting.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = state.handwriting.tool === "marker"
      ? `${state.handwriting.color}88`
      : state.handwriting.color;
  }
  ctx.beginPath();
  ctx.moveTo(state.handwriting.lastX, state.handwriting.lastY);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  ctx.restore();
  state.handwriting.lastX = point.x;
  state.handwriting.lastY = point.y;
  state.handwriting.hasInk = true;
}

function endHandwriting(event) {
  if (!state.handwriting.drawing) return;
  if (event) {
    try {
      els.handwritingCanvas.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture can already be released by the browser.
    }
  }
  state.handwriting.drawing = false;
}

function attachHandwritingNote() {
  if (!state.handwriting.hasInk) {
    setStatus("Sketch something first");
    showHud("Sketch something first");
    return;
  }
  state.handwriting.draft = els.handwritingCanvas.toDataURL("image/png");
  addUxNote({ sketch: state.handwriting.draft });
}

function applyAccessibility() {
  document.body.classList.toggle("a11y-high-contrast", state.access.highContrast);
  document.body.classList.toggle("a11y-large-text", state.access.largeText);
  document.body.classList.toggle("a11y-reduce-motion", state.access.reduceMotion);
  document.body.classList.toggle("a11y-readable", state.access.dyslexia);
  document.body.classList.toggle("a11y-focus-mode", state.access.focusMode);
  document.body.dataset.colorMode = state.access.colorMode;
  document.body.dataset.density = state.access.density;
  els.captionsInput.checked = state.access.captions;
  els.highContrastInput.checked = state.access.highContrast;
  els.largeTextInput.checked = state.access.largeText;
  els.reduceMotionInput.checked = state.access.reduceMotion;
  els.dyslexiaInput.checked = state.access.dyslexia;
  els.focusModeInput.checked = state.access.focusMode;
  els.colorModeInput.value = state.access.colorMode;
  els.densityInput.value = state.access.density;
}

function updateTransportUi() {
  if (!state.project) return;
  const duration = projectDuration();
  const playheadLeft = 86 + state.currentTime * pixelsPerSecond();
  els.jogSlider.max = String(duration);
  els.jogSlider.value = String(clamp(state.currentTime, 0, duration));
  els.playerClock.textContent = `${fmt(state.currentTime)} / ${fmt(duration)}`;
  els.playPauseBtn.textContent = state.playing ? "II" : "▶";
  els.playhead.style.left = `${playheadLeft}px`;
  els.timelineReadout.textContent = `Playhead ${fmt(state.currentTime)} / ${fmt(duration)} · ${state.timelineMode} · ${state.timelineLayout} · H ${state.timelineZoom.toFixed(1)} / V ${state.timelineVerticalZoom.toFixed(2)} · pinch ${state.pinchAxis}`;
  renderMeters();
  renderHud();
  if (state.activePanel === "story") renderStoryline();
  followTimelinePlayhead();
  renderTimelineMinimap();
}

function setPlayhead(time, options = {}) {
  const duration = projectDuration();
  const nextTime = clamp(time, 0, duration);
  state.currentTime = nextTime;

  if (options.syncAudio !== false && Number.isFinite(els.audioPlayer.duration)) {
    if (Math.abs(els.audioPlayer.currentTime - nextTime) > 0.03) {
      els.audioPlayer.currentTime = nextTime;
    }
  }

  const nextScene = sceneAt(nextTime);
  const selectionChanged = Boolean(nextScene && nextScene.id !== state.selectedId && options.select !== false);
  if (selectionChanged) state.selectedId = nextScene.id;

  updateTransportUi();
  renderPreview();
  if (selectionChanged) {
    renderScenes();
    renderInspector();
    renderTimeline();
    renderLayerStack();
  }
}

function pausePlayback() {
  state.playing = false;
  if (state.playTimer) cancelAnimationFrame(state.playTimer);
  state.playTimer = null;
  els.audioPlayer.pause();
  updateTransportUi();
  setStatus("Paused");
  showHud("Paused");
}

function tickPlayback() {
  if (!state.playing) return;
  const duration = projectDuration();
  const nextTime = clamp(els.audioPlayer.currentTime || state.currentTime, 0, duration);
  setPlayhead(nextTime, { syncAudio: false });
  if (nextTime >= duration - 0.02) {
    pausePlayback();
    return;
  }
  state.playTimer = requestAnimationFrame(tickPlayback);
}

async function playPlayback() {
  if (!state.project) return;
  if (state.currentTime >= projectDuration() - 0.02) state.currentTime = 0;
  els.audioPlayer.currentTime = state.currentTime;
  els.audioPlayer.volume = state.audio.master / 100;
  try {
    await els.audioPlayer.play();
    state.playing = true;
    updateTransportUi();
    setStatus("Playing");
    showHud("Playing");
    tickPlayback();
  } catch (error) {
    setStatus(`Playback blocked: ${error.message}`);
    showHud("Playback blocked");
  }
}

function togglePlayback() {
  if (state.playing) pausePlayback();
  else playPlayback();
}

function assetTitle(asset) {
  if (asset.title) return asset.title;
  return `Frame ${String(asset.index).padStart(3, "0")}`;
}

function allAssets() {
  const references = state.project.references.map((asset) => ({
    ...asset,
    kind: "reference",
  }));
  const frames = state.project.frames.map((frame) => ({
    ...frame,
    kind: "frame",
    frameIndex: frame.index,
    title: `Frame ${String(frame.index).padStart(3, "0")}`,
    note: `${frame.source} r${frame.row}c${frame.col}`,
  }));
  if (state.assetTab === "frames") return frames;
  if (state.assetTab === "all") return references;
  return references.filter((asset) => asset.sheet === state.assetTab);
}

function assetDragPayload(asset) {
  return {
    type: "asset",
    frameIndex: asset.frameIndex || asset.index || null,
    image: asset.image,
    path: asset.path,
    title: assetTitle(asset),
  };
}

function sceneDragPayload(scene) {
  return {
    type: "scene",
    id: scene.id,
  };
}

function setDragPayload(event, payload) {
  event.dataTransfer.effectAllowed = payload.type === "scene" || payload.type === "layer" ? "move" : "copy";
  event.dataTransfer.setData("application/json", JSON.stringify(payload));
  event.dataTransfer.setData("text/plain", payload.type);
}

function readDragPayload(event) {
  const raw = event.dataTransfer.getData("application/json");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function applyAssetToScene(scene, payload) {
  if (!scene || payload?.type !== "asset" || state.layerLocked.video) return;
  scene.frameIndex = payload.frameIndex;
  scene.image = payload.image;
  scene.imagePath = payload.path;
  setDirty();
}

function applyDropToTimelineLayer(scene, payload, layerId) {
  if (!scene || !payload) return;
  if (payload.type === "asset") {
    if (layerId === "overlayLayer") {
      scene.rubabOverlay = true;
      state.activePanel = "audio";
      setDirty();
      showHud("Rubab overlay enabled");
      return;
    }
    if (layerId === "vfxLayer") {
      ensureSceneDefaults(scene).effects = { ...scene.effects, grain: true, vignette: true, dust: true };
      state.activePanel = "vfx";
      setDirty();
      showHud("Asset drop enabled VFX");
      return;
    }
    if (layerId === "captionLayer") {
      scene.captions = `${scene.titleHi || ""}${scene.titleHi ? "\n" : ""}${scene.titleEn || payload.title || "Caption"}`;
      state.activePanel = "accessibility";
      setDirty();
      showHud("Caption layer focused");
      return;
    }
    applyAssetToScene(scene, payload);
    showHud("Asset placed on video layer");
  }
}

function dropTimeFromEvent(event) {
  const source = event.currentTarget?.classList?.contains("layer-lane") ? event.currentTarget : els.videoLayer;
  const rect = source.getBoundingClientRect();
  return clamp((event.clientX - rect.left) / pixelsPerSecond(), 0, projectDuration());
}

function moveSceneTo(scene, start) {
  if (!scene || state.layerLocked.video) return;
  const duration = sceneLength(scene);
  const snapped = state.snap ? Math.round(start * FPS) / FPS : start;
  scene.start = roundTime(clamp(snapped, 0, Math.max(0, projectDuration() - duration)));
  scene.end = roundTime(scene.start + duration);
  state.selectedId = scene.id;
  state.currentTime = scene.start;
  setDirty();
}

function trimSceneEdge(scene, side, nextValue) {
  if (!scene || state.layerLocked.video) return;
  const snapped = state.snap ? Math.round(Number(nextValue) * FPS) / FPS : Number(nextValue);
  if (side === "start") {
    scene.start = roundTime(clamp(snapped, 0, Number(scene.end) - MIN_SCENE_SECONDS));
    state.currentTime = scene.start;
  } else {
    scene.end = roundTime(clamp(snapped, Number(scene.start) + MIN_SCENE_SECONDS, Math.max(projectDuration(), Number(scene.end))));
    state.currentTime = scene.end;
  }
  state.selectedId = scene.id;
}

function trimSceneByFrames(scene, side, frameDelta) {
  if (!scene) return;
  const edge = side === "start" ? Number(scene.start) : Number(scene.end);
  trimSceneEdge(scene, side, edge + frameDelta / FPS);
  setDirty();
  render();
  showHud(`${side === "start" ? "In" : "Out"} trimmed ${frameDelta > 0 ? "+" : ""}${frameDelta}f`);
}

function transitionLabel(scene) {
  const transition = ensureSceneDefaults(scene).transition;
  if (!transition || transition.type === "cut" || Number(transition.duration) <= 0) return "Cut";
  return `${titleCase(transition.type)} ${Number(transition.duration).toFixed(2)}s`;
}

function cycleTransition() {
  const scene = ensureSceneDefaults(selectedScene());
  const next = sceneAfter(scene);
  if (!scene || !next) {
    setStatus("Select a scene with a following cut");
    showHud("No following cut");
    return;
  }
  const types = ["cut", "crossfade", "dip", "wipe"];
  const currentIndex = Math.max(0, types.indexOf(scene.transition?.type || "cut"));
  const nextType = types[(currentIndex + 1) % types.length];
  const duration = nextType === "cut"
    ? 0
    : roundTime(Math.min(0.75, sceneLength(scene) / 2, sceneLength(next) / 2));
  scene.transition = { type: nextType, duration };
  setDirty();
  render();
  showHud(nextType === "cut" ? "Transition removed" : `${titleCase(nextType)} transition added`);
}

function nudgeSelectedScene(frameDelta) {
  const scene = selectedScene();
  if (!scene || state.layerLocked.video) return;
  moveSceneTo(scene, Number(scene.start) + frameDelta / FPS);
  render();
  showHud(`Clip nudged ${frameDelta > 0 ? "+" : ""}${frameDelta}f`);
}

function fitSelectedClip() {
  const scene = selectedScene();
  if (!scene) return;
  const center = (Number(scene.start) + Number(scene.end)) / 2;
  els.timelineViewport.scrollLeft = Math.max(0, center * pixelsPerSecond() - visibleTimelineWidth() / 2);
  renderTimelineMinimap();
  showHud("Selected clip centered");
}

function beginClipResize(event, scene, side) {
  if (!scene || state.layerLocked.video) return;
  event.preventDefault();
  event.stopPropagation();
  state.timelineResize = {
    sceneId: scene.id,
    side,
    startX: event.clientX,
    originalStart: Number(scene.start),
    originalEnd: Number(scene.end),
  };
  document.body.classList.add("is-trimming-clip");
  state.selectedId = scene.id;
  showHud(`Drag ${side === "start" ? "in" : "out"} point`, { sticky: true });

  function move(pointerEvent) {
    const resize = state.timelineResize;
    const active = state.scenes.find((item) => item.id === resize?.sceneId);
    if (!resize || !active) return;
    const deltaSeconds = (pointerEvent.clientX - resize.startX) / pixelsPerSecond();
    const nextValue = resize.side === "start" ? resize.originalStart + deltaSeconds : resize.originalEnd + deltaSeconds;
    trimSceneEdge(active, resize.side, nextValue);
    render();
  }

  function stop() {
    document.body.classList.remove("is-trimming-clip");
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", stop);
    document.removeEventListener("pointercancel", stop);
    state.timelineResize = null;
    setDirty();
    showHud("Clip length updated");
  }

  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", stop);
  document.addEventListener("pointercancel", stop);
}

function addClipTrimHandle(clip, scene, side) {
  const handle = document.createElement("span");
  handle.className = `clip-trim-handle trim-${side}`;
  handle.tabIndex = 0;
  handle.setAttribute("role", "separator");
  handle.setAttribute("aria-label", `Trim ${side === "start" ? "start" : "end"} of ${scene.titleEn || "clip"}`);
  handle.title = `Drag ${side === "start" ? "in" : "out"} point`;
  handle.addEventListener("pointerdown", (event) => beginClipResize(event, scene, side));
  handle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  handle.addEventListener("keydown", (event) => {
    const bigStep = event.shiftKey ? 6 : 1;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      trimSceneByFrames(scene, side, -bigStep);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      trimSceneByFrames(scene, side, bigStep);
    }
  });
  clip.appendChild(handle);
}

function renderScenes() {
  const current = selectedScene();
  els.sceneList.innerHTML = "";
  for (const scene of sortedScenes()) {
    ensureSceneDefaults(scene);
    const button = document.createElement("button");
    button.className = `scene-item${scene.id === current?.id ? " selected" : ""}`;
    button.dataset.id = scene.id;
    button.draggable = true;
    button.type = "button";
    button.innerHTML = `
      <img src="${scene.image}" alt="">
      <span class="scene-copy">
        <strong>${scene.titleEn || "Untitled"}</strong>
        <span>${fmt(scene.start)} - ${fmt(scene.end)}</span>
        <span>${scene.rubabOverlay ? "Rubab overlay" : `Frame ${scene.frameIndex || "custom"}`}</span>
        <span>${transitionLabel(scene)}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.selectedId = scene.id;
      state.currentTime = Number(scene.start) || 0;
      render();
      showHud("Scene selected");
    });
    button.addEventListener("dragstart", (event) => setDragPayload(event, sceneDragPayload(scene)));
    els.sceneList.appendChild(button);
  }
}

function renderPreview() {
  const scene = ensureSceneDefaults(selectedScene());
  if (!scene) return;
  const composite = scene.composite;
  const effects = scene.effects;
  const captionText = scene.captions || `${scene.titleHi || ""}\n${scene.titleEn || ""}`.trim();

  els.previewImage.src = scene.image;
  els.previewImage.hidden = !state.layerVisibility.video;
  els.previewImage.style.transform = `translate(${composite.x}px, ${composite.y}px) scale(${composite.scale / 100}) rotate(${composite.rotation}deg)`;
  els.previewImage.style.opacity = String(composite.opacity / 100);
  els.previewImage.style.mixBlendMode = composite.blendMode;
  els.previewImage.style.zIndex = layerZIndex("video");

  els.rubabOverlay.src = state.project.rubab.url;
  els.rubabOverlay.classList.toggle("hidden", !scene.rubabOverlay || !state.layerVisibility.rubab);
  els.rubabOverlay.style.opacity = String((state.audio.rubabSolo ? 100 : state.audio.rubab) / 100);
  els.rubabOverlay.style.zIndex = layerZIndex("rubab");

  els.effectLayer.className = [
    "effect-layer",
    state.layerVisibility.vfx && effects.grain ? "effect-grain" : "",
    state.layerVisibility.vfx && effects.vignette ? "effect-vignette" : "",
    state.layerVisibility.vfx && effects.dust ? "effect-dust" : "",
    state.layerVisibility.vfx && effects.sonic ? "effect-sonic" : "",
  ].filter(Boolean).join(" ");
  els.effectLayer.style.zIndex = layerZIndex("vfx");

  els.safeGuides.hidden = !state.safeGuides;
  els.safeGuides.style.zIndex = "90";
  els.captionOverlay.hidden = !state.access.captions || !state.layerVisibility.captions;
  els.captionOverlay.textContent = captionText;
  els.captionOverlay.style.zIndex = layerZIndex("captions");
  els.previewTime.textContent = `${fmt(scene.start)} - ${fmt(scene.end)}`;
  els.previewTitle.textContent = scene.titleEn || "";
  els.viewerColor.textContent = state.access.colorMode === "none" ? "Rec.709" : `${state.access.colorMode} safe`;
  renderHud();
}

function renderLayerStack() {
  const scene = selectedScene();
  const layerByKey = {
    vfx: { key: "vfx", title: "VFX Bus", meta: "grain, vignette, dust, sonic" },
    captions: { key: "captions", title: "Caption Track", meta: state.access.captions ? "visible captions" : "caption preview off" },
    rubab: { key: "rubab", title: "Rubab Picture-in-Picture", meta: scene?.rubabOverlay ? "active in selected scene" : "inactive here" },
    video: { key: "video", title: "Scene Plate", meta: scene?.imagePath || "" },
    audio: { key: "audio", title: "Master Audio", meta: "voice, music, rubab mix" },
  };
  els.layerStack.innerHTML = "";
  for (const layer of orderedLayerKeys().map((key) => layerByKey[key]).filter(Boolean)) {
    const row = document.createElement("div");
    row.className = `layer-stack-row${state.draggingLayerKey === layer.key ? " dragging" : ""}`;
    row.dataset.layerKey = layer.key;
    row.draggable = true;
    row.innerHTML = `
      <span class="layer-grip" aria-hidden="true">⋮⋮</span>
      <button type="button" data-layer-action="visible" aria-label="Toggle ${layer.title} visibility">${state.layerVisibility[layer.key] ? "On" : "Off"}</button>
      <button type="button" data-layer-action="lock" aria-label="Toggle ${layer.title} lock">${state.layerLocked[layer.key] ? "Lock" : "Free"}</button>
      <span><strong>${layer.title}</strong><em>${layer.meta}</em></span>
    `;
    row.addEventListener("dragstart", (event) => {
      state.draggingLayerKey = layer.key;
      row.classList.add("dragging");
      setDragPayload(event, { type: "layer", key: layer.key });
    });
    row.addEventListener("dragend", () => {
      state.draggingLayerKey = null;
      row.classList.remove("dragging");
      for (const item of els.layerStack.querySelectorAll(".drop-target")) item.classList.remove("drop-target");
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("drop-target");
    });
    row.addEventListener("dragleave", () => row.classList.remove("drop-target"));
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      row.classList.remove("drop-target");
      const payload = readDragPayload(event);
      if (payload?.type === "layer") moveLayerBefore(payload.key, layer.key);
    });
    row.querySelector(".layer-grip").addEventListener("pointerdown", (event) => beginLayerPointerDrag(event, layer.key));
    row.querySelector('[data-layer-action="visible"]').addEventListener("click", () => {
      state.layerVisibility[layer.key] = !state.layerVisibility[layer.key];
      setDirty();
      showHud(`${layer.title} ${state.layerVisibility[layer.key] ? "visible" : "hidden"}`);
      render();
    });
    row.querySelector('[data-layer-action="lock"]').addEventListener("click", () => {
      state.layerLocked[layer.key] = !state.layerLocked[layer.key];
      setDirty();
      showHud(`${layer.title} ${state.layerLocked[layer.key] ? "locked" : "unlocked"}`);
      renderLayerStack();
    });
    els.layerStack.appendChild(row);
  }
}

function setTimelineGeometry(laneWidth) {
  els.timelineCanvas.style.width = `${laneWidth + 86}px`;
  for (const lane of [els.timelineRuler, els.markerLayer, els.videoLayer, els.overlayLayer, els.vfxLayer, els.captionLayer, els.audioLayer]) {
    lane.style.width = `${laneWidth}px`;
  }
}

function renderTimelineMinimap() {
  if (!state.project || !els.timelineMiniMapTrack) return;
  const duration = Math.max(MIN_SCENE_SECONDS, projectDuration());
  const trackWidth = Math.max(1, els.timelineMiniMapTrack.clientWidth);
  els.timelineMiniMapTrack.innerHTML = "";

  for (const scene of sortedScenes()) {
    const segment = document.createElement("button");
    segment.type = "button";
    segment.className = `minimap-segment${scene.id === state.selectedId ? " active" : ""}`;
    segment.style.left = `${(Number(scene.start) / duration) * 100}%`;
    segment.style.width = `${Math.max(1.2, (sceneLength(scene) / duration) * 100)}%`;
    segment.title = `${scene.titleEn || "Scene"} · ${fmt(scene.start)}`;
    segment.addEventListener("click", () => {
      state.selectedId = scene.id;
      setPlayhead(Number(scene.start) || 0);
      showHud("Minimap scene selected");
    });
    els.timelineMiniMapTrack.appendChild(segment);
  }

  if (state.timelineOptions.markers) {
    for (const marker of state.markers) {
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = `minimap-pin pin-${marker.kind || "scene"}`;
      pin.style.left = `${((Number(marker.time) || 0) / duration) * 100}%`;
      pin.title = `${marker.label} · ${fmt(marker.time)}`;
      pin.addEventListener("click", () => setPlayhead(marker.time));
      els.timelineMiniMapTrack.appendChild(pin);
    }
  }

  if (state.timelineOptions.notes) {
    for (const note of state.uxNotes) {
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = `minimap-pin pin-note pin-${note.priority.toLowerCase()}`;
      pin.style.left = `${((Number(note.time) || 0) / duration) * 100}%`;
      pin.title = `${note.priority} UX · ${fmt(note.time)}`;
      pin.addEventListener("click", () => focusUxNote(note));
      els.timelineMiniMapTrack.appendChild(pin);
    }
  }

  const play = document.createElement("span");
  play.className = "minimap-playhead";
  play.style.left = `${(state.currentTime / duration) * 100}%`;
  els.timelineMiniMapTrack.appendChild(play);

  const laneWidth = Math.max(duration * pixelsPerSecond(), visibleTimelineWidth(), 480);
  const scroll = Math.max(0, els.timelineViewport.scrollLeft - 86);
  const windowLeft = clamp(scroll / laneWidth, 0, 1) * trackWidth;
  const windowWidth = clamp(visibleTimelineWidth() / laneWidth, 0.04, 1) * trackWidth;
  els.timelineMiniMapWindow.style.left = `${windowLeft}px`;
  els.timelineMiniMapWindow.style.width = `${windowWidth}px`;
}

function jumpTimelineFromMinimap(event) {
  const rect = els.timelineMiniMapTrack.getBoundingClientRect();
  const percent = clamp((event.clientX - rect.left) / rect.width, 0, 1);
  const time = roundTime(percent * projectDuration());
  setPlayhead(time);
  els.timelineViewport.scrollLeft = Math.max(0, time * pixelsPerSecond() - visibleTimelineWidth() / 2);
  renderTimelineMinimap();
  showHud("Minimap jump");
}

function markerAbbrev(marker) {
  const label = String(marker.label || "M").trim();
  if (!label) return "M";
  if (/^\d+$/.test(label)) return label.padStart(2, "0").slice(0, 2);
  return label
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function markerTitle(marker) {
  return `${marker.label || "Marker"} · ${fmt(marker.time)} · drag to retime · double-click to edit`;
}

function setMarkerTime(marker, time) {
  marker.time = roundTime(clamp(time, 0, projectDuration()));
  return marker.time;
}

function closeMarkerEditor() {
  for (const editor of els.markerLayer.querySelectorAll(".marker-editor")) editor.remove();
}

function openMarkerEditor(marker) {
  if (!marker) return;
  closeMarkerEditor();
  const editor = document.createElement("form");
  editor.className = "marker-editor";
  editor.style.left = `${clamp(marker.time * pixelsPerSecond() + 20, 2, Math.max(2, els.markerLayer.clientWidth - 230))}px`;
  editor.setAttribute("aria-label", "Edit marker");

  const labelField = document.createElement("label");
  labelField.textContent = "Label";
  const labelInput = document.createElement("input");
  labelInput.name = "markerLabel";
  labelInput.type = "text";
  labelInput.value = marker.label || "";
  labelField.appendChild(labelInput);

  const timeField = document.createElement("label");
  timeField.textContent = "Time";
  const timeInput = document.createElement("input");
  timeInput.name = "markerTime";
  timeInput.type = "number";
  timeInput.min = "0";
  timeInput.step = (1 / FPS).toFixed(6);
  timeInput.value = Number(marker.time || 0).toFixed(3);
  timeField.appendChild(timeInput);

  const kindField = document.createElement("label");
  kindField.textContent = "Type";
  const kindInput = document.createElement("select");
  kindInput.name = "markerKind";
  for (const [value, label] of [
    ["manual", "Manual"],
    ["scene", "Scene"],
    ["rubab", "Rubab"],
    ["cue", "Cue"],
    ["beat", "Beat"],
  ]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    kindInput.appendChild(option);
  }
  kindInput.value = marker.kind || "manual";
  kindField.appendChild(kindInput);

  const actions = document.createElement("div");
  actions.className = "marker-editor-actions";
  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Save";
  let committed = false;
  const commitMarker = () => {
    if (committed) return;
    committed = true;
    marker.label = labelInput.value.trim() || "Marker";
    marker.kind = kindInput.value;
    setMarkerTime(marker, Number(timeInput.value));
    state.currentTime = marker.time;
    setDirty();
    closeMarkerEditor();
    renderTimeline();
    setPlayhead(marker.time, { syncAudio: false, select: false });
    showHud("Marker updated");
  };
  save.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    commitMarker();
  });
  save.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    commitMarker();
  });
  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Delete";
  const removeMarker = () => {
    state.markers = state.markers.filter((item) => item.id !== marker.id);
    setDirty();
    closeMarkerEditor();
    renderTimeline();
    showHud("Marker deleted");
  };
  remove.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeMarker();
  });
  remove.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeMarker();
  });
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeMarkerEditor();
  });
  close.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeMarkerEditor();
  });
  actions.append(save, remove, close);

  editor.append(labelField, timeField, kindField, actions);
  editor.addEventListener("submit", (event) => {
    event.preventDefault();
    commitMarker();
  });
  editor.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMarkerEditor();
    }
  });
  els.markerLayer.appendChild(editor);
  requestAnimationFrame(() => labelInput.focus());
}

function markerNudge(marker, frameDelta) {
  if (!marker) return;
  setMarkerTime(marker, Number(marker.time) + frameDelta / FPS);
  state.currentTime = marker.time;
  setDirty();
  renderTimeline();
  setPlayhead(marker.time, { syncAudio: false, select: false });
  showHud(`Marker nudged ${frameDelta > 0 ? "+" : ""}${frameDelta}f`);
}

function beginMarkerPointerDrag(event, marker, element) {
  if (!marker || event.button > 0) return;
  event.preventDefault();
  event.stopPropagation();
  closeMarkerEditor();
  const startX = event.clientX;
  const originalTime = Number(marker.time) || 0;
  state.markerPointerDrag = {
    id: marker.id,
    moved: false,
    startX,
    originalTime,
  };
  element.classList.add("dragging");
  document.body.classList.add("is-dragging-marker");

  function move(pointerEvent) {
    const drag = state.markerPointerDrag;
    if (!drag || drag.id !== marker.id) return;
    const delta = pointerEvent.clientX - startX;
    if (Math.abs(delta) > 2) drag.moved = true;
    const nextTime = setMarkerTime(marker, originalTime + delta / pixelsPerSecond());
    element.style.left = `${nextTime * pixelsPerSecond()}px`;
    element.title = markerTitle(marker);
    element.setAttribute("aria-label", markerTitle(marker));
    state.currentTime = nextTime;
    updateTransportUi();
  }

  function stop() {
    const drag = state.markerPointerDrag;
    document.body.classList.remove("is-dragging-marker");
    element.classList.remove("dragging");
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", stop);
    document.removeEventListener("pointercancel", stop);
    state.markerPointerDrag = null;
    if (drag?.moved) {
      setDirty();
      renderTimeline();
      setPlayhead(marker.time, { syncAudio: false, select: false });
      showHud("Marker moved");
      return;
    }
    setPlayhead(marker.time, { syncAudio: false, select: false });
    showHud("Marker selected");
  }

  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", stop);
  document.addEventListener("pointercancel", stop);
}

function renderTimeline() {
  const current = selectedScene();
  const duration = projectDuration();
  applyTimelineViewState();
  const pps = pixelsPerSecond();
  const laneWidth = Math.max(duration * pps, els.timelineViewport.clientWidth - 86, 480);
  const denseTimeline = state.scenes.length > 80;
  const minClipWidth = denseTimeline
    ? state.timelineLayout === "compact" ? 18 : 24
    : 48;
  const tickStep = pps >= 120 ? 2 : pps >= 72 ? 5 : 10;
  setTimelineGeometry(laneWidth);

  for (const lane of [els.timelineRuler, els.markerLayer, els.videoLayer, els.overlayLayer, els.vfxLayer, els.captionLayer, els.audioLayer]) {
    lane.innerHTML = "";
  }

  for (let t = 0; t <= duration + 0.01; t += tickStep) {
    const tick = document.createElement("div");
    tick.className = "ruler-tick";
    tick.style.left = `${t * pps}px`;
    tick.innerHTML = `<span>${fmt(t)}</span>`;
    els.timelineRuler.appendChild(tick);
  }

  if (state.timelineOptions.markers) {
    for (const marker of state.markers) {
      const mark = document.createElement("button");
      mark.type = "button";
      mark.className = `marker-clip marker-pin marker-${marker.kind || "scene"}`;
      mark.style.left = `${marker.time * pps}px`;
      mark.title = markerTitle(marker);
      mark.setAttribute("aria-label", markerTitle(marker));
      mark.innerHTML = `<span>${markerAbbrev(marker)}</span>`;
      mark.addEventListener("pointerdown", (event) => beginMarkerPointerDrag(event, marker, mark));
      mark.addEventListener("dblclick", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openMarkerEditor(marker);
      });
      mark.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        openMarkerEditor(marker);
      });
      mark.addEventListener("keydown", (event) => {
        const step = event.shiftKey ? 12 : 1;
        if (event.key === "Enter") {
          event.preventDefault();
          openMarkerEditor(marker);
        }
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          state.markers = state.markers.filter((item) => item.id !== marker.id);
          setDirty();
          renderTimeline();
          showHud("Marker deleted");
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          markerNudge(marker, -step);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          markerNudge(marker, step);
        }
      });
      els.markerLayer.appendChild(mark);
    }
  }

  if (state.timelineOptions.notes) {
    for (const note of state.uxNotes) {
      const mark = document.createElement("button");
      mark.type = "button";
      mark.className = `marker-clip marker-note note-${note.priority.toLowerCase()}`;
      mark.style.left = `${(Number(note.time) || 0) * pps}px`;
      mark.innerHTML = `<span>${note.priority} UX</span>`;
      mark.addEventListener("click", () => focusUxNote(note));
      els.markerLayer.appendChild(mark);
    }
  }

  for (const scene of sortedScenes()) {
    const transition = ensureSceneDefaults(scene).transition;
    if (!transition || transition.type === "cut" || Number(transition.duration) <= 0) continue;
    const transitionDuration = Math.min(Number(transition.duration), sceneLength(scene));
    const transitionClip = document.createElement("button");
    transitionClip.type = "button";
    transitionClip.className = `marker-clip transition-clip transition-${transition.type}`;
    transitionClip.style.left = `${Math.max(0, (Number(scene.end) - transitionDuration / 2) * pps)}px`;
    transitionClip.style.width = `${Math.max(40, transitionDuration * pps)}px`;
    transitionClip.innerHTML = `<span>${transitionLabel(scene)}</span>`;
    transitionClip.title = `${transitionLabel(scene)} after ${scene.titleEn || "scene"}`;
    transitionClip.addEventListener("click", () => {
      state.selectedId = scene.id;
      state.currentTime = Math.max(Number(scene.start), Number(scene.end) - transitionDuration / 2);
      state.activePanel = "inspector";
      render();
      showHud("Transition selected");
    });
    els.markerLayer.appendChild(transitionClip);
  }

  for (const scene of sortedScenes()) {
    ensureSceneDefaults(scene);
    const clipDuration = sceneLength(scene);
    const width = Math.max(minClipWidth, clipDuration * pps);
    const left = `${Number(scene.start) * pps}px`;

    const clip = document.createElement("button");
    clip.type = "button";
    clip.className = `clip video-clip${scene.id === current?.id ? " selected" : ""}`;
    clip.dataset.id = scene.id;
    clip.draggable = true;
    clip.style.left = left;
    clip.style.width = `${width}px`;
    clip.innerHTML = `
      <img src="${scene.image}" alt="">
      <span class="clip-duration-pill">${sceneLength(scene).toFixed(2)}s</span>
      <span class="clip-label">${scene.titleEn || "Untitled"} · ${fmt(scene.start)}</span>
    `;
    addClipTrimHandle(clip, scene, "start");
    addClipTrimHandle(clip, scene, "end");
    clip.addEventListener("click", () => {
      state.selectedId = scene.id;
      state.currentTime = Number(scene.start) || 0;
      render();
      showHud("Video clip selected");
    });
    clip.addEventListener("dragstart", (event) => {
      clip.classList.add("dragging");
      setDragPayload(event, sceneDragPayload(scene));
    });
    clip.addEventListener("dragend", () => clip.classList.remove("dragging"));
    els.videoLayer.appendChild(clip);

    if (scene.rubabOverlay) {
      const overlay = document.createElement("button");
      overlay.type = "button";
      overlay.className = `clip overlay-clip${scene.id === current?.id ? " selected" : ""}`;
      overlay.style.left = left;
      overlay.style.width = `${width}px`;
      overlay.innerHTML = `<span class="clip-label">Rubab · ${scene.titleEn || "Scene"}</span>`;
      overlay.addEventListener("click", () => {
        state.selectedId = scene.id;
        state.currentTime = Number(scene.start) || 0;
        render();
        showHud("Rubab overlay selected");
      });
      els.overlayLayer.appendChild(overlay);
    }

    const vfx = document.createElement("button");
    vfx.type = "button";
    vfx.className = `clip vfx-clip${scene.id === current?.id ? " selected" : ""}`;
    vfx.style.left = left;
    vfx.style.width = `${width}px`;
    vfx.innerHTML = `<span class="clip-label">${activeEffectsLabel(scene)}</span>`;
    vfx.addEventListener("click", () => {
      state.selectedId = scene.id;
      state.activePanel = "vfx";
      render();
      showHud("VFX clip selected");
    });
    els.vfxLayer.appendChild(vfx);

    const caption = document.createElement("button");
    caption.type = "button";
    caption.className = `clip caption-clip${scene.id === current?.id ? " selected" : ""}`;
    caption.style.left = left;
    caption.style.width = `${width}px`;
    caption.innerHTML = `<span class="clip-label">${scene.titleHi || scene.titleEn || "Caption"}</span>`;
    caption.addEventListener("click", () => {
      state.selectedId = scene.id;
      state.activePanel = "accessibility";
      render();
      showHud("Caption clip selected");
    });
    els.captionLayer.appendChild(caption);
  }

  const audio = document.createElement("button");
  audio.type = "button";
  audio.className = "clip audio-clip";
  audio.style.left = "0px";
  audio.style.width = `${Math.max(180, duration * pps)}px`;
  audio.innerHTML = `<span class="clip-label">${state.project.audio.name || "Master audio"} · ${fmt(duration)}</span>`;
  audio.addEventListener("click", (event) => {
    setPlayhead(dropTimeFromEvent(event));
    showHud("Audio playhead moved");
  });
  els.audioLayer.appendChild(audio);
  updateTransportUi();
  renderTimelineMinimap();
}

function activeEffectsLabel(scene) {
  const effects = ensureSceneDefaults(scene).effects;
  const active = Object.entries(effects).filter(([, value]) => value).map(([key]) => key);
  return active.length ? `FX · ${active.join(" ")}` : "FX · clean";
}

function renderInspector() {
  const scene = ensureSceneDefaults(selectedScene());
  if (!scene) return;
  const composite = scene.composite;
  const effects = scene.effects;

  els.titleEnInput.value = scene.titleEn || "";
  els.titleHiInput.value = scene.titleHi || "";
  els.startInput.value = Number(scene.start).toFixed(3);
  els.endInput.value = Number(scene.end).toFixed(3);
  els.rubabInput.checked = Boolean(scene.rubabOverlay);
  els.noteInput.value = scene.note || "";
  els.assetRef.innerHTML = `
    <strong>${scene.frameIndex ? `Frame ${String(scene.frameIndex).padStart(3, "0")}` : "Composite / custom"}</strong>
    <span>${scene.imagePath}</span>
  `;

  els.transformXInput.value = composite.x;
  els.transformYInput.value = composite.y;
  els.scaleInput.value = composite.scale;
  els.rotationInput.value = composite.rotation;
  els.opacityInput.value = composite.opacity;
  els.blendModeInput.value = composite.blendMode;
  els.grainInput.checked = effects.grain;
  els.vignetteInput.checked = effects.vignette;
  els.dustInput.checked = effects.dust;
  els.sonicInput.checked = effects.sonic;

  for (const button of els.panelTabs.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.panel === state.activePanel);
  }
  document.querySelector(".right-panel").dataset.panel = state.activePanel;
  renderKeyframes();
}

function renderBaselineDock() {
  if (!els.baselineTitle) return;
  const scene = selectedScene();
  if (!scene) {
    els.baselineTitle.textContent = "No scene selected";
    els.baselineTime.textContent = `${fmt(state.currentTime)} - ${fmt(state.currentTime)}`;
    els.baselineAsset.textContent = "No asset path";
    els.baselineAsset.title = "";
    return;
  }
  els.baselineTitle.textContent = scene.titleEn || "Untitled";
  els.baselineTime.textContent = `${fmt(scene.start)} - ${fmt(scene.end)}`;
  els.baselineAsset.textContent = scene.imagePath || "No asset path";
  els.baselineAsset.title = scene.imagePath || "";
}

function renderAssets() {
  const query = state.assetQuery.trim().toLowerCase();
  const assets = allAssets().filter((asset) => {
    if (!query) return true;
    return `${assetTitle(asset)} ${asset.note || ""} ${asset.sheet || ""}`.toLowerCase().includes(query);
  });
  els.assetGrid.innerHTML = "";
  for (const asset of assets) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "asset-card";
    button.draggable = true;
    button.innerHTML = `
      <img src="${asset.image}" alt="">
      <strong>${assetTitle(asset)}</strong>
      <span>${asset.frameIndex ? `Frame ${String(asset.frameIndex).padStart(3, "0")}` : asset.sheet || ""}</span>
    `;
    button.addEventListener("click", () => {
      const scene = selectedScene();
      if (!scene) return;
      scene.frameIndex = asset.frameIndex || asset.index || null;
      scene.image = asset.image;
      scene.imagePath = asset.path;
      setDirty();
      render();
      showHud("Asset applied");
    });
    button.addEventListener("dragstart", (event) => setDragPayload(event, assetDragPayload(asset)));
    els.assetGrid.appendChild(button);
  }
}

function renderUxNotes() {
  if (!els.uxNotesList) return;
  const scene = selectedScene();
  const visibleNotes = state.uxNotes.filter((note) => state.uxNoteFilter === "all" || note.status === state.uxNoteFilter);
  els.uxNoteFilterInput.value = state.uxNoteFilter;
  els.uxNotesCount.textContent = `${visibleNotes.length} / ${state.uxNotes.length} notes`;
  els.uxNotesContext.textContent = uxNoteContext(scene);
  els.uxNotesList.innerHTML = "";

  if (!visibleNotes.length) {
    const empty = document.createElement("p");
    empty.className = "empty-notes";
    empty.textContent = "No UX notes in this view.";
    els.uxNotesList.appendChild(empty);
    return;
  }

  for (const note of visibleNotes) {
    const card = document.createElement("article");
    card.className = `ux-note-card status-${note.status}`;

    const head = document.createElement("div");
    head.className = "ux-note-head";
    const title = document.createElement("strong");
    title.textContent = `${note.priority} · ${titleCase(note.category)}`;
    const status = document.createElement("select");
    status.setAttribute("aria-label", "UX note status");
    for (const value of ["open", "planned", "done"]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = titleCase(value);
      status.appendChild(option);
    }
    status.value = note.status;
    status.addEventListener("change", () => updateUxNote(note.id, { status: status.value }));
    head.append(title, status);

    const meta = document.createElement("div");
    meta.className = "ux-note-meta";
    meta.textContent = `${fmt(note.time)} · Scene ${String(note.sceneId || "-").padStart(2, "0")} ${note.sceneTitle || ""}`.trim();

    const text = document.createElement("p");
    text.textContent = note.text;

    const sketch = note.sketch ? document.createElement("img") : null;
    if (sketch) {
      sketch.className = "ux-note-sketch";
      sketch.src = note.sketch;
      sketch.alt = "Handwritten UX sketch";
    }

    const actions = document.createElement("div");
    actions.className = "ux-note-actions";
    const locate = document.createElement("button");
    locate.type = "button";
    locate.textContent = "Locate";
    locate.title = "Go to note timecode";
    locate.addEventListener("click", () => focusUxNote(note));
    const copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = "Copy";
    copy.title = "Copy note text into draft";
    copy.addEventListener("click", () => {
      els.uxNoteCategoryInput.value = note.category;
      els.uxNotePriorityInput.value = note.priority;
      els.uxNoteTextInput.value = note.text;
      els.uxNoteTextInput.focus();
      showHud("UX note copied to draft");
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Delete";
    remove.title = "Delete UX note";
    remove.addEventListener("click", () => deleteUxNote(note.id));
    actions.append(locate, copy, remove);

    card.append(head, meta, text);
    if (sketch) card.appendChild(sketch);
    card.appendChild(actions);
    els.uxNotesList.appendChild(card);
  }
}

function normalizeStoryline(data) {
  return {
    ...data,
    beats: (data.beats || []).map((beat) => ({
      ...beat,
      startSeconds: parseStoryTime(beat.start),
      endSeconds: parseStoryTime(beat.end),
    })),
  };
}

function currentStoryBeat() {
  const beats = state.storyline?.beats || [];
  return (
    beats.find((beat) => state.currentTime >= beat.startSeconds && state.currentTime < beat.endSeconds) ||
    beats.find((beat) => state.currentTime <= beat.endSeconds) ||
    beats[beats.length - 1] ||
    null
  );
}

function jumpToStoryBeat(beat) {
  if (!beat) return;
  const scene = sceneAt(beat.startSeconds);
  if (scene) state.selectedId = scene.id;
  state.activePanel = "story";
  setPlayhead(beat.startSeconds);
  render();
  showHud(`Story beat ${beat.beat}: ${beat.title_en}`);
}

function renderStoryline() {
  if (!els.storyBeatList) return;
  const storyline = state.storyline;
  if (!storyline?.beats?.length) {
    els.storyCurrentTime.textContent = fmt(state.currentTime);
    els.storyCurrentTitle.textContent = "Storyline not loaded";
    els.storyCurrentAction.textContent = "Open reconstructed_storyline.json to load beats.";
    els.storyFrameRefs.innerHTML = "";
    els.storyLogline.textContent = "";
    els.storyBeatList.innerHTML = "";
    return;
  }

  const activeBeat = currentStoryBeat();
  els.storyLogline.textContent = storyline.logline || "";
  els.storyCurrentTime.textContent = activeBeat ? `${activeBeat.start} - ${activeBeat.end}` : fmt(state.currentTime);
  els.storyCurrentTitle.textContent = activeBeat ? `${activeBeat.beat}. ${activeBeat.title_en}` : "Outside story range";
  els.storyCurrentAction.textContent = activeBeat?.story_action || "";
  els.storyFrameRefs.innerHTML = "";

  const refs = activeBeat ? [activeBeat.primary_frame, ...(activeBeat.supporting_frames || [])].filter(Boolean).slice(0, 8) : [];
  for (const ref of refs) {
    const chip = document.createElement("span");
    chip.textContent = ref.split("_")[0];
    chip.title = ref;
    els.storyFrameRefs.appendChild(chip);
  }

  els.storyBeatList.innerHTML = "";
  for (const beat of storyline.beats) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `story-beat-card${beat === activeBeat ? " active" : ""}`;
    card.innerHTML = `
      <span>${beat.start} - ${beat.end}</span>
      <strong>${beat.beat}. ${beat.title_en}</strong>
      <em>${beat.story_action}</em>
    `;
    card.addEventListener("click", () => jumpToStoryBeat(beat));
    els.storyBeatList.appendChild(card);
  }
}

function renderTabs() {
  for (const button of els.assetTabs.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.tab === state.assetTab);
  }
  for (const button of els.workspaceModeTabs.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.mode === state.workspaceMode);
  }
}

function renderToolState() {
  for (const button of document.querySelectorAll(".viewer-toolbar button[data-tool]")) {
    button.classList.toggle("active", button.dataset.tool === state.tool);
  }
  els.snapToggleBtn.classList.toggle("active", state.snap);
  els.safeGuidesBtn.classList.toggle("active", state.safeGuides);
  els.activeToolText.textContent = `${state.tool[0].toUpperCase()}${state.tool.slice(1)} tool`;
}

function renderAudioControls() {
  els.masterVolumeInput.value = state.audio.master;
  els.voiceVolumeInput.value = state.audio.voice;
  els.musicVolumeInput.value = state.audio.music;
  els.rubabVolumeInput.value = state.audio.rubab;
  els.soloRubabBtn.classList.toggle("active", state.audio.rubabSolo);
  els.soloRubabBtn.textContent = state.audio.rubabSolo ? "Rubab Solo On" : "Solo Rubab";
  els.audioPlayer.volume = state.audio.master / 100;
}

function renderMeters() {
  if (!state.project) return;
  const pulse = (Math.sin(state.currentTime * 2.7) + 1) / 2;
  const meters = [
    [els.masterMeter, state.audio.master, 0.88],
    [els.voiceMeter, state.audio.voice, 0.76],
    [els.musicMeter, state.audio.music, 0.62],
    [els.rubabMeter, state.audio.rubabSolo ? 100 : state.audio.rubab, 0.55],
  ];
  for (const [meter, value, weight] of meters) {
    meter.style.setProperty("--level", `${Math.round((value * (0.35 + pulse * weight)) / 100 * 100)}%`);
  }
  const lufs = -24 + Math.round((state.audio.master / 100) * 10 + pulse * 4);
  els.loudnessReadout.textContent = `${lufs} LUFS`;
  renderScopes(pulse);
}

function renderScopes(pulse = 0.5) {
  els.waveformScope.innerHTML = "";
  for (let i = 0; i < 22; i += 1) {
    const bar = document.createElement("i");
    const height = 22 + Math.abs(Math.sin(i * 0.8 + state.currentTime * 0.7)) * 58 * (0.5 + pulse);
    bar.style.height = `${Math.min(92, height)}%`;
    els.waveformScope.appendChild(bar);
  }
  els.vectorScope.style.setProperty("--scope-x", `${30 + pulse * 34}%`);
  els.vectorScope.style.setProperty("--scope-y", `${58 - pulse * 22}%`);
}

function renderKeyframes() {
  const scene = selectedScene();
  const rows = state.keyframes.filter((keyframe) => keyframe.sceneId === scene?.id).sort((a, b) => a.time - b.time);
  els.keyframeList.innerHTML = rows.length ? "" : "<p>No keyframes on this scene.</p>";
  for (const keyframe of rows) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "keyframe-row";
    row.textContent = `${fmt(keyframe.time)} · scale ${keyframe.composite.scale}% · opacity ${keyframe.composite.opacity}%`;
    row.addEventListener("click", () => setPlayhead(keyframe.time));
    els.keyframeList.appendChild(row);
  }
}

function renderExportState() {
  document.body.classList.toggle("exporting", state.exporting);
  els.exportVideoBtn.textContent = state.exporting ? "Exporting..." : "Export MP4";
}

function render() {
  applyLayoutState();
  renderScenes();
  renderPreview();
  renderLayerStack();
  renderTimeline();
  renderInspector();
  renderBaselineDock();
  renderTabs();
  renderToolState();
  renderAudioControls();
  renderAssets();
  renderUxNotes();
  renderStoryline();
  renderHandwritingControls();
  applyAccessibility();
  renderExportState();
  renderHud();
}

function updateSelected(patch) {
  const scene = ensureSceneDefaults(selectedScene());
  if (!scene) return;
  Object.assign(scene, patch);
  if ("titleHi" in patch || "titleEn" in patch) {
    scene.captions = `${scene.titleHi || ""}${scene.titleHi ? "\n" : ""}${scene.titleEn || ""}`;
  }
  setDirty();
  render();
}

function updateComposite(patch) {
  const scene = ensureSceneDefaults(selectedScene());
  if (!scene || state.layerLocked.video) return;
  Object.assign(scene.composite, patch);
  setDirty();
  renderPreview();
  renderTimeline();
  renderLayerStack();
  showHud("Composite adjusted");
}

function updateEffects(patch) {
  const scene = ensureSceneDefaults(selectedScene());
  if (!scene || state.layerLocked.vfx) return;
  Object.assign(scene.effects, patch);
  setDirty();
  renderPreview();
  renderTimeline();
  renderLayerStack();
  showHud("VFX adjusted");
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toTsv() {
  const rows = scenePayload();
  const headers = ["frame", "start", "end", "duration", "title_hi", "title_en", "frame_index", "rubab_overlay", "transition_type", "transition_duration", "image_path", "captions"];
  const body = rows.map((scene, index) => [
    index + 1,
    scene.start.toFixed(3),
    scene.end.toFixed(3),
    scene.duration.toFixed(3),
    scene.titleHi,
    scene.titleEn,
    scene.frameIndex || "",
    scene.rubabOverlay ? "yes" : "no",
    scene.transition?.type || "cut",
    Number(scene.transition?.duration || 0).toFixed(3),
    scene.imagePath,
    scene.captions.replace(/\n/g, " / "),
  ]);
  return [headers, ...body].map((row) => row.map((cell) => String(cell).replace(/\t/g, " ")).join("\t")).join("\n") + "\n";
}

function getProjectExportPayload() {
  const scenes = scenePayload();
  return {
    title: "Mahavisphot Advanced Compositor Cut",
    sourceTimeline: state.project.timeline || null,
    duration: Math.max(...scenes.map((scene) => scene.end)),
    audioPath: state.project.audio.path,
    rubabPath: state.project.rubab.path,
    scenes,
    markers: state.markers,
    keyframes: state.keyframes,
    audioMix: state.audio,
    accessibility: state.access,
    uxNotes: uxNotesPayload(),
    layers: {
      order: orderedLayerKeys(),
      visible: state.layerVisibility,
      locked: state.layerLocked,
    },
  };
}

function splitSceneAtPlayhead() {
  const scene = sceneAt(state.currentTime) || selectedScene();
  if (!scene || state.layerLocked.video) return;
  const splitAt = roundTime(state.currentTime);
  if (splitAt <= Number(scene.start) + MIN_SCENE_SECONDS || splitAt >= Number(scene.end) - MIN_SCENE_SECONDS) {
    setStatus("Move playhead inside a scene before splitting");
    showHud("Move playhead inside a scene");
    return;
  }
  const second = structuredClone(ensureSceneDefaults(scene));
  const originalEnd = Number(scene.end);
  scene.end = splitAt;
  second.id = nextSceneId();
  second.start = splitAt;
  second.end = originalEnd;
  second.titleEn = `${scene.titleEn || "Scene"} B`;
  second.titleHi = scene.titleHi || "";
  state.scenes.push(second);
  state.selectedId = second.id;
  setDirty();
  render();
  showHud("Scene split");
}

function setSelectedStartToPlayhead() {
  const scene = selectedScene();
  if (!scene || state.layerLocked.video) return;
  scene.start = roundTime(Math.min(state.currentTime, Number(scene.end) - MIN_SCENE_SECONDS));
  setDirty();
  render();
  showHud("Scene in point set");
}

function setSelectedEndToPlayhead() {
  const scene = selectedScene();
  if (!scene || state.layerLocked.video) return;
  scene.end = roundTime(Math.max(state.currentTime, Number(scene.start) + MIN_SCENE_SECONDS));
  setDirty();
  render();
  showHud("Scene out point set");
}

function rippleScenes() {
  if (state.layerLocked.video) return;
  let cursor = 0;
  for (const scene of sortedScenes()) {
    const duration = sceneLength(scene);
    scene.start = roundTime(cursor);
    scene.end = roundTime(cursor + duration);
    cursor = scene.end;
  }
  state.currentTime = clamp(state.currentTime, 0, projectDuration());
  setDirty();
  render();
  showHud("Timeline rippled");
}

function addMarker(label = "Marker", kind = "manual") {
  state.markers.push({
    id: `marker-${Date.now()}`,
    time: roundTime(state.currentTime),
    label,
    kind,
  });
  setDirty();
  renderTimeline();
  showHud(`${label} added`);
}

function addKeyframe() {
  const scene = ensureSceneDefaults(selectedScene());
  if (!scene) return;
  state.keyframes.push({
    id: `keyframe-${Date.now()}`,
    sceneId: scene.id,
    time: roundTime(state.currentTime),
    composite: structuredClone(scene.composite),
    effects: structuredClone(scene.effects),
  });
  setDirty();
  renderKeyframes();
  renderTimeline();
  showHud("Keyframe added");
}

function handleTimelineDrop(event) {
  event.preventDefault();
  for (const lane of [els.videoLayer, els.overlayLayer, els.vfxLayer, els.captionLayer]) {
    lane.classList.remove("drop-ready");
  }
  const payload = readDragPayload(event);
  if (!payload) return;
  const time = dropTimeFromEvent(event);
  const layerId = event.currentTarget?.id || "videoLayer";
  if (payload.type === "scene") {
    const scene = state.scenes.find((item) => item.id === payload.id);
    moveSceneTo(scene, time);
    render();
    showHud("Scene moved");
    return;
  }
  if (payload.type === "asset") {
    const scene = sceneAt(time) || selectedScene();
    applyDropToTimelineLayer(scene, payload, layerId);
    state.selectedId = scene.id;
    state.currentTime = Number(scene.start) || 0;
    render();
  }
}

function handlePreviewDrop(event) {
  event.preventDefault();
  els.previewStage.classList.remove("drop-ready");
  const payload = readDragPayload(event);
  if (!payload) return;
  if (payload.type === "asset") {
    applyAssetToScene(selectedScene(), payload);
    render();
    showHud("Viewer plate replaced");
  }
  if (payload.type === "scene") {
    state.selectedId = payload.id;
    const scene = selectedScene();
    state.currentTime = Number(scene?.start) || 0;
    render();
    showHud("Scene loaded in viewer");
  }
}

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function exportStoryboardPng() {
  const scenes = sortedScenes();
  const cols = 4;
  const rows = Math.ceil(scenes.length / cols);
  const cardW = 520;
  const imgH = 292;
  const labelH = 82;
  const margin = 48;
  const gap = 24;
  const headerH = 104;
  const width = margin * 2 + cols * cardW + (cols - 1) * gap;
  const height = headerH + margin + rows * (imgH + labelH) + (rows - 1) * gap;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#efe7d9";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#181817";
  ctx.font = "700 42px Arial";
  ctx.fillText("MAHAVISPHOT ADVANCED COMPOSITOR STORYBOARD", margin, 58);
  ctx.font = "18px Arial";
  ctx.fillStyle = "#665f55";
  ctx.fillText("Generated from current compositor timeline", margin, 88);

  for (let i = 0; i < scenes.length; i += 1) {
    const scene = scenes[i];
    const x = margin + (i % cols) * (cardW + gap);
    const y = headerH + Math.floor(i / cols) * (imgH + labelH + gap);
    ctx.fillStyle = "#111110";
    ctx.fillRect(x, y, cardW, imgH + labelH);
    const image = await loadCanvasImage(scene.image);
    const scale = Math.max(cardW / image.width, imgH / image.height);
    const sw = cardW / scale;
    const sh = imgH / scale;
    const sx = (image.width - sw) / 2;
    const sy = (image.height - sh) / 2;
    ctx.drawImage(image, sx, sy, sw, sh, x, y, cardW, imgH);
    ctx.fillStyle = "#f3eee4";
    ctx.font = "700 18px Arial";
    ctx.fillText(`${String(i + 1).padStart(2, "0")} ${scene.titleEn || "Untitled"}`, x + 14, y + imgH + 28);
    ctx.fillStyle = "#c7bbab";
    ctx.font = "15px Arial";
    ctx.fillText(`${fmt(scene.start)} - ${fmt(scene.end)}  ${scene.rubabOverlay ? "Rubab overlay" : ""}`, x + 14, y + imgH + 54);
  }

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mahavisphot_compositor_storyboard.png";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

async function exportVideo() {
  state.exporting = true;
  renderExportState();
  setStatus("Exporting MP4...");
  els.lastExportLink.hidden = true;
  try {
    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getProjectExportPayload()),
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || "Export failed");
    els.lastExportLink.href = result.video;
    els.lastExportLink.hidden = false;
    els.lastExportLink.textContent = "Open exported MP4";
    setStatus(`Exported ${result.exportName}`);
  } catch (error) {
    setStatus(`Export failed: ${error.message}`);
  } finally {
    state.exporting = false;
    renderExportState();
  }
}

function setWorkspaceMode(mode) {
  state.workspaceMode = mode;
  if (mode === "audio") state.activePanel = "audio";
  if (mode === "vfx") state.activePanel = "vfx";
  if (mode === "accessibility") state.activePanel = "accessibility";
  if (mode === "edit") state.activePanel = "inspector";
  setStatus(`${mode} workspace`);
  render();
  showHud(`${titleCase(mode)} workspace`);
}

function setPanel(panel) {
  state.activePanel = panel;
  renderInspector();
  if (panel === "notes") renderUxNotes();
  if (panel === "story") renderStoryline();
  showHud(`${titleCase(panel)} panel`);
}

function openStorylinePanel() {
  state.activePanel = "story";
  renderInspector();
  renderStoryline();
  showHud("Storyline in compositor");
}

function fitStorylineView() {
  state.activePanel = "story";
  fitTimelineView();
  renderStoryline();
  showHud("Story beats fit to timeline");
}

function setTool(tool) {
  state.tool = tool;
  setStatus(`${tool} tool`);
  if (tool === "marker") addMarker("Tool marker", "manual");
  if (tool === "note") {
    state.activePanel = "notes";
    renderInspector();
    els.uxNoteTextInput.focus();
  }
  renderToolState();
  showHud(`${titleCase(tool)} tool`);
}

function setTimelineMode(mode) {
  state.timelineMode = mode;
  if (mode === "audio") state.activePanel = "audio";
  if (mode === "vfx") state.activePanel = "vfx";
  if (mode === "captions") state.activePanel = "accessibility";
  setStatus(`${mode} timeline mode`);
  render();
  showHud(`${titleCase(mode)} timeline`);
}

function setTimelineLayout(layout) {
  state.timelineLayout = layout;
  if (layout === "compact") state.timelineVerticalZoom = Math.min(state.timelineVerticalZoom, 1.05);
  if (layout === "expanded") state.timelineVerticalZoom = Math.max(state.timelineVerticalZoom, 1.15);
  if (layout === "filmstrip") state.timelineMode = "video";
  setStatus(`${layout} timeline layout`);
  render();
  showHud(`${titleCase(layout)} timeline layout`);
}

function resetTimelineView() {
  state.timelineZoom = 5;
  state.timelineVerticalZoom = 1;
  state.timelineMode = "all";
  state.timelineLayout = "stacked";
  state.pinchAxis = "both";
  setStatus("Timeline view reset");
  render();
  showHud("Timeline view reset");
}

function commandActions() {
  return [
    { label: "Play or pause", shortcut: "Space", run: togglePlayback },
    { label: "Split scene at playhead", shortcut: "B", run: splitSceneAtPlayhead },
    { label: "Add marker", shortcut: "M", run: () => addMarker("Command marker", "manual") },
    { label: "Add or cycle transition", shortcut: "T", run: cycleTransition },
    { label: "Nudge selected clip left", shortcut: "-1f", run: () => nudgeSelectedScene(-1) },
    { label: "Nudge selected clip right", shortcut: "+1f", run: () => nudgeSelectedScene(1) },
    { label: "Center selected clip", shortcut: "Zoom Sel", run: fitSelectedClip },
    { label: "Add keyframe", shortcut: "K", run: addKeyframe },
    { label: "Open VFX panel", run: () => setWorkspaceMode("vfx") },
    { label: "Open audio mixer", run: () => setWorkspaceMode("audio") },
    { label: "Open accessibility panel", run: () => setWorkspaceMode("accessibility") },
    { label: "Show reconstructed storyline", shortcut: "Story", run: openStorylinePanel },
    { label: "Open feature matrix", shortcut: "Matrix", run: () => setPanel("matrix") },
    { label: "Open baseline inspector fields", shortcut: "Inspect", run: () => setPanel("inspector") },
    { label: "Open UX notes", run: openUxNotesTool },
    { label: "Add UX note", shortcut: "Note tool", run: addUxNote },
    { label: "Load first generated timeline", shortcut: "Gen 1", run: () => loadFirstGeneratedTimeline() },
    { label: "Load prior boards 137-shot timeline", shortcut: "137 shots", run: () => loadDenseShotTimeline() },
    { label: "Toggle captions", run: () => updateAccess({ captions: !state.access.captions }) },
    { label: "Toggle high contrast", run: () => updateAccess({ highContrast: !state.access.highContrast }) },
    { label: "Ripple timeline", run: rippleScenes },
    { label: "Timeline mode all", run: () => setTimelineMode("all") },
    { label: "Timeline mode video", run: () => setTimelineMode("video") },
    { label: "Timeline mode audio", run: () => setTimelineMode("audio") },
    { label: "Timeline layout compact", run: () => setTimelineLayout("compact") },
    { label: "Timeline layout expanded", run: () => setTimelineLayout("expanded") },
    { label: "Fit timeline", run: fitTimelineView },
    { label: "Timeline zoom reset", shortcut: "Fit", run: resetTimelineView },
    { label: "Reset panel layout", run: resetLayout },
    { label: "Export MP4", shortcut: "Ctrl+Shift+E", run: exportVideo },
  ];
}

function openCommandPalette() {
  els.commandPalette.hidden = false;
  els.commandInput.value = "";
  renderCommandList();
  els.commandInput.focus();
}

function closeCommandPalette() {
  els.commandPalette.hidden = true;
}

function renderCommandList() {
  const query = els.commandInput.value.trim().toLowerCase();
  els.commandList.innerHTML = "";
  for (const action of commandActions().filter((item) => !query || item.label.toLowerCase().includes(query))) {
    const button = document.createElement("button");
    const label = document.createElement("span");
    const shortcut = document.createElement("span");
    button.type = "button";
    label.textContent = action.label;
    shortcut.className = "command-shortcut";
    shortcut.textContent = action.shortcut || "";
    button.append(label, shortcut);
    button.addEventListener("click", () => {
      closeCommandPalette();
      action.run();
    });
    els.commandList.appendChild(button);
  }
}

function updateAccess(patch) {
  Object.assign(state.access, patch);
  state.layerVisibility.captions = state.access.captions;
  setDirty();
  applyAccessibility();
  renderPreview();
  renderLayerStack();
  renderTimeline();
  showHud("Accessibility updated");
}

function resetAccess() {
  Object.assign(state.access, {
    captions: true,
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    dyslexia: false,
    focusMode: false,
    colorMode: "none",
    density: "comfortable",
  });
  setDirty();
  render();
  showHud("Accessibility reset");
}

function handleTimelineWheel(event) {
  const shouldZoom = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
  if (!shouldZoom) return;
  event.preventDefault();
  let axis = state.pinchAxis;
  if (event.altKey && !(event.ctrlKey || event.metaKey)) axis = "vertical";
  if (event.shiftKey && !(event.ctrlKey || event.metaKey)) axis = "horizontal";
  const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  const factor = delta < 0 ? 1.08 : 0.925;
  applyTimelineZoomFactor(factor, axis, event.clientX);
}

function touchDistance(points) {
  if (points.length < 2) return 0;
  const [a, b] = points;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function touchCenterX(points) {
  if (points.length < 2) return null;
  return (points[0].clientX + points[1].clientX) / 2;
}

function handleTimelinePointerDown(event) {
  if (event.pointerType !== "touch") return;
  state.pinchGesture.pointers.set(event.pointerId, {
    clientX: event.clientX,
    clientY: event.clientY,
  });
  if (state.pinchGesture.pointers.size === 2) {
    state.pinchGesture.lastDistance = touchDistance([...state.pinchGesture.pointers.values()]);
  }
}

function handleTimelinePointerMove(event) {
  if (event.pointerType !== "touch" || !state.pinchGesture.pointers.has(event.pointerId)) return;
  state.pinchGesture.pointers.set(event.pointerId, {
    clientX: event.clientX,
    clientY: event.clientY,
  });
  const points = [...state.pinchGesture.pointers.values()];
  if (points.length !== 2) return;
  event.preventDefault();
  const nextDistance = touchDistance(points);
  const lastDistance = state.pinchGesture.lastDistance || nextDistance;
  if (lastDistance > 0 && nextDistance > 0) {
    applyTimelineZoomFactor(clamp(nextDistance / lastDistance, 0.88, 1.14), state.pinchAxis, touchCenterX(points));
  }
  state.pinchGesture.lastDistance = nextDistance;
}

function handleTimelinePointerEnd(event) {
  if (event.pointerType !== "touch") return;
  state.pinchGesture.pointers.delete(event.pointerId);
  if (state.pinchGesture.pointers.size < 2) state.pinchGesture.lastDistance = 0;
}

function handleGestureStart(event) {
  event.preventDefault();
  state.pinchGesture.lastScale = event.scale || 1;
}

function handleGestureChange(event) {
  event.preventDefault();
  const previous = state.pinchGesture.lastScale || 1;
  const next = event.scale || previous;
  if (previous > 0 && next > 0) {
    applyTimelineZoomFactor(clamp(next / previous, 0.88, 1.14), state.pinchAxis, event.clientX);
  }
  state.pinchGesture.lastScale = next;
}

function isTypingTarget(target) {
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName);
}

function bindEvents() {
  els.resetLayoutBtn.addEventListener("click", resetLayout);
  els.baselineInspectBtn.addEventListener("click", () => setPanel("inspector"));
  els.matrixInspectBtn.addEventListener("click", () => setPanel("inspector"));
  els.baselineResetBtn.addEventListener("click", resetLayout);
  els.baselineCommandsBtn.addEventListener("click", openCommandPalette);
  els.baselineTsvBtn.addEventListener("click", () => els.downloadTsvBtn.click());
  els.baselineBoardBtn.addEventListener("click", () => els.downloadBoardBtn.click());
  els.leftPanelResizer.addEventListener("pointerdown", (event) => beginLayoutResize("left", event));
  els.rightPanelResizer.addEventListener("pointerdown", (event) => beginLayoutResize("right", event));
  els.timelineSplitResizer.addEventListener("pointerdown", (event) => beginLayoutResize("split", event));
  els.leftPanelResizer.addEventListener("keydown", (event) => handleLayoutResizerKey("left", event));
  els.rightPanelResizer.addEventListener("keydown", (event) => handleLayoutResizerKey("right", event));
  els.timelineSplitResizer.addEventListener("keydown", (event) => handleLayoutResizerKey("split", event));
  els.leftPanelResizer.addEventListener("dblclick", resetLayout);
  els.rightPanelResizer.addEventListener("dblclick", resetLayout);
  els.timelineSplitResizer.addEventListener("dblclick", resetLayout);
  window.addEventListener("resize", () => applyLayoutState({ rerenderTimeline: true }));
  els.previewStage.addEventListener("pointerenter", () => showHud("Viewer HUD", { announce: false }));
  els.previewStage.addEventListener("focus", () => showHud("Viewer focused", { announce: false }));
  els.timelineViewport.addEventListener("pointerenter", () => showHud("Timeline HUD", { announce: false }));
  els.timelineViewport.addEventListener("focus", () => showHud("Timeline focused", { announce: false }));
  els.timelineViewport.addEventListener("scroll", () => renderHud());

  els.playPauseBtn.addEventListener("click", togglePlayback);
  els.jumpBackBtn.addEventListener("click", () => {
    setPlayhead(state.currentTime - 5);
    showHud("Jumped back");
  });
  els.jumpForwardBtn.addEventListener("click", () => {
    setPlayhead(state.currentTime + 5);
    showHud("Jumped forward");
  });
  els.frameBackBtn.addEventListener("click", () => {
    setPlayhead(state.currentTime - 1 / FPS);
    showHud("Previous frame");
  });
  els.frameForwardBtn.addEventListener("click", () => {
    setPlayhead(state.currentTime + 1 / FPS);
    showHud("Next frame");
  });
  els.jogSlider.addEventListener("input", () => {
    setPlayhead(Number(els.jogSlider.value));
    showHud("Jogging timeline");
  });
  els.zoomInput.addEventListener("input", () => {
    setTimelineHorizontalZoom(Number(els.zoomInput.value));
  });
  els.hZoomOutBtn.addEventListener("click", () => setTimelineHorizontalZoom(state.timelineZoom - 1));
  els.hZoomInBtn.addEventListener("click", () => setTimelineHorizontalZoom(state.timelineZoom + 1));
  els.fitTimelineBtn.addEventListener("click", fitTimelineView);
  els.verticalZoomInput.addEventListener("input", () => {
    setTimelineVerticalZoom(Number(els.verticalZoomInput.value));
  });
  els.vZoomOutBtn.addEventListener("click", () => setTimelineVerticalZoom(state.timelineVerticalZoom - 0.1));
  els.vZoomInBtn.addEventListener("click", () => setTimelineVerticalZoom(state.timelineVerticalZoom + 0.1));
  els.timelineModeTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-timeline-mode]");
    if (button) setTimelineMode(button.dataset.timelineMode);
  });
  els.timelineViewOptions.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-timeline-option]");
    if (!button) return;
    const key = button.dataset.timelineOption;
    state.timelineOptions[key] = !state.timelineOptions[key];
    renderTimeline();
    showHud(`${button.textContent.trim()} ${state.timelineOptions[key] ? "on" : "off"}`);
  });
  els.timelineLayoutInput.addEventListener("change", () => setTimelineLayout(els.timelineLayoutInput.value));
  els.pinchAxisInput.addEventListener("change", () => {
    state.pinchAxis = els.pinchAxisInput.value;
    setStatus(`Pinch zoom axis: ${state.pinchAxis}`);
    renderTimeline();
    showHud(`Pinch ${state.pinchAxis}`);
  });
  els.splitSceneBtn.addEventListener("click", splitSceneAtPlayhead);
  els.setStartBtn.addEventListener("click", setSelectedStartToPlayhead);
  els.setEndBtn.addEventListener("click", setSelectedEndToPlayhead);
  els.addMarkerBtn.addEventListener("click", () => addMarker("Manual marker", "manual"));
  els.addTransitionBtn.addEventListener("click", cycleTransition);
  els.nudgeLeftBtn.addEventListener("click", () => nudgeSelectedScene(-1));
  els.nudgeRightBtn.addEventListener("click", () => nudgeSelectedScene(1));
  els.rippleBtn.addEventListener("click", rippleScenes);
  els.fitSelectionBtn.addEventListener("click", fitSelectedClip);

  els.workspaceModeTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]");
    if (button) setWorkspaceMode(button.dataset.mode);
  });
  els.panelTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-panel]");
    if (button) setPanel(button.dataset.panel);
  });
  document.querySelector(".viewer-toolbar").addEventListener("click", (event) => {
    const toolButton = event.target.closest("button[data-tool]");
    if (toolButton) setTool(toolButton.dataset.tool);
  });
  els.snapToggleBtn.addEventListener("click", () => {
    state.snap = !state.snap;
    setDirty();
    renderToolState();
    showHud(`Snap ${state.snap ? "on" : "off"}`);
  });
  els.safeGuidesBtn.addEventListener("click", () => {
    state.safeGuides = !state.safeGuides;
    setDirty();
    renderPreview();
    renderToolState();
    showHud(`Guides ${state.safeGuides ? "on" : "off"}`);
  });

  els.timelineRuler.addEventListener("click", (event) => {
    setPlayhead(dropTimeFromEvent(event));
    showHud("Playhead moved");
  });
  els.timelineViewport.addEventListener("wheel", handleTimelineWheel, { passive: false });
  els.timelineViewport.addEventListener("scroll", () => renderTimelineMinimap());
  els.timelineMiniMap.addEventListener("click", jumpTimelineFromMinimap);
  els.timelineMiniMap.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPlayhead(state.currentTime - 5);
      renderTimelineMinimap();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPlayhead(state.currentTime + 5);
      renderTimelineMinimap();
    }
  });
  els.timelineViewport.addEventListener("pointerdown", handleTimelinePointerDown);
  els.timelineViewport.addEventListener("pointermove", handleTimelinePointerMove, { passive: false });
  els.timelineViewport.addEventListener("pointerup", handleTimelinePointerEnd);
  els.timelineViewport.addEventListener("pointercancel", handleTimelinePointerEnd);
  els.timelineViewport.addEventListener("gesturestart", handleGestureStart, { passive: false });
  els.timelineViewport.addEventListener("gesturechange", handleGestureChange, { passive: false });
  for (const lane of [els.videoLayer, els.overlayLayer, els.vfxLayer, els.captionLayer]) {
    lane.addEventListener("dragover", (event) => {
      event.preventDefault();
      lane.classList.add("drop-ready");
    });
    lane.addEventListener("dragleave", () => lane.classList.remove("drop-ready"));
    lane.addEventListener("drop", handleTimelineDrop);
  }
  els.layerStack.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  els.layerStack.addEventListener("drop", (event) => {
    const payload = readDragPayload(event);
    if (payload?.type === "layer") moveLayerToEnd(payload.key);
  });
  els.previewStage.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.previewStage.classList.add("drop-ready");
  });
  els.previewStage.addEventListener("dragleave", () => els.previewStage.classList.remove("drop-ready"));
  els.previewStage.addEventListener("drop", handlePreviewDrop);

  els.titleEnInput.addEventListener("change", () => updateSelected({ titleEn: els.titleEnInput.value }));
  els.titleHiInput.addEventListener("change", () => updateSelected({ titleHi: els.titleHiInput.value }));
  els.startInput.addEventListener("change", () => updateSelected({ start: Number(els.startInput.value) }));
  els.endInput.addEventListener("change", () => updateSelected({ end: Number(els.endInput.value) }));
  els.rubabInput.addEventListener("change", () => updateSelected({ rubabOverlay: els.rubabInput.checked }));
  els.noteInput.addEventListener("change", () => updateSelected({ note: els.noteInput.value }));

  els.transformXInput.addEventListener("input", () => updateComposite({ x: Number(els.transformXInput.value) }));
  els.transformYInput.addEventListener("input", () => updateComposite({ y: Number(els.transformYInput.value) }));
  els.scaleInput.addEventListener("input", () => updateComposite({ scale: Number(els.scaleInput.value) }));
  els.rotationInput.addEventListener("input", () => updateComposite({ rotation: Number(els.rotationInput.value) }));
  els.opacityInput.addEventListener("input", () => updateComposite({ opacity: Number(els.opacityInput.value) }));
  els.blendModeInput.addEventListener("change", () => updateComposite({ blendMode: els.blendModeInput.value }));
  els.grainInput.addEventListener("change", () => updateEffects({ grain: els.grainInput.checked }));
  els.vignetteInput.addEventListener("change", () => updateEffects({ vignette: els.vignetteInput.checked }));
  els.dustInput.addEventListener("change", () => updateEffects({ dust: els.dustInput.checked }));
  els.sonicInput.addEventListener("change", () => updateEffects({ sonic: els.sonicInput.checked }));
  els.addKeyframeBtn.addEventListener("click", addKeyframe);

  for (const [input, key] of [
    [els.masterVolumeInput, "master"],
    [els.voiceVolumeInput, "voice"],
    [els.musicVolumeInput, "music"],
    [els.rubabVolumeInput, "rubab"],
  ]) {
    input.addEventListener("input", () => {
      state.audio[key] = Number(input.value);
      setDirty();
      renderAudioControls();
      renderPreview();
      renderMeters();
      showHud(`${titleCase(key)} volume ${state.audio[key]}%`);
    });
  }
  els.soloRubabBtn.addEventListener("click", () => {
    state.audio.rubabSolo = !state.audio.rubabSolo;
    setDirty();
    renderAudioControls();
    renderPreview();
    renderMeters();
    showHud(state.audio.rubabSolo ? "Rubab solo on" : "Rubab solo off");
  });

  els.captionsInput.addEventListener("change", () => updateAccess({ captions: els.captionsInput.checked }));
  els.highContrastInput.addEventListener("change", () => updateAccess({ highContrast: els.highContrastInput.checked }));
  els.largeTextInput.addEventListener("change", () => updateAccess({ largeText: els.largeTextInput.checked }));
  els.reduceMotionInput.addEventListener("change", () => updateAccess({ reduceMotion: els.reduceMotionInput.checked }));
  els.dyslexiaInput.addEventListener("change", () => updateAccess({ dyslexia: els.dyslexiaInput.checked }));
  els.focusModeInput.addEventListener("change", () => updateAccess({ focusMode: els.focusModeInput.checked }));
  els.colorModeInput.addEventListener("change", () => updateAccess({ colorMode: els.colorModeInput.value }));
  els.densityInput.addEventListener("change", () => updateAccess({ density: els.densityInput.value }));
  els.resetAccessBtn.addEventListener("click", resetAccess);

  els.assetTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-tab]");
    if (!button) return;
    state.assetTab = button.dataset.tab;
    renderTabs();
    renderAssets();
    showHud(`${titleCase(state.assetTab.replace(/_/g, " "))} assets`);
  });

  els.assetSearch.addEventListener("input", () => {
    state.assetQuery = els.assetSearch.value;
    renderAssets();
  });

  els.addUxNoteBtn.addEventListener("click", addUxNote);
  els.handwritingLayoutTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-handwriting-layout]");
    if (!button) return;
    setHandwritingLayout(button.dataset.handwritingLayout);
  });
  els.handwritingToolTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-handwriting-tool]");
    if (!button) return;
    setHandwritingTool(button.dataset.handwritingTool);
  });
  els.handwritingColorTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-ink-color]");
    if (!button) return;
    setHandwritingColor(button.dataset.inkColor);
  });
  els.handwritingSizeInput.addEventListener("input", () => {
    state.handwriting.size = Number(els.handwritingSizeInput.value);
    renderHandwritingControls();
  });
  els.clearHandwritingBtn.addEventListener("click", () => clearHandwriting());
  els.attachSketchBtn.addEventListener("click", attachHandwritingNote);
  els.handwritingCanvas.addEventListener("pointerdown", beginHandwriting);
  els.handwritingCanvas.addEventListener("pointermove", moveHandwriting);
  els.handwritingCanvas.addEventListener("pointerup", endHandwriting);
  els.handwritingCanvas.addEventListener("pointercancel", endHandwriting);
  els.handwritingCanvas.addEventListener("pointerleave", endHandwriting);
  els.uxNoteFilterInput.addEventListener("change", () => {
    state.uxNoteFilter = els.uxNoteFilterInput.value;
    renderUxNotes();
    showHud(`${titleCase(state.uxNoteFilter)} UX notes`);
  });
  els.exportUxNotesBtn.addEventListener("click", () => {
    downloadBlob("mahavisphot_ux_enhancement_notes.md", toUxNotesMarkdown(), "text/markdown");
    showHud("UX notes exported");
  });
  els.clearDoneUxNotesBtn.addEventListener("click", clearDoneUxNotes);

  els.duplicateSceneBtn.addEventListener("click", () => {
    const scene = ensureSceneDefaults(selectedScene());
    if (!scene) return;
    const copy = structuredClone(scene);
    const duration = Number(copy.end) - Number(copy.start);
    copy.id = nextSceneId();
    copy.start = Number(scene.end);
    copy.end = Number(scene.end) + duration;
    copy.titleEn = `${copy.titleEn} Copy`;
    state.scenes.push(copy);
    state.selectedId = copy.id;
      setDirty();
      render();
      showHud("Scene duplicated");
  });

  els.deleteSceneBtn.addEventListener("click", () => {
    if (state.scenes.length <= 1) return;
    state.scenes = state.scenes.filter((scene) => scene.id !== state.selectedId);
    state.selectedId = sortedScenes()[0].id;
    setDirty();
    render();
    showHud("Scene deleted");
  });

  els.commandPaletteBtn.addEventListener("click", openCommandPalette);
  els.commandInput.addEventListener("input", renderCommandList);
  els.commandPalette.addEventListener("click", (event) => {
    if (event.target === els.commandPalette) closeCommandPalette();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.commandPalette.hidden) {
      closeCommandPalette();
      return;
    }
    if (isTypingTarget(event.target)) return;
    if (event.key === "/") {
      event.preventDefault();
      openCommandPalette();
    }
    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
    }
    if (event.key === "ArrowLeft") {
      setPlayhead(state.currentTime - 1 / FPS);
      showHud("Previous frame");
    }
    if (event.key === "ArrowRight") {
      setPlayhead(state.currentTime + 1 / FPS);
      showHud("Next frame");
    }
    if (event.key === "=" || event.key === "+") setTimelineHorizontalZoom(state.timelineZoom + 1);
    if (event.key === "-") setTimelineHorizontalZoom(state.timelineZoom - 1);
    if (event.key === "_" && event.shiftKey) setTimelineVerticalZoom(state.timelineVerticalZoom - 0.1);
    if (event.key === "+" && event.shiftKey) setTimelineVerticalZoom(state.timelineVerticalZoom + 0.1);
    if (event.key.toLowerCase() === "b") setTool("blade");
    if (event.key.toLowerCase() === "t") cycleTransition();
    if (event.key.toLowerCase() === "v") setTool("select");
    if (event.key.toLowerCase() === "m") addMarker("Keyboard marker", "manual");
    if (event.key.toLowerCase() === "n") openUxNotesTool();
  });

  els.downloadJsonBtn.addEventListener("click", () => {
    downloadBlob("mahavisphot_compositor_project.json", JSON.stringify(getProjectExportPayload(), null, 2), "application/json");
  });
  els.downloadTsvBtn.addEventListener("click", () => {
    downloadBlob("mahavisphot_compositor_timeline.tsv", toTsv(), "text/tab-separated-values");
  });
  els.downloadBoardBtn.addEventListener("click", exportStoryboardPng);
  els.exportVideoBtn.addEventListener("click", exportVideo);
  els.loadGeneratedTimelineBtn.addEventListener("click", () => loadFirstGeneratedTimeline());
  els.loadDenseTimelineBtn.addEventListener("click", () => loadDenseShotTimeline());
  els.openStorylineBtn.addEventListener("click", openStorylinePanel);
  els.fitStorylineBtn.addEventListener("click", fitStorylineView);
}

function seedMarkers() {
  const seeded = [];
  for (const scene of sortedScenes()) {
    seeded.push({
      id: `scene-${scene.id}`,
      time: Number(scene.start),
      label: String(scene.id).padStart(2, "0"),
      kind: scene.rubabOverlay ? "rubab" : "scene",
    });
  }
  state.markers = seeded;
}

function applyProject(project, statusText = "Loaded") {
  state.project = project;
  state.scenes = state.project.scenes.map((scene) => ensureSceneDefaults({ ...scene }));
  state.selectedId = state.scenes[0]?.id || null;
  state.currentTime = Number(state.scenes[0]?.start) || 0;
  state.playing = false;
  if (state.playTimer) cancelAnimationFrame(state.playTimer);
  state.playTimer = null;
  state.timelineZoom = Number(els.zoomInput.value) || state.timelineZoom;
  state.timelineVerticalZoom = Number(els.verticalZoomInput.value) || state.timelineVerticalZoom;
  state.timelineLayout = els.timelineLayoutInput.value || state.timelineLayout;
  state.pinchAxis = els.pinchAxisInput.value || state.pinchAxis;
  els.audioPlayer.pause();
  els.audioPlayer.src = state.project.audio.url;
  els.jogSlider.max = String(projectDuration());
  seedMarkers();
  setStatus(statusText);
  render();
}

async function loadProjectFromTimeline(timelineId = "first-generated", options = {}) {
  const response = await fetch(`/api/project?timeline=${encodeURIComponent(timelineId)}`);
  const project = await response.json();
  if (!response.ok || project.ok === false) {
    throw new Error(project.error || "Timeline load failed");
  }
  const timelineName = project.timeline?.name || "generated timeline";
  applyProject(project, options.statusText || `Loaded ${timelineName}`);
  if (options.hud !== false) showHud(`${timelineName} loaded`);
}

async function loadStoryline() {
  try {
    const response = await fetch("/reconstructed_storyline.json");
    const data = await response.json();
    if (!response.ok || !data.beats) throw new Error(data.error || "Storyline load failed");
    state.storyline = normalizeStoryline(data);
  } catch (error) {
    state.storyline = {
      logline: "",
      beats: [],
      error: error.message || String(error),
    };
  }
}

async function loadFirstGeneratedTimeline() {
  try {
    await loadProjectFromTimeline("first-generated", {
      statusText: "Loaded first generated timeline",
    });
  } catch (error) {
    setStatus(`Timeline load failed: ${error.message}`);
    showHud("Timeline load failed");
  }
}

async function loadDenseShotTimeline() {
  try {
    await loadProjectFromTimeline("prior-board-137-shots", {
      statusText: "Loaded prior boards 137-shot sequence",
    });
    state.timelineMode = "video";
    state.timelineLayout = "filmstrip";
    state.timelineZoom = 6;
    state.timelineVerticalZoom = 0.9;
    state.activePanel = "story";
    render();
    showHud("137-shot board timeline loaded");
  } catch (error) {
    setStatus(`Dense timeline load failed: ${error.message}`);
    showHud("Dense timeline load failed");
  }
}

async function init() {
  bindEvents();
  loadLayoutState();
  loadUxNotes();
  clearHandwriting(false);
  await loadStoryline();
  await loadProjectFromTimeline("first-generated", { statusText: "Loaded first generated timeline", hud: false });
}

init().catch((error) => {
  setStatus(`Load failed: ${error.message}`);
});
