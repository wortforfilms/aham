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
  auth: {
    user: null,
    subscription: null,
    license: null,
    projects: [],
    selectedProjectId: null,
    message: "",
    projectMessage: "",
  },
  markers: [],
  keyframes: [],
  dynamicTracks: [],
  nextDynamicTrackId: 1,
  compositions: [],
  nextCompositionId: 1,
  activeCompositionId: null,
  selectedCompositionId: null,
  selectedClipRefs: [],
  selectedTrackId: null,
  editPolicy: {
    duplicateMode: "smart",
    deleteMode: "ripple",
  },
  duplicateDecisions: [],
  markerPointerDrag: null,
  spatial: {
    enabled: false,
    shading: "material",
    activeNode: "actor",
    transformMode: "translate",
    mesh: "actor",
    x: 0,
    y: 0,
    z: -54,
    focal: 35,
    particlePreset: "ash",
    particleWindX: 18,
    particleWindY: -12,
    particleTurbulence: 62,
    particleLifetime: 68,
    particleDrag: 32,
    trackingConfidence: 72,
    trackingDepth: 8,
    faceYaw: 0,
    facePitch: -4,
    faceBlend: 58,
    textureSeam: 64,
    textureNormal: 48,
    textureRoughness: 42,
    fps: 60,
    runtime: "Canvas WebGL fallback",
    animationId: null,
    lastFrameTime: 0,
  },
  floatingPanels: {
    sceneGraph: { open: true, x: 18, y: 50, w: 292, h: 318 },
    particles: { open: true, x: 612, y: 170, w: 396, h: 350 },
    nodeGraph: { open: true, x: 228, y: 524, w: 560, h: 300 },
  },
  floatingPanelZ: {
    sceneGraph: 1,
    particles: 2,
    nodeGraph: 3,
    next: 4,
  },
  floatingPanelInteraction: null,
  layerOrder: ["vfx", "captions", "particles", "tracking", "three", "rubab", "video", "audio"],
  draggingLayerKey: null,
  layerPointerDrag: null,
  timelineResize: null,
  layerVisibility: {
    vfx: true,
    captions: true,
    particles: true,
    tracking: true,
    three: true,
    rubab: true,
    video: true,
    audio: true,
  },
  layerLocked: {
    vfx: false,
    captions: false,
    particles: false,
    tracking: false,
    three: false,
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
  accountStatus: document.getElementById("accountStatus"),
  authOpenBtn: document.getElementById("authOpenBtn"),
  planPanelTopBtn: document.getElementById("planPanelTopBtn"),
  projectPanelTopBtn: document.getElementById("projectPanelTopBtn"),
  saveProjectTopBtn: document.getElementById("saveProjectTopBtn"),
  leftPanelResizer: document.getElementById("leftPanelResizer"),
  rightPanelResizer: document.getElementById("rightPanelResizer"),
  timelineSplitResizer: document.getElementById("timelineSplitResizer"),
  sceneList: document.getElementById("sceneList"),
  layerStack: document.getElementById("layerStack"),
  addVideoLayerBtn: document.getElementById("addVideoLayerBtn"),
  addAudioLayerBtn: document.getElementById("addAudioLayerBtn"),
  renameLayerBtn: document.getElementById("renameLayerBtn"),
  duplicateLayerBtn: document.getElementById("duplicateLayerBtn"),
  deleteLayerBtn: document.getElementById("deleteLayerBtn"),
  compositionStack: document.getElementById("compositionStack"),
  openCompositionBtn: document.getElementById("openCompositionBtn"),
  spatialGraph: document.getElementById("spatialGraph"),
  spatialGraphStatus: document.getElementById("spatialGraphStatus"),
  activeToolText: document.getElementById("activeToolText"),
  workspaceModeTabs: document.getElementById("workspaceModeTabs"),
  panelTabs: document.getElementById("panelTabs"),
  rightScroll: document.querySelector(".right-scroll"),
  accountSummary: document.getElementById("accountSummary"),
  planSummary: document.getElementById("planSummary"),
  planGateStatus: document.getElementById("planGateStatus"),
  authForm: document.getElementById("authForm"),
  authNameInput: document.getElementById("authNameInput"),
  authEmailInput: document.getElementById("authEmailInput"),
  authPasswordInput: document.getElementById("authPasswordInput"),
  loginBtn: document.getElementById("loginBtn"),
  registerBtn: document.getElementById("registerBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  subscriptionPlanGrid: document.getElementById("subscriptionPlanGrid"),
  authMessage: document.getElementById("authMessage"),
  refreshProjectsBtn: document.getElementById("refreshProjectsBtn"),
  projectNameInput: document.getElementById("projectNameInput"),
  saveProjectBtn: document.getElementById("saveProjectBtn"),
  updateProjectBtn: document.getElementById("updateProjectBtn"),
  projectMessage: document.getElementById("projectMessage"),
  projectList: document.getElementById("projectList"),
  floatingPanelsLayer: document.getElementById("floatingPanelsLayer"),
  floatingSceneGraph: document.getElementById("floatingSceneGraph"),
  floatingParticles: document.getElementById("floatingParticles"),
  floatingNodeGraph: document.getElementById("floatingNodeGraph"),
  floatingSceneGraphContent: document.getElementById("floatingSceneGraphContent"),
  floatingParticlesContent: document.getElementById("floatingParticlesContent"),
  floatingNodeGraphContent: document.getElementById("floatingNodeGraphContent"),
  previewStage: document.getElementById("previewStage"),
  previewImage: document.getElementById("previewImage"),
  rubabOverlay: document.getElementById("rubabOverlay"),
  spatialViewport: document.getElementById("spatialViewport"),
  spatialFallback: document.getElementById("spatialFallback"),
  trackingOverlay: document.getElementById("trackingOverlay"),
  particleTrackingOverlay: document.getElementById("particleTrackingOverlay"),
  axisWidget: document.getElementById("axisWidget"),
  spatialGizmo: document.getElementById("spatialGizmo"),
  faceTopology: document.getElementById("faceTopology"),
  spatialToolbar: document.getElementById("spatialToolbar"),
  spatialFps: document.getElementById("spatialFps"),
  spatialGpu: document.getElementById("spatialGpu"),
  spatialSolver: document.getElementById("spatialSolver"),
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
  makeCompositionBtn: document.getElementById("makeCompositionBtn"),
  makeCompositionPanelBtn: document.getElementById("makeCompositionPanelBtn"),
  backToMasterBtn: document.getElementById("backToMasterBtn"),
  deleteModeInput: document.getElementById("deleteModeInput"),
  deleteSelectedBtn: document.getElementById("deleteSelectedBtn"),
  duplicatePolicyInput: document.getElementById("duplicatePolicyInput"),
  applyDuplicatePolicyBtn: document.getElementById("applyDuplicatePolicyBtn"),
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
  compositionLayer: document.getElementById("compositionLayer"),
  videoLayer: document.getElementById("videoLayer"),
  overlayLayer: document.getElementById("overlayLayer"),
  vfxLayer: document.getElementById("vfxLayer"),
  threeLayer: document.getElementById("threeLayer"),
  trackingLayer: document.getElementById("trackingLayer"),
  particlesLayer: document.getElementById("particlesLayer"),
  captionLayer: document.getElementById("captionLayer"),
  audioLayer: document.getElementById("audioLayer"),
  dynamicTrackRows: document.getElementById("dynamicTrackRows"),
  trackCreateRow: document.getElementById("trackCreateRow"),
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
  spatialFocusBtn: document.getElementById("spatialFocusBtn"),
  spatialTransformInput: document.getElementById("spatialTransformInput"),
  spatialMeshInput: document.getElementById("spatialMeshInput"),
  spatialXInput: document.getElementById("spatialXInput"),
  spatialYInput: document.getElementById("spatialYInput"),
  spatialZInput: document.getElementById("spatialZInput"),
  spatialFocalInput: document.getElementById("spatialFocalInput"),
  particlePresetGrid: document.getElementById("particlePresetGrid"),
  particleApplyBtn: document.getElementById("particleApplyBtn"),
  particleWindXInput: document.getElementById("particleWindXInput"),
  particleWindYInput: document.getElementById("particleWindYInput"),
  particleTurbulenceInput: document.getElementById("particleTurbulenceInput"),
  particleLifetimeInput: document.getElementById("particleLifetimeInput"),
  particleDragInput: document.getElementById("particleDragInput"),
  trackingPreviewBtn: document.getElementById("trackingPreviewBtn"),
  trackingRigStatus: document.getElementById("trackingRigStatus"),
  trackingMatrixStatus: document.getElementById("trackingMatrixStatus"),
  trackingConfidenceInput: document.getElementById("trackingConfidenceInput"),
  trackingDepthInput: document.getElementById("trackingDepthInput"),
  facePreviewBtn: document.getElementById("facePreviewBtn"),
  faceYawInput: document.getElementById("faceYawInput"),
  facePitchInput: document.getElementById("facePitchInput"),
  faceBlendInput: document.getElementById("faceBlendInput"),
  textureBakeBtn: document.getElementById("textureBakeBtn"),
  textureSeamInput: document.getElementById("textureSeamInput"),
  textureNormalInput: document.getElementById("textureNormalInput"),
  textureRoughnessInput: document.getElementById("textureRoughnessInput"),
  compositionSummary: document.getElementById("compositionSummary"),
  compositionList: document.getElementById("compositionList"),
  schemaSummary: document.getElementById("schemaSummary"),
  schemaList: document.getElementById("schemaList"),
  schemaJsonBtn: document.getElementById("schemaJsonBtn"),
  runtimeComparison: document.getElementById("runtimeComparison"),
  runtimeDocBtn: document.getElementById("runtimeDocBtn"),
  spatialTelemetry: document.getElementById("spatialTelemetry"),
  statusText: document.getElementById("statusText"),
  lastExportLink: document.getElementById("lastExportLink"),
  exportSchemaBtn: document.getElementById("exportSchemaBtn"),
  compileRenderBtn: document.getElementById("compileRenderBtn"),
  exportVideoBtn: document.getElementById("exportVideoBtn"),
  loadGeneratedTimelineBtn: document.getElementById("loadGeneratedTimelineBtn"),
  loadDenseTimelineBtn: document.getElementById("loadDenseTimelineBtn"),
  loadVargTimelineBtn: document.getElementById("loadVargTimelineBtn"),
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
const PROJECT_SCHEMA_VERSION = "mahavisphot.compositor.schema.v1";

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

const spatialNodes = [
  { id: "global", icon: "◎", title: "Global Scene", meta: "root / 24fps" },
  { id: "camera", icon: "O", title: "Main_Cam", meta: "35mm projection" },
  { id: "particles", icon: "*", title: "Dust_Particles", meta: "GPU instanced field" },
  { id: "actor", icon: "M", title: "Actor_Mesh_01", meta: "rig preview" },
  { id: "face", icon: "F", title: "Face_Topology_468", meta: "landmark mesh" },
  { id: "fixture", icon: "T", title: "Texture_Fixture", meta: "normal / seam maps" },
];

const particlePresets = {
  ash: { label: "Sufi Ash Drift", colorA: "#f1d17b", colorB: "#7f6a4d", speed: 0.32 },
  neon: { label: "Cyber Neon Embers", colorA: "#00e5ff", colorB: "#7c4dff", speed: 0.58 },
  dust: { label: "Dust Fractures", colorA: "#d7c0a3", colorB: "#ff3b5c", speed: 0.46 },
  vedic: { label: "Vedic Energy Sparks", colorA: "#00e676", colorB: "#00e5ff", speed: 0.72 },
};

const floatingPanelDefaults = {
  sceneGraph: { open: true, x: 18, y: 50, w: 292, h: 318 },
  particles: { open: true, x: 612, y: 170, w: 396, h: 350 },
  nodeGraph: { open: true, x: 228, y: 524, w: 560, h: 300 },
};

const floatingPanelEls = {
  sceneGraph: "floatingSceneGraph",
  particles: "floatingParticles",
  nodeGraph: "floatingNodeGraph",
};

const nodeGraphNodes = [
  { id: "plate", title: "Scene Plate", meta: "V1 source", x: 28, y: 50 },
  { id: "fixture", title: "Texture Fixture", meta: "normal / roughness", x: 190, y: 38 },
  { id: "track", title: "Motion Track", meta: "Mview solver", x: 190, y: 142 },
  { id: "particles", title: "Particle Field", meta: "GPU instances", x: 360, y: 30 },
  { id: "face", title: "Face Swap Pass", meta: "468 landmarks", x: 360, y: 136 },
  { id: "master", title: "Composite Master", meta: "output", x: 520, y: 84 },
];

const nodeGraphLinks = [
  ["plate", "fixture"],
  ["plate", "track"],
  ["fixture", "particles"],
  ["track", "face"],
  ["particles", "master"],
  ["face", "master"],
];

const runtimeComparisonRows = [
  {
    area: "Best fit here",
    electron: "Fastest standalone path for this HTML/JS compositor and existing Node export server.",
    tauri: "Best when the app needs a smaller signed binary and Rust-native command surface.",
  },
  {
    area: "Packaging",
    electron: "Bundles Chromium and Node; larger app, fewer rewrites.",
    tauri: "Uses platform WebView; smaller app, extra Rust setup.",
  },
  {
    area: "Media/export",
    electron: "Can keep FFmpeg/server process directly in the desktop shell.",
    tauri: "Can call FFmpeg through Rust commands with stricter permission design.",
  },
  {
    area: "Security",
    electron: "Needs hardened preload, no Node in renderer, local-only server.",
    tauri: "Stronger default isolation and allowlisted native commands.",
  },
];

const projectSchemaSections = [
  {
    name: "Project Root",
    path: "ProjectExport",
    fields: [
      ["schemaVersion", "string", "Export contract version"],
      ["title", "string", "Project title"],
      ["sourceTimeline", "object|null", "Loaded generator metadata"],
      ["duration", "number", "Master duration in seconds"],
      ["audioPath", "string", "Master audio path"],
      ["rubabPath", "string", "Rubab stem or overlay path"],
      ["scenes", "Scene[]", "Ordered master timeline shots"],
      ["markers", "Marker[]", "Timeline marker pins"],
      ["keyframes", "Keyframe[]", "Per-scene compositor automation"],
      ["dynamicTracks", "DynamicTrack[]", "Created audio/video layers"],
      ["compositions", "Composition[]", "Nested timeline definitions"],
      ["activeCompositionId", "string|null", "Open nested timeline id"],
      ["editPolicy", "EditPolicy", "Duplicate and delete behavior state"],
      ["duplicateDecisions", "DuplicateDecision[]", "Detected duplicate frames and repeated sequences"],
      ["audioMix", "AudioMix", "Mixer and solo state"],
      ["accessibility", "AccessibilityState", "Accessible UI/export state"],
      ["uxNotes", "UxNote[]", "Design notes and sketches"],
      ["spatial", "SpatialState", "3D, particles, tracking, face, texture state"],
      ["layers", "LayerState", "Order, visibility, locks, dynamic mirror"],
    ],
  },
  {
    name: "Scene",
    path: "ProjectExport.scenes[]",
    fields: [
      ["id", "number", "1-based exported scene index"],
      ["start", "number", "Start time in seconds"],
      ["end", "number", "End time in seconds"],
      ["duration", "number", "Computed end minus start"],
      ["titleHi", "string", "Hindi display title"],
      ["titleEn", "string", "English display title"],
      ["frameIndex", "number|string|null", "Source storyboard frame number"],
      ["imagePath", "string", "Source frame path"],
      ["rubabOverlay", "boolean", "Rubab overlay enabled"],
      ["note", "string", "Editor scene note"],
      ["composite", "CompositeState", "Transform and blending"],
      ["effects", "EffectState", "Per-scene VFX toggles"],
      ["transition", "TransitionState", "Outgoing transition"],
      ["captions", "string", "Burn-in caption text"],
    ],
  },
  {
    name: "Composite State",
    path: "Scene.composite",
    fields: [
      ["x", "number", "Horizontal offset"],
      ["y", "number", "Vertical offset"],
      ["scale", "number", "Percent scale"],
      ["rotation", "number", "Degrees"],
      ["opacity", "number", "Percent opacity"],
      ["blendMode", "enum", "normal, multiply, screen, overlay, luminosity"],
    ],
  },
  {
    name: "Effect State",
    path: "Scene.effects",
    fields: [
      ["grain", "boolean", "Film grain pass"],
      ["vignette", "boolean", "Vignette pass"],
      ["dust", "boolean", "Dust field pass"],
      ["sonic", "boolean", "Sonic wave pass"],
    ],
  },
  {
    name: "Transition State",
    path: "Scene.transition",
    fields: [
      ["type", "enum", "cut, crossfade, dip, glow, glitch"],
      ["duration", "number", "Transition duration in seconds"],
    ],
  },
  {
    name: "Dynamic Track",
    path: "ProjectExport.dynamicTracks[]",
    fields: [
      ["id", "string", "Layer id"],
      ["kind", "enum", "video or audio"],
      ["label", "string", "Timeline label"],
      ["title", "string", "Inspector/layer display name"],
      ["visible", "boolean", "Track visibility"],
      ["locked", "boolean", "Track lock state"],
      ["createdAt", "string", "ISO creation time"],
      ["clips", "DynamicClip[]", "Layer clips"],
    ],
  },
  {
    name: "Dynamic Clip",
    path: "DynamicTrack.clips[]",
    fields: [
      ["id", "string", "Clip id"],
      ["sourceType", "enum", "scene, audio, master-audio, imported"],
      ["sceneId", "number|null", "Linked scene id"],
      ["frameIndex", "number|string|null", "Linked frame number"],
      ["title", "string", "Clip label"],
      ["start", "number", "Timeline start"],
      ["end", "number", "Timeline end"],
      ["trimIn", "number", "Source trim-in"],
      ["trimOut", "number", "Source trim-out"],
      ["image", "string", "Resolved thumbnail/image URL"],
      ["path", "string", "Source media path"],
    ],
  },
  {
    name: "Composition",
    path: "ProjectExport.compositions[]",
    fields: [
      ["id", "string", "Nested composition id"],
      ["name", "string", "Editable composition name"],
      ["start", "number", "Master timeline start"],
      ["end", "number", "Master timeline end"],
      ["duration", "number", "Nested timeline duration"],
      ["clips", "CompositionClip[]", "Relative nested clips"],
      ["createdAt", "string", "ISO creation time"],
    ],
  },
  {
    name: "Composition Clip",
    path: "Composition.clips[]",
    fields: [
      ["id", "string", "Nested clip id"],
      ["mediaKind", "enum", "video or audio"],
      ["sourceType", "enum", "scene, dynamic, master-audio"],
      ["sceneId", "number|null", "Original scene id"],
      ["frameIndex", "number|string|null", "Original frame number"],
      ["title", "string", "Nested clip title"],
      ["trackLabel", "string", "Origin track label"],
      ["start", "number", "Original timeline start"],
      ["end", "number", "Original timeline end"],
      ["relativeStart", "number", "Nested timeline start"],
      ["relativeEnd", "number", "Nested timeline end"],
      ["image", "string", "Preview image URL"],
      ["imagePath", "string", "Source image path"],
    ],
  },
  {
    name: "Edit Policy",
    path: "ProjectExport.editPolicy",
    fields: [
      ["deleteMode", "enum", "static, ripple, cascade, gap"],
      ["duplicateMode", "enum", "smart, keep, mark, collapse"],
    ],
  },
  {
    name: "Duplicate Decision",
    path: "ProjectExport.duplicateDecisions[]",
    fields: [
      ["id", "string", "Decision id"],
      ["kind", "enum", "frame, title, sequence, adjacent"],
      ["action", "enum", "keep, mark, collapse"],
      ["reason", "string", "Editor-readable reason"],
      ["sceneIds", "number[]", "Scenes affected by the decision"],
      ["time", "number", "Primary timeline time"],
      ["confidence", "number", "0-1 confidence score"],
    ],
  },
  {
    name: "Marker",
    path: "ProjectExport.markers[]",
    fields: [
      ["id", "string", "Marker id"],
      ["time", "number", "Timeline time in seconds"],
      ["label", "string", "Visible marker label"],
      ["kind", "enum", "scene, rubab, manual, note"],
    ],
  },
  {
    name: "Keyframe",
    path: "ProjectExport.keyframes[]",
    fields: [
      ["id", "string", "Keyframe id"],
      ["sceneId", "number", "Target scene id"],
      ["time", "number", "Timeline time"],
      ["composite", "CompositeState", "Captured transform/blend state"],
      ["effects", "EffectState", "Captured effect state"],
    ],
  },
  {
    name: "Audio Mix",
    path: "ProjectExport.audioMix",
    fields: [
      ["master", "number", "Master gain percent"],
      ["voice", "number", "Voice stem gain percent"],
      ["music", "number", "Music stem gain percent"],
      ["rubab", "number", "Rubab stem gain percent"],
      ["rubabSolo", "boolean", "Solo rubab audition"],
    ],
  },
  {
    name: "Accessibility State",
    path: "ProjectExport.accessibility",
    fields: [
      ["captions", "boolean", "Captions visible"],
      ["highContrast", "boolean", "High contrast UI"],
      ["largeText", "boolean", "Large text UI"],
      ["reduceMotion", "boolean", "Reduced motion mode"],
      ["dyslexia", "boolean", "Readable spacing"],
      ["focusMode", "boolean", "Reduced distraction mode"],
      ["colorMode", "enum", "none, protan, deutan, tritan"],
      ["density", "enum", "compact, comfortable, spacious"],
    ],
  },
  {
    name: "UX Note",
    path: "ProjectExport.uxNotes[]",
    fields: [
      ["id", "string", "Note id"],
      ["status", "enum", "open, planned, done"],
      ["priority", "enum", "P0, P1, P2, P3"],
      ["category", "enum", "layout, timeline, viewer, accessibility, audio, vfx, performance, export"],
      ["time", "number", "Timeline time"],
      ["timecode", "string", "Formatted time"],
      ["sceneId", "number|null", "Linked scene id"],
      ["sceneTitle", "string", "Linked scene title"],
      ["text", "string", "Note body"],
      ["sketch", "string|null", "Handwriting data URL"],
      ["createdAt", "string", "ISO creation time"],
    ],
  },
  {
    name: "Spatial State",
    path: "ProjectExport.spatial",
    fields: [
      ["enabled", "boolean", "Spatial mode active"],
      ["shading", "enum", "wire, solid, material, path"],
      ["activeNode", "enum", "actor, particles, face, fixture, master"],
      ["transformMode", "enum", "translate, rotate, scale"],
      ["mesh", "enum", "actor, face, particles"],
      ["x", "number", "3D X position"],
      ["y", "number", "3D Y position"],
      ["z", "number", "3D Z position"],
      ["focal", "number", "Camera focal length"],
      ["particlePreset", "enum", "ash, neon, dust, vedic"],
      ["particleWindX", "number", "Particle wind X"],
      ["particleWindY", "number", "Particle wind Y"],
      ["particleTurbulence", "number", "Particle turbulence"],
      ["particleLifetime", "number", "Particle lifetime"],
      ["particleDrag", "number", "Particle drag"],
      ["trackingConfidence", "number", "Motion tracking confidence"],
      ["trackingDepth", "number", "Depth bias"],
      ["faceYaw", "number", "Face yaw offset"],
      ["facePitch", "number", "Face pitch offset"],
      ["faceBlend", "number", "Face replacement blend"],
      ["textureSeam", "number", "UV seam repair amount"],
      ["textureNormal", "number", "Normal map depth"],
      ["textureRoughness", "number", "Roughness amount"],
      ["activePresetLabel", "string", "Resolved particle preset name"],
      ["matrix", "string", "Projection formula"],
      ["solver", "string", "Tracking solver state"],
      ["floatingPanels", "object", "Scene Graph, Particles, Node Graph frames"],
    ],
  },
  {
    name: "Layer State",
    path: "ProjectExport.layers",
    fields: [
      ["order", "string[]", "Layer stack order"],
      ["visible", "Record<string, boolean>", "Visibility by layer key"],
      ["locked", "Record<string, boolean>", "Lock state by layer key"],
      ["dynamic", "DynamicTrack[]", "Dynamic layer mirror"],
    ],
  },
  {
    name: "Auth User",
    path: "AuthStore.users[]",
    fields: [
      ["id", "string", "Local user id"],
      ["email", "string", "Normalized login email"],
      ["name", "string", "Display name"],
      ["password", "PasswordHash", "PBKDF2 salt/hash metadata"],
      ["subscription", "SubscriptionState", "Local subscription record"],
      ["license", "LicenseState", "Local license entitlement"],
      ["createdAt", "string", "ISO creation time"],
    ],
  },
  {
    name: "Subscription State",
    path: "AuthUser.subscription",
    fields: [
      ["plan", "enum", "free, trial, pro, studio"],
      ["state", "enum", "free, trial, pro, studio"],
      ["status", "string", "active or trialing"],
      ["billingMode", "string", "local until gateway is connected"],
      ["gateway", "string", "not_connected for current build"],
      ["projectLimit", "number", "Plan project capacity"],
      ["exportTier", "string", "preview, mp4-preview, mp4, uhd-ready"],
      ["seats", "number", "Local seat count"],
      ["features", "string[]", "Enabled local feature flags"],
      ["activatedAt", "string|null", "ISO plan activation time"],
    ],
  },
  {
    name: "License State",
    path: "AuthUser.license",
    fields: [
      ["id", "string", "Deterministic local license id"],
      ["key", "string", "Local license key"],
      ["status", "string", "active or trialing"],
      ["tier", "enum", "free, trial, pro, studio"],
      ["seats", "number", "Licensed local seats"],
      ["exportTier", "string", "Licensed export tier"],
      ["issuedAt", "string", "ISO issue time"],
      ["expiresAt", "string|null", "Trial expiry when applicable"],
      ["features", "string[]", "Licensed feature flags"],
    ],
  },
  {
    name: "Saved Project Record",
    path: "ProjectStore.projects[]",
    fields: [
      ["id", "string", "Project id"],
      ["ownerId", "string", "Auth user id"],
      ["licenseId", "string", "License id used for save"],
      ["name", "string", "Project library name"],
      ["payload.sourceProject", "object", "Source scaffold with frames/assets"],
      ["payload.edit", "ProjectExport", "Current editor/export payload"],
      ["schemaVersion", "string", "Edit schema version"],
      ["sceneCount", "number", "Cached scene count"],
      ["duration", "number", "Cached duration"],
      ["duplicatedFrom", "string|null", "Source project id when duplicated"],
      ["createdAt", "string", "ISO creation time"],
      ["updatedAt", "string", "ISO update time"],
    ],
  },
  {
    name: "Runtime Desktop",
    path: "StandaloneRuntime",
    fields: [
      ["electron.main", "string", "electron/main.cjs"],
      ["electron.preload", "string", "electron/preload.cjs"],
      ["server.entry", "string", "editor/server.js"],
      ["npm.start", "string", "node editor/server.js"],
      ["npm.electron", "string", "node_modules/.bin/electron ."],
      ["tauri.status", "enum", "comparison documented, scaffold not installed"],
    ],
  },
];

const fallbackSceneTemplates = [
  [1, 0, 9.86, "द लॉन्ग रोड", "The Long Road", "keyframe_01_01_long_road.jpg"],
  [2, 9.86, 19.71, "संस्कृत नाद", "Sanskrit Blast", "keyframe_02_02_sanskrit_blast.jpg"],
  [3, 19.71, 47.21, "वैचारिक प्रहार", "Aggressive Delivery", "keyframe_03_03_aggressive_delivery.jpg"],
  [4, 47.21, 55.85, "धरातल का बदलाव", "Structural Shift", "keyframe_04_04_structural_shift.jpg"],
  [5, 55.85, 72.94, "पदचाप की धमक", "Unyielding Stance", "keyframe_05_05_unyielding_stance.jpg"],
  [6, 72.94, 82.14, "वज्र प्रहार", "Dust Fracture", "keyframe_06_06_dust_fracture.jpg"],
  [7, 82.14, 88.68, "पख्तून रक्षक", "Pakhtoon Warrior", "keyframe_07_07_pakhtoon_warrior.jpg"],
  [8, 88.68, 99.22, "रूहानी नमी", "The Shared Tear", "keyframe_08_08_shared_tear.jpg"],
  [9, 99.22, 107.83, "शापित ग्रंथ", "Shapit Granth", "keyframe_09_09_shapit_granth.jpg"],
  [10, 107.83, 118.52, "गंगा और तुलसी", "Ganga and Tulsi", "keyframe_10_10_ganga_tulsi.jpg"],
  [11, 118.52, 158.04, "अटूट जुड़ाव", "One-ness", "keyframe_11_11_oneness.jpg"],
  [12, 158.04, 171.54, "ब्रह्म की मुस्कान", "Brahman Smirk", "keyframe_12_12_brahman_smirk.jpg"],
  [13, 171.54, 184.47, "महाशून्य", "The Empty Space", "keyframe_13_13_empty_space.jpg"],
  [14, 184.47, 192.92, "स्पंदन की गूंज", "Vibration Echo", "keyframe_14_14_vibration_echo.jpg"],
  [15, 192.92, 201.84, "तर्पण और विसर्जन", "Sanskrit Chant", "keyframe_15_15_sanskrit_chant.jpg"],
  [16, 201.84, 205.84, "पूर्ण विराम", "Final Silence", "keyframe_16_16_final_silence.jpg"],
];

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

function assetUrl(path) {
  const normalized = String(path || "").replace(/^\/+/, "");
  if (!normalized) return "";
  return location.protocol === "file:" ? `../${normalized}` : `/assets/${normalized}`;
}

function fallbackProject(timelineId = "first-generated") {
  const scenes = fallbackSceneTemplates.map(([id, start, end, titleHi, titleEn, file]) => {
    const imagePath = `build_frames/mahavisphot_timestamped/keyframes/${file}`;
    return {
      id,
      start,
      end,
      duration: roundTime(end - start),
      titleHi,
      titleEn,
      source: String(id),
      frameIndex: id,
      imagePath,
      image: assetUrl(imagePath),
      rubabOverlay: [3, 7, 10, 16].includes(id),
      note: "",
    };
  });
  return {
    timeline: {
      id: timelineId,
      name: timelineId === "prior-board-137-shots" ? "Prior Boards 137-Shot Sequence" : "First Generated Timeline",
      path: "file fallback",
      note: "Loaded without local API server",
      shotCount: scenes.length,
    },
    duration: Math.max(...scenes.map((scene) => scene.end)),
    audio: {
      path: "अहं ब्रह्मास्मि.wav",
      url: assetUrl("अहं ब्रह्मास्मि.wav"),
      duration: 201.84,
    },
    rubab: {
      path: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0004.jpg",
      url: assetUrl("build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0004.jpg"),
    },
    frames: [],
    references: [],
    scenes,
    exportsUrl: "exports",
  };
}

function sceneLength(scene) {
  return Math.max(MIN_SCENE_SECONDS, Number(scene.end) - Number(scene.start));
}

function projectDuration() {
  const sceneEnd = Math.max(0, ...state.scenes.map((scene) => Number(scene.end) || 0));
  return Math.max(sceneEnd, Number(state.project?.duration) || 0);
}

function activeComposition() {
  return state.compositions.find((composition) => composition.id === state.activeCompositionId) || null;
}

function selectedComposition() {
  return state.compositions.find((composition) => composition.id === state.selectedCompositionId) || activeComposition() || state.compositions[0] || null;
}

function timelineDuration() {
  const composition = activeComposition();
  return composition ? Math.max(MIN_SCENE_SECONDS, Number(composition.duration) || MIN_SCENE_SECONDS) : projectDuration();
}

function timelineContextLabel() {
  const composition = activeComposition();
  return composition ? `Comp ${composition.name}` : "Master";
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
  const duration = timelineDuration();
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
  els.timelineViewport.dataset.context = activeComposition() ? "composition" : "master";
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

function isSpatialMode() {
  return ["3d", "particles", "motion", "face"].includes(state.workspaceMode) ||
    ["spatial", "particles", "tracking", "face", "texture"].includes(state.activePanel) ||
    ["3d", "tracking", "particles"].includes(state.timelineMode);
}

function activeLayerSummary() {
  const scene = selectedScene();
  const selectedTrack = dynamicTrackById(state.selectedTrackId);
  if (selectedTrack) {
    return `${selectedTrack.label} ${selectedTrack.title || titleCase(selectedTrack.kind)}`;
  }
  if (state.activePanel === "compositions" || activeComposition()) {
    return activeComposition() ? `C ${activeComposition().name}` : "C Composition Lane";
  }
  if (state.activePanel === "spatial" || state.timelineMode === "3d") {
    return state.layerVisibility.three ? "3D Actor Mesh" : "3D hidden";
  }
  if (state.activePanel === "particles" || state.timelineMode === "particles") {
    return state.layerVisibility.particles ? "PT Particle Field" : "Particles hidden";
  }
  if (state.activePanel === "tracking" || state.activePanel === "face" || state.timelineMode === "tracking") {
    return state.layerVisibility.tracking ? "MT Tracking Pass" : "Tracking hidden";
  }
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
  const known = ["vfx", "captions", "particles", "tracking", "three", "rubab", "video", "audio"];
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

function moveDynamicTrackBefore(trackId, targetTrackId) {
  if (!trackId || !targetTrackId || trackId === targetTrackId) return;
  const order = state.dynamicTracks.filter((track) => track.id !== trackId);
  const moving = state.dynamicTracks.find((track) => track.id === trackId);
  if (!moving) return;
  const targetIndex = order.findIndex((track) => track.id === targetTrackId);
  order.splice(targetIndex < 0 ? order.length : targetIndex, 0, moving);
  state.dynamicTracks = order;
  state.selectedTrackId = trackId;
  setDirty();
  renderLayerStack();
  renderTimeline();
  showHud(`${moving.label} moved`);
}

function moveDynamicTrackToEnd(trackId) {
  const moving = dynamicTrackById(trackId);
  if (!moving) return;
  state.dynamicTracks = [...state.dynamicTracks.filter((track) => track.id !== trackId), moving];
  state.selectedTrackId = trackId;
  setDirty();
  renderLayerStack();
  renderTimeline();
  showHud(`${moving.label} moved`);
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
  const timelineLabel = `${timelineContextLabel()} / ${titleCase(state.timelineMode)} / ${titleCase(state.timelineLayout)}`;
  const zoomLabel = `H ${state.timelineZoom.toFixed(1)} / V ${state.timelineVerticalZoom.toFixed(2)}`;
  const editLabel = `Del ${state.editPolicy.deleteMode} / Dupes ${state.duplicateDecisions.length}`;
  const layoutLabel = `L ${Math.round(state.layout.leftWidth)} R ${Math.round(state.layout.rightWidth)} V ${Math.round(state.layout.viewerHeight)}`;
  const audioLabel = state.audio.rubabSolo
    ? `M${state.audio.master}% Rubab solo`
    : `M${state.audio.master}% R${state.audio.rubab}%`;

  els.hudPrimary.textContent = message || "Ready";
  els.hudTimecode.textContent = `${fmt(state.currentTime)} / ${fmt(timelineDuration())}`;
  els.hudTool.textContent = `${titleCase(state.tool)} · snap ${state.snap ? "on" : "off"} · guides ${state.safeGuides ? "on" : "off"}`;
  els.hudScene.textContent = scene ? `${String(scene.id).padStart(2, "0")} ${scene.titleEn || "Untitled"}` : "No scene";
  els.hudLayer.textContent = activeLayerSummary();
  els.hudComposite.textContent = `${composite.opacity}% ${composite.blendMode} · scale ${composite.scale}%`;
  els.hudTimeline.textContent = `${timelineLabel} · ${zoomLabel} · ${editLabel}`;
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

function compositionSceneAt(composition, time) {
  if (!composition) return null;
  const value = Number(time) || 0;
  const clip = (composition.clips || []).find((item) => {
    if (item.mediaKind !== "video" || item.sourceType !== "scene") return false;
    return value >= Number(item.relativeStart) && value < Number(item.relativeEnd);
  });
  return clip ? state.scenes.find((scene) => scene.id === clip.sceneId) || null : null;
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

async function apiJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || response.statusText || "API request failed");
  }
  return data;
}

function shortDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

function subscriptionLabel(subscription = state.auth.subscription) {
  if (!subscription) return "Guest";
  return `${subscription.label || titleCase(subscription.plan)} · ${subscription.state || subscription.status || "active"}`;
}

function setAuthMessage(message = "", projectMessage = null) {
  state.auth.message = message;
  if (projectMessage !== null) state.auth.projectMessage = projectMessage;
  renderAuthState();
}

function renderSummary(container, rows) {
  if (!container) return;
  container.innerHTML = "";
  for (const [label, value] of rows) {
    const row = document.createElement("span");
    const key = document.createElement("b");
    const text = document.createElement("em");
    key.textContent = label;
    text.textContent = String(value);
    row.append(key, text);
    container.appendChild(row);
  }
}

function renderAuthState() {
  const signedIn = Boolean(state.auth.user);
  if (els.accountStatus) {
    els.accountStatus.textContent = signedIn
      ? `${state.auth.user.name || state.auth.user.email} · ${state.auth.subscription?.plan || "free"}`
      : "Guest";
    els.accountStatus.title = signedIn ? state.auth.user.email : "Not signed in";
  }
  if (els.authOpenBtn) els.authOpenBtn.textContent = signedIn ? "Account" : "Sign In";
  if (els.saveProjectTopBtn) els.saveProjectTopBtn.disabled = !signedIn;
  if (els.logoutBtn) els.logoutBtn.hidden = !signedIn;
  if (els.authForm) els.authForm.hidden = signedIn;
  if (els.authMessage) els.authMessage.textContent = state.auth.message;
  if (els.projectMessage) els.projectMessage.textContent = state.auth.projectMessage;

  renderSummary(els.accountSummary, signedIn
    ? [
      ["User", state.auth.user.name || state.auth.user.email],
      ["Email", state.auth.user.email],
      ["Session", "Active local cookie"],
      ["License", state.auth.license?.key || state.auth.user.license?.key || "Local pending"],
    ]
    : [
      ["State", "Signed out"],
      ["Auth", "Register or login to save projects"],
      ["Billing", "Local subscription records only"],
    ]);

  renderSummary(els.planSummary, signedIn
    ? [
      ["Plan", subscriptionLabel()],
      ["Projects", `${state.auth.projects.length} / ${state.auth.subscription?.projectLimit || 0}`],
      ["Export", state.auth.subscription?.exportTier || "preview"],
      ["Seats", state.auth.subscription?.seats || 1],
      ["License", state.auth.license?.status || state.auth.user.license?.status || "active"],
    ]
    : [
      ["Plan", "Guest"],
      ["Projects", "Sign in required"],
      ["Export", "Preview only"],
      ["License", "No local license"],
    ]);

  if (els.planGateStatus) {
    els.planGateStatus.textContent = signedIn ? (state.auth.license?.tier || state.auth.subscription?.plan || "free") : "Guest";
  }

  for (const button of els.subscriptionPlanGrid?.querySelectorAll("button[data-plan]") || []) {
    const active = button.dataset.plan === (state.auth.subscription?.plan || "free");
    button.classList.toggle("active", signedIn && active);
    button.disabled = !signedIn;
  }

  if (els.projectNameInput && !els.projectNameInput.value) {
    els.projectNameInput.value = state.project?.timeline?.name || "Mahavisphot cut";
  }
  if (els.saveProjectBtn) els.saveProjectBtn.disabled = !signedIn || !state.project;
  if (els.updateProjectBtn) els.updateProjectBtn.disabled = !signedIn || !state.auth.selectedProjectId || !state.project;
  if (els.saveProjectTopBtn) els.saveProjectTopBtn.title = state.auth.selectedProjectId ? "Save selected project" : "Create saved project";
  if (els.refreshProjectsBtn) els.refreshProjectsBtn.disabled = !signedIn;
  renderProjectList();
}

function renderProjectList() {
  if (!els.projectList) return;
  els.projectList.innerHTML = "";
  if (!state.auth.user) {
    const empty = document.createElement("p");
    empty.className = "empty-compositions";
    empty.textContent = "Sign in to create, load, update, and delete saved projects.";
    els.projectList.appendChild(empty);
    return;
  }
  if (!state.auth.projects.length) {
    const empty = document.createElement("p");
    empty.className = "empty-compositions";
    empty.textContent = "No saved projects yet.";
    els.projectList.appendChild(empty);
    return;
  }
  for (const project of state.auth.projects) {
    const card = document.createElement("article");
    const title = document.createElement("strong");
    const meta = document.createElement("span");
    const schema = document.createElement("em");
    const actions = document.createElement("div");
    const load = document.createElement("button");
    const select = document.createElement("button");
    const duplicate = document.createElement("button");
    const remove = document.createElement("button");
    card.className = `project-card${project.id === state.auth.selectedProjectId ? " selected" : ""}`;
    title.textContent = project.name || "Untitled Project";
    meta.textContent = `${project.sceneCount || 0} scenes · ${fmt(project.duration || 0)} · ${shortDate(project.updatedAt)}`;
    schema.textContent = project.schemaVersion || "local project";
    actions.className = "project-card-actions";
    load.type = "button";
    load.textContent = "Open";
    load.addEventListener("click", () => loadSavedProject(project.id));
    select.type = "button";
    select.textContent = "Select";
    select.addEventListener("click", () => {
      state.auth.selectedProjectId = project.id;
      els.projectNameInput.value = project.name || "";
      state.activePanel = "projects";
      renderAuthState();
      showHud("Project selected");
    });
    duplicate.type = "button";
    duplicate.textContent = "Duplicate";
    duplicate.addEventListener("click", () => duplicateSavedProject(project.id));
    remove.type = "button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteSavedProject(project.id));
    actions.append(load, select, duplicate, remove);
    card.append(title, meta, schema, actions);
    els.projectList.appendChild(card);
  }
}

async function refreshAuth() {
  try {
    const data = await apiJson("/api/auth/me");
    state.auth.user = data.user || null;
    state.auth.subscription = data.subscription || data.user?.subscription || null;
    state.auth.license = data.license || data.user?.license || null;
    if (state.auth.user) await refreshProjects({ silent: true });
  } catch (error) {
    state.auth.user = null;
    state.auth.subscription = null;
    state.auth.license = null;
    state.auth.projects = [];
    state.auth.message = `Auth unavailable: ${error.message}`;
  }
  renderAuthState();
}

async function loginUser() {
  try {
    const data = await apiJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: els.authEmailInput.value,
        password: els.authPasswordInput.value,
      }),
    });
    state.auth.user = data.user;
    state.auth.subscription = data.subscription;
    state.auth.license = data.license || data.user?.license || null;
    state.auth.message = "Signed in";
    els.authPasswordInput.value = "";
    await refreshProjects({ silent: true });
    state.activePanel = "projects";
    render();
    showHud("Signed in");
  } catch (error) {
    setAuthMessage(error.message);
  }
}

async function registerUser() {
  try {
    const data = await apiJson("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: els.authNameInput.value,
        email: els.authEmailInput.value,
        password: els.authPasswordInput.value,
      }),
    });
    state.auth.user = data.user;
    state.auth.subscription = data.subscription;
    state.auth.license = data.license || data.user?.license || null;
    state.auth.message = "Account created";
    els.authPasswordInput.value = "";
    await refreshProjects({ silent: true });
    state.activePanel = "projects";
    render();
    showHud("Account created");
  } catch (error) {
    setAuthMessage(error.message);
  }
}

async function logoutUser() {
  try {
    await apiJson("/api/auth/logout", { method: "POST" });
  } catch {
    // The local session may already be expired; clear client state either way.
  }
  state.auth.user = null;
  state.auth.subscription = null;
  state.auth.license = null;
  state.auth.projects = [];
  state.auth.selectedProjectId = null;
  state.auth.message = "Signed out";
  renderAuthState();
  showHud("Signed out");
}

async function updateSubscription(plan) {
  try {
    const data = await apiJson("/api/subscription", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
    state.auth.user = data.user;
    state.auth.subscription = data.subscription;
    state.auth.license = data.license || data.user?.license || null;
    state.auth.message = `${subscriptionLabel(data.subscription)} selected`;
    renderAuthState();
    showHud("Subscription updated");
  } catch (error) {
    setAuthMessage(error.message);
  }
}

async function refreshProjects(options = {}) {
  if (!state.auth.user) {
    state.auth.projects = [];
    renderAuthState();
    return;
  }
  try {
    const data = await apiJson("/api/projects");
    state.auth.projects = data.projects || [];
    if (state.auth.selectedProjectId && !state.auth.projects.some((project) => project.id === state.auth.selectedProjectId)) {
      state.auth.selectedProjectId = null;
    }
    if (!options.silent) state.auth.projectMessage = `${state.auth.projects.length} projects loaded`;
  } catch (error) {
    state.auth.projectMessage = error.message;
  }
  renderAuthState();
}

function savedProjectPayload() {
  return {
    sourceProject: structuredClone(state.project),
    edit: getProjectExportPayload(),
    savedAt: new Date().toISOString(),
  };
}

async function createSavedProject() {
  if (!state.auth.user) {
    state.activePanel = "account";
    render();
    showHud("Sign in to save projects");
    return;
  }
  try {
    const data = await apiJson("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: els.projectNameInput.value || state.project?.timeline?.name || "Mahavisphot cut",
        payload: savedProjectPayload(),
      }),
    });
    state.auth.selectedProjectId = data.project.id;
    state.auth.projectMessage = `Created ${data.project.name}`;
    await refreshProjects({ silent: true });
    renderAuthState();
    showHud("Project created");
  } catch (error) {
    state.auth.projectMessage = error.message;
    renderAuthState();
  }
}

async function updateSavedProject() {
  if (!state.auth.selectedProjectId) {
    await createSavedProject();
    return;
  }
  try {
    const data = await apiJson(`/api/projects/${encodeURIComponent(state.auth.selectedProjectId)}`, {
      method: "PUT",
      body: JSON.stringify({
        name: els.projectNameInput.value || "Mahavisphot cut",
        payload: savedProjectPayload(),
      }),
    });
    state.auth.projectMessage = `Updated ${data.project.name}`;
    await refreshProjects({ silent: true });
    renderAuthState();
    showHud("Project updated");
  } catch (error) {
    state.auth.projectMessage = error.message;
    renderAuthState();
  }
}

async function saveCurrentProject() {
  if (state.auth.selectedProjectId) {
    await updateSavedProject();
    return;
  }
  await createSavedProject();
}

async function duplicateSavedProject(projectId) {
  try {
    const data = await apiJson(`/api/projects/${encodeURIComponent(projectId)}/duplicate`, { method: "POST" });
    state.auth.selectedProjectId = data.project.id;
    state.auth.projectMessage = `Duplicated ${data.project.name}`;
    await refreshProjects({ silent: true });
    renderAuthState();
    showHud("Project duplicated");
  } catch (error) {
    state.auth.projectMessage = error.message;
    renderAuthState();
  }
}

function restoreProjectPayload(payload, fallbackName = "Saved Project") {
  const sourceProject = structuredClone(payload.sourceProject || state.project || fallbackProject());
  const edit = payload.edit || payload;
  sourceProject.timeline = {
    ...(sourceProject.timeline || {}),
    name: fallbackName,
    note: "Loaded from saved project CRUD",
  };
  sourceProject.duration = Number(edit.duration) || Number(sourceProject.duration) || 0;
  sourceProject.audio = {
    ...(sourceProject.audio || {}),
    path: edit.audioPath || sourceProject.audio?.path || "अहं ब्रह्मास्मि.wav",
  };
  sourceProject.audio.url = assetUrl(sourceProject.audio.path);
  sourceProject.rubab = {
    ...(sourceProject.rubab || {}),
    path: edit.rubabPath || sourceProject.rubab?.path || "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0004.jpg",
  };
  sourceProject.rubab.url = assetUrl(sourceProject.rubab.path);
  sourceProject.scenes = (edit.scenes || sourceProject.scenes || []).map((scene) => ensureSceneDefaults({
    ...scene,
    source: scene.source || String(scene.frameIndex || scene.id || ""),
    image: assetUrl(scene.imagePath),
  }));
  applyProject(sourceProject, `Loaded ${fallbackName}`);
  state.markers = structuredClone(edit.markers || state.markers || []);
  state.keyframes = structuredClone(edit.keyframes || []);
  const hasSavedDynamicTracks = Array.isArray(edit.dynamicTracks);
  state.dynamicTracks = (hasSavedDynamicTracks ? structuredClone(edit.dynamicTracks) : []).map((track) => normalizeDynamicTrack(track, track.kind));
  state.nextDynamicTrackId = Math.max(0, ...state.dynamicTracks.map((track) => Number(String(track.id).replace(/\D+/g, "")) || 0)) + 1;
  state.selectedTrackId = state.dynamicTracks[0]?.id || null;
  if (!hasSavedDynamicTracks) ensureDefaultDynamicTracks();
  state.compositions = structuredClone(edit.compositions || []);
  state.nextCompositionId = Math.max(0, ...state.compositions.map((composition) => Number(String(composition.id).replace(/\D+/g, "")) || 0)) + 1;
  state.activeCompositionId = state.compositions.some((composition) => composition.id === edit.activeCompositionId) ? edit.activeCompositionId : null;
  state.selectedCompositionId = state.activeCompositionId || state.compositions[0]?.id || null;
  Object.assign(state.audio, edit.audioMix || {});
  Object.assign(state.access, edit.accessibility || {});
  Object.assign(state.editPolicy, edit.editPolicy || {});
  state.duplicateDecisions = Array.isArray(edit.duplicateDecisions) ? structuredClone(edit.duplicateDecisions) : analyzeDuplicateDecisions();
  state.uxNotes = Array.isArray(edit.uxNotes) ? structuredClone(edit.uxNotes) : state.uxNotes;
  if (edit.spatial) {
    const { animationId, lastFrameTime, ...spatial } = edit.spatial;
    Object.assign(state.spatial, spatial, { animationId: null, lastFrameTime: 0 });
  }
  if (edit.layers) {
    if (Array.isArray(edit.layers.order)) state.layerOrder = edit.layers.order;
    Object.assign(state.layerVisibility, edit.layers.visible || {});
    Object.assign(state.layerLocked, edit.layers.locked || {});
  }
  saveUxNotes();
  render();
}

async function loadSavedProject(projectId) {
  try {
    const data = await apiJson(`/api/projects/${encodeURIComponent(projectId)}`);
    state.auth.selectedProjectId = data.project.id;
    els.projectNameInput.value = data.project.name || "";
    restoreProjectPayload(data.project.payload || {}, data.project.name);
    state.auth.projectMessage = `Loaded ${data.project.name}`;
    state.activePanel = "projects";
    renderAuthState();
    showHud("Project loaded");
  } catch (error) {
    state.auth.projectMessage = error.message;
    renderAuthState();
  }
}

async function deleteSavedProject(projectId) {
  try {
    await apiJson(`/api/projects/${encodeURIComponent(projectId)}`, { method: "DELETE" });
    if (state.auth.selectedProjectId === projectId) state.auth.selectedProjectId = null;
    state.auth.projectMessage = "Project deleted";
    await refreshProjects({ silent: true });
    renderAuthState();
    showHud("Project deleted");
  } catch (error) {
    state.auth.projectMessage = error.message;
    renderAuthState();
  }
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
  const duration = timelineDuration();
  const playheadLeft = 86 + state.currentTime * pixelsPerSecond();
  els.jogSlider.max = String(duration);
  els.jogSlider.value = String(clamp(state.currentTime, 0, duration));
  els.playerClock.textContent = `${fmt(state.currentTime)} / ${fmt(duration)}`;
  els.playPauseBtn.textContent = state.playing ? "II" : "▶";
  els.playhead.style.left = `${playheadLeft}px`;
  els.timelineReadout.textContent = `${timelineContextLabel()} · Playhead ${fmt(state.currentTime)} / ${fmt(duration)} · ${state.timelineMode} · ${state.timelineLayout} · H ${state.timelineZoom.toFixed(1)} / V ${state.timelineVerticalZoom.toFixed(2)} · pinch ${state.pinchAxis} · del ${state.editPolicy.deleteMode} · dupes ${state.duplicateDecisions.length}`;
  renderMeters();
  renderHud();
  if (state.activePanel === "story") renderStoryline();
  followTimelinePlayhead();
  renderTimelineMinimap();
}

function setPlayhead(time, options = {}) {
  const duration = timelineDuration();
  const nextTime = clamp(time, 0, duration);
  state.currentTime = nextTime;

  if (options.syncAudio !== false && Number.isFinite(els.audioPlayer.duration)) {
    if (Math.abs(els.audioPlayer.currentTime - nextTime) > 0.03) {
      els.audioPlayer.currentTime = nextTime;
    }
  }

  const nextScene = activeComposition()
    ? compositionSceneAt(activeComposition(), nextTime)
    : sceneAt(nextTime);
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
  const duration = timelineDuration();
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
    if (state.currentTime >= timelineDuration() - 0.02) state.currentTime = 0;
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
    mediaKind: "video",
    frameIndex: asset.frameIndex || asset.index || null,
    image: asset.image,
    path: asset.path,
    title: assetTitle(asset),
  };
}

function sceneDragPayload(scene) {
  if (!scene) return null;
  return {
    type: "scene",
    mediaKind: "video",
    id: scene.id,
  };
}

function audioClipDragPayload() {
  return {
    type: "audio-clip",
    mediaKind: "audio",
    title: state.project?.audio?.name || "Master audio",
    start: 0,
    end: projectDuration(),
  };
}

function clipRefKey(ref) {
  if (!ref) return "";
  if (ref.type === "dynamic") return `${ref.type}:${ref.trackId}:${ref.clipId}`;
  return `${ref.type}:${ref.id || ref.type}`;
}

function isClipRefSelected(ref) {
  const key = clipRefKey(ref);
  return Boolean(key && state.selectedClipRefs.some((item) => clipRefKey(item) === key));
}

function selectClipRef(ref, event = null) {
  if (!ref) return;
  const key = clipRefKey(ref);
  if (!key) return;
  if (event?.shiftKey) {
    if (isClipRefSelected(ref)) {
      state.selectedClipRefs = state.selectedClipRefs.filter((item) => clipRefKey(item) !== key);
    } else {
      state.selectedClipRefs.push(ref);
    }
  } else {
    state.selectedClipRefs = [ref];
  }
}

function dynamicTrackById(trackId) {
  return state.dynamicTracks.find((track) => track.id === trackId) || null;
}

function normalizeDynamicTrack(track, fallbackKind = "video") {
  const kind = track?.kind === "audio" ? "audio" : fallbackKind;
  const label = track?.label || nextTrackLabel(kind);
  return {
    id: track?.id || `track-${state.nextDynamicTrackId}`,
    kind,
    label,
    title: track?.title || `${label} ${kind === "audio" ? "Audio" : "Video"} Layer`,
    visible: track?.visible !== false,
    locked: Boolean(track?.locked),
    createdAt: track?.createdAt || new Date().toISOString(),
    clips: Array.isArray(track?.clips) ? track.clips : [],
  };
}

function selectedDynamicTrack() {
  return dynamicTrackById(state.selectedTrackId) || state.dynamicTracks[0] || null;
}

function dynamicClipByRef(ref) {
  const track = dynamicTrackById(ref?.trackId);
  const clip = track?.clips.find((item) => item.id === ref?.clipId) || null;
  return { track, clip };
}

function compositionClipFromRef(ref) {
  if (!ref) return null;
  if (ref.type === "scene") {
    const scene = state.scenes.find((item) => item.id === ref.id);
    if (!scene) return null;
    return {
      mediaKind: "video",
      sourceType: "scene",
      sceneId: scene.id,
      title: scene.titleEn || scene.titleHi || `Scene ${scene.id}`,
      start: Number(scene.start) || 0,
      end: Number(scene.end) || 0,
      image: scene.image || "",
      imagePath: scene.imagePath || "",
      trackLabel: "V1",
    };
  }
  if (ref.type === "dynamic") {
    const { track, clip } = dynamicClipByRef(ref);
    if (!track || !clip) return null;
    return {
      mediaKind: track.kind,
      sourceType: clip.sourceType || track.kind,
      sceneId: clip.sceneId || null,
      frameIndex: clip.frameIndex || null,
      title: clip.title || track.title,
      start: Number(clip.start) || 0,
      end: Number(clip.end) || 0,
      image: clip.image || "",
      imagePath: clip.path || "",
      trackLabel: track.label,
    };
  }
  if (ref.type === "master-audio") {
    return {
      mediaKind: "audio",
      sourceType: "master-audio",
      title: state.project?.audio?.name || "Master audio",
      start: 0,
      end: projectDuration(),
      trackLabel: "A1",
    };
  }
  return null;
}

function selectedCompositionClips() {
  const refs = state.selectedClipRefs.length
    ? state.selectedClipRefs
    : selectedScene()
      ? [{ type: "scene", id: selectedScene().id }]
      : [];
  return refs.map(compositionClipFromRef).filter((clip) => clip && clip.end > clip.start);
}

function createCompositionFromSelection() {
  const clips = selectedCompositionClips();
  if (!clips.length) {
    showHud("Select clips before making a comp");
    return null;
  }
  const start = Math.min(...clips.map((clip) => clip.start));
  const end = Math.max(...clips.map((clip) => clip.end));
  const duration = Math.max(MIN_SCENE_SECONDS, roundTime(end - start));
  const id = `comp-${state.nextCompositionId}`;
  const title = clips.length === 1 ? `${clips[0].title} Comp` : `${clips.length} Clip Composition`;
  const composition = {
    id,
    name: `${String(state.nextCompositionId).padStart(2, "0")} ${title}`,
    start: roundTime(start),
    end: roundTime(end),
    duration,
    clips: clips
      .sort((a, b) => a.start - b.start)
      .map((clip) => ({
        ...clip,
        id: `compclip-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        relativeStart: roundTime(clip.start - start),
        relativeEnd: roundTime(clip.end - start),
      })),
    createdAt: new Date().toISOString(),
  };
  state.nextCompositionId += 1;
  state.compositions.push(composition);
  state.selectedCompositionId = id;
  state.activePanel = "compositions";
  setDirty();
  render();
  showHud(`${composition.name} created`);
  return composition;
}

function openComposition(id = state.selectedCompositionId) {
  const composition = state.compositions.find((item) => item.id === id);
  if (!composition) {
    showHud("No composition selected");
    return;
  }
  state.activeCompositionId = composition.id;
  state.selectedCompositionId = composition.id;
  state.selectedClipRefs = [];
  state.currentTime = 0;
  state.timelineMode = "all";
  state.activePanel = "compositions";
  render();
  showHud(`${composition.name} opened`);
}

function closeCompositionTimeline() {
  const composition = activeComposition();
  state.activeCompositionId = null;
  state.currentTime = composition ? Number(composition.start) || 0 : state.currentTime;
  render();
  showHud("Master timeline");
}

function setDragPayload(event, payload) {
  if (!payload) return;
  event.dataTransfer.effectAllowed = ["scene", "layer", "dynamic-layer"].includes(payload.type) ? "move" : "copy";
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

function nextTrackLabel(kind) {
  const base = kind === "audio" ? "A" : "V";
  const baseIndex = kind === "audio" ? 2 : 3;
  const used = state.dynamicTracks
    .filter((track) => track.kind === kind)
    .map((track) => Number(String(track.label || "").replace(/\D+/g, "")))
    .filter(Number.isFinite);
  return `${base}${Math.max(baseIndex - 1, ...used) + 1}`;
}

function payloadMediaKind(payload) {
  if (!payload) return null;
  if (payload.mediaKind) return payload.mediaKind;
  if (payload.type === "audio-clip") return "audio";
  if (payload.type === "scene" || payload.type === "asset") return "video";
  return null;
}

function clipFromPayload(payload, kind, startTime) {
  const start = roundTime(clamp(startTime, 0, projectDuration()));
  if (payload.type === "scene") {
    const scene = state.scenes.find((item) => item.id === payload.id);
    const duration = scene ? sceneLength(scene) : 4;
    return {
      id: `clip-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sourceType: "scene",
      sceneId: payload.id,
      title: scene?.titleEn || "Scene clip",
      start,
      end: roundTime(Math.min(projectDuration(), start + duration)),
      image: scene?.image || "",
    };
  }
  if (payload.type === "asset") {
    return {
      id: `clip-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sourceType: "asset",
      frameIndex: payload.frameIndex || null,
      title: payload.title || "Asset clip",
      start,
      end: roundTime(Math.min(projectDuration(), start + 5)),
      image: payload.image || "",
      path: payload.path || "",
    };
  }
  const duration = Math.min(projectDuration(), Number(payload.end) - Number(payload.start) || projectDuration());
  return {
    id: `clip-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sourceType: "audio",
    title: payload.title || "Audio clip",
    start,
    end: roundTime(Math.min(projectDuration(), start + Math.max(1, duration))),
  };
}

function createDynamicTrack(kind, payload = null, startTime = state.currentTime, options = {}) {
  if (!["video", "audio"].includes(kind)) return null;
  const mediaKind = payloadMediaKind(payload);
  if (mediaKind && mediaKind !== kind) {
    showHud(`Drop ${kind} media on a ${kind} layer target`);
    return null;
  }
  const label = nextTrackLabel(kind);
  const track = {
    id: `track-${state.nextDynamicTrackId}`,
    kind,
    label,
    title: options.title || (kind === "audio" ? `${label} Audio Layer` : `${label} Video Layer`),
    visible: true,
    locked: false,
    createdAt: new Date().toISOString(),
    clips: payload ? [clipFromPayload(payload, kind, startTime)] : [],
  };
  state.nextDynamicTrackId += 1;
  state.dynamicTracks.push(track);
  state.selectedTrackId = track.id;
  if (options.dirty !== false) setDirty();
  if (options.render !== false) {
    renderTimeline();
    renderLayerStack();
  }
  if (!options.silent) showHud(`${label} created`);
  return track;
}

function addClipToDynamicTrack(track, payload, startTime = state.currentTime) {
  if (!track || !payload) return;
  if (track.locked) {
    showHud(`${track.label} is locked`);
    return;
  }
  const mediaKind = payloadMediaKind(payload);
  if (mediaKind && mediaKind !== track.kind) {
    showHud(`This is a ${track.kind} track`);
    return;
  }
  track.clips.push(clipFromPayload(payload, track.kind, startTime));
  setDirty();
  renderTimeline();
  showHud(`${track.label} clip added`);
}

function ensureDefaultDynamicTracks() {
  const previousSelection = state.selectedTrackId;
  if (!state.dynamicTracks.some((track) => track.kind === "video")) {
    createDynamicTrack("video", null, 0, {
      title: "V3 Empty Video Layer",
      dirty: false,
      render: false,
      silent: true,
    });
  }
  if (!state.dynamicTracks.some((track) => track.kind === "audio")) {
    createDynamicTrack("audio", null, 0, {
      title: "A2 Empty Audio Layer",
      dirty: false,
      render: false,
      silent: true,
    });
  }
  state.selectedTrackId = previousSelection && dynamicTrackById(previousSelection)
    ? previousSelection
    : state.dynamicTracks[0]?.id || null;
}

function createEmptyLayer(kind) {
  const track = createDynamicTrack(kind, null, state.currentTime);
  if (track) {
    setStatus(`${track.label} ${titleCase(kind)} layer ready`);
    render();
  }
}

function renameSelectedLayer() {
  const track = selectedDynamicTrack();
  if (!track) {
    showHud("Select a dynamic layer first");
    return;
  }
  const nextTitle = window.prompt(`Rename ${track.label}`, track.title || track.label);
  if (nextTitle === null) return;
  const clean = nextTitle.trim();
  if (!clean) {
    showHud("Layer name unchanged");
    return;
  }
  track.title = clean;
  setDirty();
  render();
  showHud(`${track.label} renamed`);
}

function duplicateSelectedLayer() {
  const track = selectedDynamicTrack();
  if (!track) {
    showHud("Select a dynamic layer first");
    return;
  }
  const label = nextTrackLabel(track.kind);
  const copy = normalizeDynamicTrack({
    ...structuredClone(track),
    id: `track-${state.nextDynamicTrackId}`,
    label,
    title: `${track.title || label} Copy`,
    createdAt: new Date().toISOString(),
    clips: (track.clips || []).map((clip) => ({
      ...structuredClone(clip),
      id: `clip-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    })),
  }, track.kind);
  state.nextDynamicTrackId += 1;
  const index = state.dynamicTracks.findIndex((item) => item.id === track.id);
  state.dynamicTracks.splice(index + 1, 0, copy);
  state.selectedTrackId = copy.id;
  setDirty();
  render();
  showHud(`${copy.label} duplicated`);
}

function deleteSelectedLayer() {
  const track = selectedDynamicTrack();
  if (!track) {
    showHud("Select a dynamic layer first");
    return;
  }
  state.dynamicTracks = state.dynamicTracks.filter((item) => item.id !== track.id);
  state.selectedClipRefs = state.selectedClipRefs.filter((ref) => ref.type !== "dynamic" || ref.trackId !== track.id);
  state.selectedTrackId = state.dynamicTracks[0]?.id || null;
  setDirty();
  render();
  showHud(`${track.label} deleted`);
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
    if (layerId === "threeLayer") {
      state.workspaceMode = "3d";
      state.activePanel = "spatial";
      state.spatial.activeNode = "actor";
      state.spatial.mesh = "actor";
      scene.note = scene.note || `3D reference queued from ${payload.title || "asset"}`;
      setDirty();
      showHud("3D reference queued");
      return;
    }
    if (layerId === "trackingLayer") {
      state.workspaceMode = "motion";
      state.activePanel = "tracking";
      state.spatial.activeNode = "actor";
      state.spatial.trackingConfidence = Math.max(state.spatial.trackingConfidence, 78);
      scene.note = scene.note || `Tracking reference queued from ${payload.title || "asset"}`;
      setDirty();
      showHud("Tracking reference queued");
      return;
    }
    if (layerId === "particlesLayer") {
      state.workspaceMode = "particles";
      state.activePanel = "particles";
      state.spatial.activeNode = "particles";
      state.spatial.particlePreset = payload.title?.toLowerCase().includes("spark") ? "vedic" : state.spatial.particlePreset;
      setDirty();
      showHud("Particle pass focused");
      return;
    }
    applyAssetToScene(scene, payload);
    showHud("Asset placed on video layer");
  }
}

function dropTimeFromEvent(event) {
  const source = event.currentTarget?.classList?.contains("layer-lane") ? event.currentTarget : els.videoLayer;
  const rect = source.getBoundingClientRect();
  return clamp((event.clientX - rect.left) / pixelsPerSecond(), 0, timelineDuration());
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
  els.spatialViewport.style.zIndex = layerZIndex("three");
  els.spatialFallback.style.zIndex = layerZIndex("three");

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
  const dynamicVideoCount = state.dynamicTracks.filter((track) => track.kind === "video").length;
  const dynamicAudioCount = state.dynamicTracks.filter((track) => track.kind === "audio").length;
  const layerByKey = {
    vfx: { key: "vfx", title: "VFX Bus", meta: "grain, vignette, dust, sonic" },
    captions: { key: "captions", title: "Caption Track", meta: state.access.captions ? "visible captions" : "caption preview off" },
    particles: { key: "particles", title: "Particle Field", meta: particlePresets[state.spatial.particlePreset]?.label || "GPU field" },
    tracking: { key: "tracking", title: "Motion / Face Track", meta: `confidence ${state.spatial.trackingConfidence}%` },
    three: { key: "three", title: "3D Mesh Layer", meta: `${state.spatial.mesh} · ${state.spatial.shading}` },
    rubab: { key: "rubab", title: "Rubab Picture-in-Picture", meta: scene?.rubabOverlay ? "active in selected scene" : "inactive here" },
    video: { key: "video", title: "Scene Plate", meta: `${scene?.imagePath || "board frames"}${dynamicVideoCount ? ` · ${dynamicVideoCount} extra V` : ""}` },
    audio: { key: "audio", title: "Master Audio", meta: `voice, music, rubab mix${dynamicAudioCount ? ` · ${dynamicAudioCount} extra A` : ""}` },
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
  for (const track of state.dynamicTracks) {
    const row = document.createElement("div");
    row.className = `layer-stack-row dynamic-stack-row${track.id === state.selectedTrackId ? " selected" : ""}${track.locked ? " locked" : ""}`;
    row.dataset.trackId = track.id;
    row.dataset.trackKind = track.kind;
    row.draggable = true;
    row.innerHTML = `
      <span class="layer-grip" aria-hidden="true">⋮⋮</span>
      <button type="button" data-track-action="visible" aria-label="Toggle ${track.title} visibility">${track.visible !== false ? "On" : "Off"}</button>
      <button type="button" data-track-action="lock" aria-label="Toggle ${track.title} lock">${track.locked ? "Lock" : "Free"}</button>
      <span><strong>${track.label} · ${track.title || titleCase(track.kind)}</strong><em>${track.clips.length} clip${track.clips.length === 1 ? "" : "s"} · ${track.kind}</em></span>
    `;
    row.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      state.selectedTrackId = track.id;
      state.selectedClipRefs = [];
      renderLayerStack();
      renderHud(`${track.label} selected`);
      showHud(`${track.label} selected`);
    });
    row.addEventListener("dragstart", (event) => {
      state.selectedTrackId = track.id;
      row.classList.add("dragging");
      setDragPayload(event, { type: "dynamic-layer", id: track.id });
    });
    row.addEventListener("dragend", () => {
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
      if (payload?.type === "dynamic-layer") moveDynamicTrackBefore(payload.id, track.id);
      if (payload?.type === "layer") moveLayerToEnd(payload.key);
    });
    row.querySelector(".layer-grip").addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      state.selectedTrackId = track.id;
      renderLayerStack();
    });
    row.querySelector('[data-track-action="visible"]').addEventListener("click", () => {
      track.visible = track.visible === false ? true : false;
      state.selectedTrackId = track.id;
      setDirty();
      render();
      showHud(`${track.label} ${track.visible ? "visible" : "hidden"}`);
    });
    row.querySelector('[data-track-action="lock"]').addEventListener("click", () => {
      track.locked = !track.locked;
      state.selectedTrackId = track.id;
      setDirty();
      render();
      showHud(`${track.label} ${track.locked ? "locked" : "unlocked"}`);
    });
    els.layerStack.appendChild(row);
  }
}

function renderCompositionStack() {
  const containers = [els.compositionStack, els.compositionList].filter(Boolean);
  for (const container of containers) {
    container.innerHTML = "";
    if (!state.compositions.length) {
      const empty = document.createElement("p");
      empty.className = "empty-compositions";
      empty.textContent = "Select one or more clips, then Make Comp.";
      container.appendChild(empty);
      continue;
    }
    for (const composition of state.compositions) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `composition-card${composition.id === state.selectedCompositionId ? " selected" : ""}${composition.id === state.activeCompositionId ? " active" : ""}`;
      button.innerHTML = `
        <strong>${composition.name}</strong>
        <span>${fmt(composition.start)} - ${fmt(composition.end)} · ${composition.clips.length} clips</span>
        <em>${composition.id === state.activeCompositionId ? "Open timeline" : "Nested comp"}</em>
      `;
      button.addEventListener("click", () => {
        state.selectedCompositionId = composition.id;
        state.activePanel = "compositions";
        renderCompositionStack();
        renderInspector();
        showHud(`${composition.name} selected`);
      });
      button.addEventListener("dblclick", () => openComposition(composition.id));
      container.appendChild(button);
    }
  }

  if (els.compositionSummary) {
    const selected = selectedComposition();
    els.compositionSummary.innerHTML = selected
      ? `
        <span><b>Selected</b><em>${selected.name}</em></span>
        <span><b>Range</b><em>${fmt(selected.start)} - ${fmt(selected.end)} / ${fmt(selected.duration)}</em></span>
        <span><b>Clips</b><em>${selected.clips.length} nested sources</em></span>
      `
      : `
        <span><b>Selection</b><em>${state.selectedClipRefs.length || 1} clip ready</em></span>
        <span><b>Workflow</b><em>Shift-click clips, Make Comp, Open</em></span>
      `;
  }
}

function renderRuntimeComparison() {
  if (!els.runtimeComparison) return;
  els.runtimeComparison.innerHTML = "";
  for (const row of runtimeComparisonRows) {
    const item = document.createElement("div");
    item.innerHTML = `
      <strong>${row.area}</strong>
      <span><b>Electron</b>${row.electron}</span>
      <span><b>Tauri</b>${row.tauri}</span>
    `;
    els.runtimeComparison.appendChild(item);
  }
}

function schemaPayload() {
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    counts: {
      scenes: state.scenes.length,
      markers: state.markers.length,
      keyframes: state.keyframes.length,
      dynamicTracks: state.dynamicTracks.length,
      dynamicClips: state.dynamicTracks.reduce((total, track) => total + track.clips.length, 0),
      compositions: state.compositions.length,
      compositionClips: state.compositions.reduce((total, composition) => total + composition.clips.length, 0),
      uxNotes: state.uxNotes.length,
    },
    sections: projectSchemaSections,
  };
}

function renderSchemaPanel() {
  if (!els.schemaList || !els.schemaSummary) return;
  const payload = schemaPayload();
  els.schemaSummary.innerHTML = "";
  for (const [label, value] of [
    ["Version", payload.schemaVersion],
    ["Sections", payload.sections.length],
    ["Scenes", payload.counts.scenes],
    ["Tracks", `${payload.counts.dynamicTracks} / ${payload.counts.dynamicClips} clips`],
    ["Comps", `${payload.counts.compositions} / ${payload.counts.compositionClips} clips`],
    ["Notes", payload.counts.uxNotes],
  ]) {
    const item = document.createElement("span");
    const key = document.createElement("b");
    const val = document.createElement("em");
    key.textContent = label;
    val.textContent = String(value);
    item.append(key, val);
    els.schemaSummary.appendChild(item);
  }

  els.schemaList.innerHTML = "";
  for (const section of payload.sections) {
    const card = document.createElement("article");
    const header = document.createElement("header");
    const title = document.createElement("strong");
    const path = document.createElement("span");
    const fields = document.createElement("div");
    card.className = "schema-card";
    fields.className = "schema-fields";
    title.textContent = section.name;
    path.textContent = section.path;
    header.append(title, path);

    for (const [field, type, note] of section.fields) {
      const row = document.createElement("div");
      const fieldEl = document.createElement("span");
      const typeEl = document.createElement("code");
      const noteEl = document.createElement("em");
      row.className = "schema-field";
      row.setAttribute("role", "row");
      row.title = `${section.path}.${field}: ${type} - ${note}`;
      fieldEl.textContent = field;
      typeEl.textContent = type;
      noteEl.textContent = note;
      row.append(fieldEl, typeEl, noteEl);
      fields.appendChild(row);
    }

    card.append(header, fields);
    els.schemaList.appendChild(card);
  }
}

function setTimelineGeometry(laneWidth) {
  els.timelineCanvas.style.width = `${laneWidth + 86}px`;
  for (const lane of [els.timelineRuler, els.markerLayer, els.compositionLayer, els.videoLayer, els.overlayLayer, els.vfxLayer, els.threeLayer, els.trackingLayer, els.particlesLayer, els.captionLayer, els.audioLayer]) {
    lane.style.width = `${laneWidth}px`;
  }
  if (els.trackCreateRow) {
    els.trackCreateRow.style.width = `${laneWidth + 86}px`;
  }
  for (const lane of els.dynamicTrackRows?.querySelectorAll(".layer-lane") || []) {
    lane.style.width = `${laneWidth}px`;
  }
}

function renderTimelineMinimap() {
  if (!state.project || !els.timelineMiniMapTrack) return;
  const composition = activeComposition();
  const duration = Math.max(MIN_SCENE_SECONDS, timelineDuration());
  const trackWidth = Math.max(1, els.timelineMiniMapTrack.clientWidth);
  els.timelineMiniMapTrack.innerHTML = "";

  if (composition) {
    for (const clip of composition.clips) {
      const segment = document.createElement("button");
      segment.type = "button";
      segment.className = `minimap-segment ${clip.mediaKind === "audio" ? "pin-audio" : "pin-video"}`;
      segment.style.left = `${(Number(clip.relativeStart) / duration) * 100}%`;
      segment.style.width = `${Math.max(1.2, ((Number(clip.relativeEnd) - Number(clip.relativeStart)) / duration) * 100)}%`;
      segment.title = `${clip.title} · ${fmt(clip.relativeStart)}`;
      segment.addEventListener("click", () => setPlayhead(Number(clip.relativeStart) || 0));
      els.timelineMiniMapTrack.appendChild(segment);
    }
  } else {
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
  }

  if (!composition && state.timelineOptions.markers) {
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

  if (!composition && state.timelineOptions.notes) {
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
  const time = roundTime(percent * timelineDuration());
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
  const composition = activeComposition();
  const duration = timelineDuration();
  applyTimelineViewState();
  if (!composition) state.duplicateDecisions = analyzeDuplicateDecisions();
  const pps = pixelsPerSecond();
  const laneWidth = Math.max(duration * pps, els.timelineViewport.clientWidth - 86, 480);
  const denseTimeline = composition ? composition.clips.length > 40 : state.scenes.length > 80;
  const minClipWidth = denseTimeline
    ? state.timelineLayout === "compact" ? 18 : 24
    : 48;
  const tickStep = pps >= 120 ? 2 : pps >= 72 ? 5 : 10;
  setTimelineGeometry(laneWidth);

  for (const lane of [els.timelineRuler, els.markerLayer, els.compositionLayer, els.videoLayer, els.overlayLayer, els.vfxLayer, els.threeLayer, els.trackingLayer, els.particlesLayer, els.captionLayer, els.audioLayer]) {
    lane.innerHTML = "";
  }
  els.dynamicTrackRows.innerHTML = "";
  if (els.trackCreateRow) els.trackCreateRow.hidden = Boolean(composition);

  for (let t = 0; t <= duration + 0.01; t += tickStep) {
    const tick = document.createElement("div");
    tick.className = "ruler-tick";
    tick.style.left = `${t * pps}px`;
    tick.innerHTML = `<span>${fmt(t)}</span>`;
    els.timelineRuler.appendChild(tick);
  }

  if (composition) {
    renderActiveCompositionTimeline(composition, pps, minClipWidth);
    updateTransportUi();
    renderTimelineMinimap();
    return;
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
    const sceneRef = { type: "scene", id: scene.id };
    clip.className = `clip video-clip${scene.id === current?.id ? " selected" : ""}${isClipRefSelected(sceneRef) ? " composition-selected" : ""}`;
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
    clip.addEventListener("click", (event) => {
      selectClipRef(sceneRef, event);
      state.selectedId = scene.id;
      state.currentTime = Number(scene.start) || 0;
      render();
      showHud(`${state.selectedClipRefs.length} clip${state.selectedClipRefs.length === 1 ? "" : "s"} selected`);
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

    const three = document.createElement("button");
    three.type = "button";
    three.className = `clip three-clip${scene.id === current?.id ? " selected" : ""}`;
    three.style.left = left;
    three.style.width = `${width}px`;
    three.innerHTML = `<span class="clip-label">3D · ${state.spatial.mesh} · ${state.spatial.shading}</span>`;
    three.addEventListener("click", () => {
      state.selectedId = scene.id;
      state.activePanel = "spatial";
      state.workspaceMode = "3d";
      render();
      showHud("3D layer selected");
    });
    els.threeLayer.appendChild(three);

    const tracking = document.createElement("button");
    tracking.type = "button";
    tracking.className = `clip tracking-clip${scene.id === current?.id ? " selected" : ""}`;
    tracking.style.left = left;
    tracking.style.width = `${width}px`;
    tracking.innerHTML = `<span class="clip-label">MT · Skel_Track_01 · ${state.spatial.trackingConfidence}%</span>`;
    tracking.addEventListener("click", () => {
      state.selectedId = scene.id;
      state.activePanel = "tracking";
      state.workspaceMode = "motion";
      render();
      showHud("Tracking layer selected");
    });
    els.trackingLayer.appendChild(tracking);

    const particles = document.createElement("button");
    particles.type = "button";
    particles.className = `clip particles-clip${scene.id === current?.id ? " selected" : ""}`;
    particles.style.left = left;
    particles.style.width = `${width}px`;
    particles.innerHTML = `<span class="clip-label">PT · ${particlePresets[state.spatial.particlePreset]?.label || "Particle Field"}</span>`;
    particles.addEventListener("click", () => {
      state.selectedId = scene.id;
      state.activePanel = "particles";
      state.workspaceMode = "particles";
      render();
      showHud("Particle layer selected");
    });
    els.particlesLayer.appendChild(particles);

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

  for (const compositionClip of state.compositions) {
    const comp = document.createElement("button");
    comp.type = "button";
    comp.className = `clip composition-clip${compositionClip.id === state.selectedCompositionId ? " selected" : ""}`;
    comp.style.left = `${Number(compositionClip.start) * pps}px`;
    comp.style.width = `${Math.max(60, Number(compositionClip.duration) * pps)}px`;
    comp.innerHTML = `
      <span class="clip-duration-pill">${fmt(compositionClip.duration)}</span>
      <span class="clip-label">${compositionClip.name}</span>
    `;
    comp.addEventListener("click", (event) => {
      state.selectedCompositionId = compositionClip.id;
      state.currentTime = Number(compositionClip.start) || 0;
      state.activePanel = "compositions";
      render();
      showHud("Composition clip selected");
      if (event.detail >= 2) openComposition(compositionClip.id);
    });
    comp.addEventListener("dblclick", () => openComposition(compositionClip.id));
    els.compositionLayer.appendChild(comp);
  }

  const audio = document.createElement("button");
  audio.type = "button";
  const masterAudioRef = { type: "master-audio" };
  audio.className = `clip audio-clip${isClipRefSelected(masterAudioRef) ? " composition-selected" : ""}`;
  audio.draggable = true;
  audio.style.left = "0px";
  audio.style.width = `${Math.max(180, duration * pps)}px`;
  audio.innerHTML = `<span class="clip-label">${state.project.audio.name || "Master audio"} · ${fmt(duration)}</span>`;
  audio.addEventListener("click", (event) => {
    selectClipRef(masterAudioRef, event);
    setPlayhead(dropTimeFromEvent(event));
    showHud(`${state.selectedClipRefs.length} clip${state.selectedClipRefs.length === 1 ? "" : "s"} selected`);
  });
  audio.addEventListener("dragstart", (event) => {
    audio.classList.add("dragging");
    setDragPayload(event, audioClipDragPayload());
  });
  audio.addEventListener("dragend", () => audio.classList.remove("dragging"));
  els.audioLayer.appendChild(audio);
  renderDynamicTracks(laneWidth, pps);
  updateTransportUi();
  renderTimelineMinimap();
}

function renderDynamicTracks(laneWidth, pps) {
  if (!els.dynamicTrackRows) return;
  for (const track of state.dynamicTracks) {
    if (track.visible === false) continue;
    const row = document.createElement("div");
    row.className = `layer-row dynamic-layer-row ${track.kind}-dynamic-row${track.id === state.selectedTrackId ? " selected" : ""}${track.locked ? " locked" : ""}`;
    row.dataset.trackId = track.id;
    row.innerHTML = `
      <div class="layer-label">${track.label}<br /><span>${track.locked ? "Locked" : track.kind === "audio" ? "Audio" : "Video"}</span></div>
      <div class="layer-lane dynamic-layer-lane" data-dynamic-track-id="${track.id}"></div>
    `;
    const lane = row.querySelector(".layer-lane");
    lane.style.width = `${laneWidth}px`;
    lane.addEventListener("click", () => {
      state.selectedTrackId = track.id;
      state.selectedClipRefs = [];
      renderLayerStack();
      renderHud(`${track.label} selected`);
      showHud(`${track.label} selected`);
    });
    lane.addEventListener("dragover", (event) => {
      if (track.locked) return;
      event.preventDefault();
      lane.classList.add("drop-ready");
    });
    lane.addEventListener("dragleave", () => lane.classList.remove("drop-ready"));
    lane.addEventListener("drop", (event) => {
      event.preventDefault();
      lane.classList.remove("drop-ready");
      const payload = readDragPayload(event);
      addClipToDynamicTrack(track, payload, dropTimeFromEvent(event));
    });
    if (!track.clips.length) {
      const empty = document.createElement("span");
      empty.className = "dynamic-empty-hint";
      empty.textContent = track.locked ? "Locked empty layer" : `Drop ${track.kind} clips here`;
      lane.appendChild(empty);
    }
    for (const clipData of track.clips) {
      const clip = document.createElement("button");
      const dynamicRef = { type: "dynamic", trackId: track.id, clipId: clipData.id };
      clip.type = "button";
      clip.className = `clip dynamic-clip ${track.kind === "audio" ? "audio-clip dynamic-audio-clip" : "video-clip dynamic-video-clip"}${isClipRefSelected(dynamicRef) ? " composition-selected" : ""}`;
      clip.draggable = !track.locked;
      clip.style.left = `${Number(clipData.start) * pps}px`;
      clip.style.width = `${Math.max(48, (Number(clipData.end) - Number(clipData.start)) * pps)}px`;
      clip.innerHTML = track.kind === "video"
        ? `
          ${clipData.image ? `<img src="${clipData.image}" alt="">` : ""}
          <span class="clip-duration-pill">${(Number(clipData.end) - Number(clipData.start)).toFixed(2)}s</span>
          <span class="clip-label">${clipData.title || track.title}</span>
        `
        : `<span class="clip-label">${clipData.title || track.title} · ${fmt(clipData.start)}</span>`;
      clip.addEventListener("click", (event) => {
        state.selectedTrackId = track.id;
        selectClipRef(dynamicRef, event);
        setPlayhead(clipData.start);
        showHud(`${state.selectedClipRefs.length} clip${state.selectedClipRefs.length === 1 ? "" : "s"} selected`);
      });
      clip.addEventListener("dragstart", (event) => {
        if (track.locked) {
          event.preventDefault();
          showHud(`${track.label} is locked`);
          return;
        }
        clip.classList.add("dragging");
        if (track.kind === "audio") setDragPayload(event, {
          type: "audio-clip",
          mediaKind: "audio",
          title: clipData.title || track.title,
          start: clipData.start,
          end: clipData.end,
        });
        else setDragPayload(event, {
          type: clipData.sourceType === "asset" ? "asset" : "scene",
          mediaKind: "video",
          id: clipData.sceneId,
          frameIndex: clipData.frameIndex || null,
          image: clipData.image || "",
          path: clipData.path || "",
          title: clipData.title || track.title,
        });
      });
      clip.addEventListener("dragend", () => clip.classList.remove("dragging"));
      lane.appendChild(clip);
    }
    els.dynamicTrackRows.appendChild(row);
  }
}

function renderActiveCompositionTimeline(composition, pps, minClipWidth) {
  const shell = document.createElement("button");
  shell.type = "button";
  shell.className = "clip composition-clip composition-open-clip selected";
  shell.style.left = "0px";
  shell.style.width = `${Math.max(80, Number(composition.duration) * pps)}px`;
  shell.innerHTML = `
    <span class="clip-duration-pill">${fmt(composition.duration)}</span>
    <span class="clip-label">${composition.name} · nested timeline</span>
  `;
  shell.addEventListener("click", () => {
    state.selectedCompositionId = composition.id;
    showHud("Composition timeline selected");
  });
  els.compositionLayer.appendChild(shell);

  for (const clipData of composition.clips) {
    const left = `${Number(clipData.relativeStart) * pps}px`;
    const width = `${Math.max(minClipWidth, (Number(clipData.relativeEnd) - Number(clipData.relativeStart)) * pps)}px`;
    const clip = document.createElement("button");
    clip.type = "button";
    clip.className = `clip composition-source-clip ${clipData.mediaKind === "audio" ? "audio-clip composition-audio-source" : "video-clip composition-video-source"}`;
    clip.style.left = left;
    clip.style.width = width;
    clip.innerHTML = clipData.mediaKind === "audio"
      ? `<span class="clip-label">${clipData.trackLabel} · ${clipData.title}</span>`
      : `
        ${clipData.image ? `<img src="${clipData.image}" alt="">` : ""}
        <span class="clip-duration-pill">${fmt(Number(clipData.relativeEnd) - Number(clipData.relativeStart))}</span>
        <span class="clip-label">${clipData.trackLabel} · ${clipData.title}</span>
      `;
    clip.addEventListener("click", () => {
      state.currentTime = Number(clipData.relativeStart) || 0;
      if (clipData.sourceType === "scene" && clipData.sceneId) state.selectedId = clipData.sceneId;
      updateTransportUi();
      renderPreview();
      renderTimeline();
      showHud(`${clipData.title} in comp`);
    });
    if (clipData.mediaKind === "audio") els.audioLayer.appendChild(clip);
    else els.videoLayer.appendChild(clip);
  }
}

function spatialPayload() {
  const {
    animationId,
    lastFrameTime,
    ...payload
  } = state.spatial;
  return {
    ...payload,
    activePresetLabel: particlePresets[state.spatial.particlePreset]?.label || "Particle Field",
    matrix: "v2d = Mprojection x Mview x Mmodel x v3d",
    solver: "hook-ready",
    floatingPanels: structuredClone(state.floatingPanels),
  };
}

function spatialModeClassState() {
  const motionActive = state.workspaceMode === "motion" || state.activePanel === "tracking";
  const faceActive = state.workspaceMode === "face" || state.activePanel === "face";
  const textureActive = state.activePanel === "texture";
  document.body.classList.toggle("spatial-mode", isSpatialMode());
  document.body.classList.toggle("motion-mode", motionActive);
  document.body.classList.toggle("face-mode", faceActive);
  document.body.classList.toggle("texture-mode", textureActive);
}

function renderSpatialGraphInto(container) {
  if (!container) return;
  const depthById = {
    global: 0,
    camera: 1,
    particles: 1,
    actor: 1,
    face: 2,
    fixture: 1,
  };
  container.innerHTML = "";
  for (const node of spatialNodes) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `graph-row depth-${depthById[node.id] || 0}${node.id === state.spatial.activeNode ? " active" : ""}`;
    button.innerHTML = `
      <span>${node.icon}</span>
      <strong>${node.title}</strong>
      <em>${node.meta}</em>
    `;
    button.addEventListener("click", () => {
      state.spatial.activeNode = node.id;
      if (node.id === "particles") {
        state.workspaceMode = "particles";
        state.activePanel = "particles";
      } else if (node.id === "face") {
        state.workspaceMode = "face";
        state.activePanel = "face";
      } else if (node.id === "fixture") {
        state.workspaceMode = "3d";
        state.activePanel = "texture";
      } else {
        state.workspaceMode = "3d";
        state.activePanel = "spatial";
        if (node.id === "actor") state.spatial.mesh = "actor";
      }
      render();
      showHud(`${node.title} selected`);
    });
    container.appendChild(button);
  }
}

function renderSpatialGraph() {
  renderSpatialGraphInto(els.spatialGraph);
  renderSpatialGraphInto(els.floatingSceneGraphContent);
}

function floatingPanelElement(key) {
  return els[floatingPanelEls[key]];
}

function clampFloatingPanelState(key) {
  const panel = state.floatingPanels[key];
  const layerWidth = Math.max(320, els.centerPanel?.clientWidth || 960);
  const layerHeight = Math.max(320, els.centerPanel?.clientHeight || 720);
  panel.w = clamp(panel.w, 220, Math.max(240, layerWidth - 12));
  panel.h = clamp(panel.h, 160, Math.max(180, layerHeight - 12));
  panel.x = clamp(panel.x, 6, Math.max(6, layerWidth - panel.w - 6));
  panel.y = clamp(panel.y, 6, Math.max(6, layerHeight - panel.h - 6));
}

function applyFloatingPanelFrame(key) {
  const element = floatingPanelElement(key);
  const panel = state.floatingPanels[key];
  if (!element || !panel) return;
  clampFloatingPanelState(key);
  element.hidden = !panel.open;
  element.style.left = `${Math.round(panel.x)}px`;
  element.style.top = `${Math.round(panel.y)}px`;
  element.style.width = `${Math.round(panel.w)}px`;
  element.style.height = `${Math.round(panel.h)}px`;
  element.style.zIndex = String(state.floatingPanelZ[key] || 1);
}

function bringFloatingPanelToFront(key) {
  if (!state.floatingPanelZ[key]) return;
  state.floatingPanelZ[key] = state.floatingPanelZ.next;
  state.floatingPanelZ.next += 1;
  applyFloatingPanelFrame(key);
}

function renderFloatingParticles() {
  if (!els.floatingParticlesContent) return;
  const operators = [
    ["Vector Fields", state.spatial.particleTurbulence, "particleTurbulence"],
    ["Wind X", state.spatial.particleWindX + 100, "particleWindX"],
    ["Wind Y", state.spatial.particleWindY + 100, "particleWindY"],
    ["Lifetime", state.spatial.particleLifetime, "particleLifetime"],
    ["Drag", state.spatial.particleDrag, "particleDrag"],
  ];
  els.floatingParticlesContent.innerHTML = `
    <div class="floating-preset-grid">
      ${Object.entries(particlePresets).map(([key, preset]) => `
        <button class="floating-preset-card${key === state.spatial.particlePreset ? " active" : ""}" data-floating-preset="${key}" type="button" style="--preset-a:${preset.colorA};--preset-b:${preset.colorB};">
          <strong>${preset.label}</strong>
          <span>${key === "ash" ? "embers / slow fall" : key === "neon" ? "lateral glow" : key === "dust" ? "radial fracture" : "spiral field"}</span>
        </button>
      `).join("")}
    </div>
    <div class="floating-operator-grid">
      ${operators.map(([label, value]) => {
        const normalized = clamp(value, 0, 200);
        const level = label.startsWith("Wind") ? normalized / 2 : normalized;
        return `
          <div class="floating-operator">
            <span>${label}</span>
            <i style="--level:${clamp(level, 0, 100)}%"></i>
            <b>${label.startsWith("Wind") ? (value - 100).toFixed(0) : Number(value).toFixed(0)}</b>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function nodeGraphAction(nodeId) {
  if (nodeId === "fixture") previewTextureFixture();
  else if (nodeId === "track") previewMotionTrack();
  else if (nodeId === "particles") setWorkspaceMode("particles");
  else if (nodeId === "face") previewFaceTopology();
  else if (nodeId === "master") setWorkspaceMode("vfx");
  else setPanel("inspector");
}

function activeNodeGraphId() {
  if (state.activePanel === "texture") return "fixture";
  if (state.activePanel === "tracking") return "track";
  if (state.activePanel === "face") return "face";
  if (state.activePanel === "particles") return "particles";
  if (state.activePanel === "vfx") return "master";
  return "plate";
}

function renderFloatingNodeGraph() {
  if (!els.floatingNodeGraphContent) return;
  const byId = new Map(nodeGraphNodes.map((node) => [node.id, node]));
  const paths = nodeGraphLinks.map(([from, to]) => {
    const a = byId.get(from);
    const b = byId.get(to);
    if (!a || !b) return "";
    const ax = a.x + 136;
    const ay = a.y + 28;
    const bx = b.x;
    const by = b.y + 28;
    const mid = (bx - ax) * 0.5;
    return `<path d="M ${ax} ${ay} C ${ax + mid} ${ay}, ${bx - mid} ${by}, ${bx} ${by}" />`;
  }).join("");
  const activeId = activeNodeGraphId();
  els.floatingNodeGraphContent.innerHTML = `
    <svg class="node-wire" viewBox="0 0 680 248" aria-hidden="true">${paths}</svg>
    ${nodeGraphNodes.map((node) => `
      <button class="node-card${node.id === activeId ? " active" : ""}" data-node-action="${node.id}" type="button" style="left:${node.x}px;top:${node.y}px;">
        <strong>${node.title}</strong>
        <span>${node.meta}</span>
      </button>
    `).join("")}
  `;
}

function renderFloatingPanels() {
  renderFloatingParticles();
  renderFloatingNodeGraph();
  for (const key of Object.keys(state.floatingPanels)) applyFloatingPanelFrame(key);
}

function resetFloatingPanel(key) {
  state.floatingPanels[key] = { ...floatingPanelDefaults[key], open: true };
  applyFloatingPanelFrame(key);
  showHud(`${titleCase(key)} panel reset`);
}

function openFloatingPanelsForMode(mode) {
  if (mode === "3d" || mode === "motion" || mode === "face") {
    state.floatingPanels.sceneGraph.open = true;
    state.floatingPanels.nodeGraph.open = true;
  }
  if (mode === "particles") {
    state.floatingPanels.sceneGraph.open = true;
    state.floatingPanels.particles.open = true;
    state.floatingPanels.nodeGraph.open = true;
  }
}

function showAllFloatingPanels() {
  for (const key of Object.keys(state.floatingPanels)) state.floatingPanels[key].open = true;
  renderFloatingPanels();
  showHud("Floating panels shown");
}

function beginFloatingPanelInteraction(event, key, mode) {
  const panel = state.floatingPanels[key];
  if (!panel || event.button > 0) return;
  event.preventDefault();
  const start = {
    x: panel.x,
    y: panel.y,
    w: panel.w,
    h: panel.h,
    pointerX: event.clientX,
    pointerY: event.clientY,
  };
  state.floatingPanelInteraction = { key, mode, start };
  document.body.classList.toggle("is-dragging-floating", mode === "drag");
  document.body.classList.toggle("is-resizing-floating", mode === "resize");

  function move(pointerEvent) {
    const interaction = state.floatingPanelInteraction;
    if (!interaction || interaction.key !== key) return;
    const dx = pointerEvent.clientX - start.pointerX;
    const dy = pointerEvent.clientY - start.pointerY;
    if (mode === "drag") {
      panel.x = start.x + dx;
      panel.y = start.y + dy;
    } else {
      panel.w = start.w + dx;
      panel.h = start.h + dy;
    }
    applyFloatingPanelFrame(key);
  }

  function stop() {
    document.body.classList.remove("is-dragging-floating", "is-resizing-floating");
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", stop);
    document.removeEventListener("pointercancel", stop);
    state.floatingPanelInteraction = null;
    showHud(mode === "drag" ? "Floating panel moved" : "Floating panel resized");
  }

  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", stop);
  document.addEventListener("pointercancel", stop);
}

function renderSpatialTelemetry() {
  const preset = particlePresets[state.spatial.particlePreset]?.label || "Particle Field";
  const fps = Number(state.spatial.fps || 0).toFixed(1);
  const solver = state.activePanel === "tracking"
    ? `Tracking hook ${state.spatial.trackingConfidence}%`
    : state.activePanel === "face"
      ? `Face mesh blend ${state.spatial.faceBlend}%`
      : state.activePanel === "texture"
        ? `Fixture maps ${state.spatial.textureNormal}%`
        : `${preset}`;
  if (els.spatialFps) els.spatialFps.textContent = `FPS ${fps}`;
  if (els.spatialGpu) els.spatialGpu.textContent = `${state.spatial.runtime}`;
  if (els.spatialSolver) els.spatialSolver.textContent = solver;
  if (els.spatialTelemetry) els.spatialTelemetry.textContent = `${fps} fps / ${state.spatial.shading}`;
  if (els.spatialGraphStatus) els.spatialGraphStatus.textContent = state.spatial.runtime.replace("Canvas ", "");
  if (els.trackingRigStatus) els.trackingRigStatus.textContent = state.activePanel === "tracking"
    ? `Skel_Track_01 preview ${state.spatial.trackingConfidence}%`
    : "Skel_Track_01 idle";
  if (els.trackingMatrixStatus) {
    els.trackingMatrixStatus.textContent = `${state.spatial.focal}mm / depth ${state.spatial.trackingDepth}`;
  }
}

function renderSpatialControls() {
  spatialModeClassState();
  if (els.spatialTransformInput) els.spatialTransformInput.value = state.spatial.transformMode;
  if (els.spatialMeshInput) els.spatialMeshInput.value = state.spatial.mesh;
  if (els.spatialXInput) els.spatialXInput.value = state.spatial.x;
  if (els.spatialYInput) els.spatialYInput.value = state.spatial.y;
  if (els.spatialZInput) els.spatialZInput.value = state.spatial.z;
  if (els.spatialFocalInput) els.spatialFocalInput.value = state.spatial.focal;
  if (els.particleWindXInput) els.particleWindXInput.value = state.spatial.particleWindX;
  if (els.particleWindYInput) els.particleWindYInput.value = state.spatial.particleWindY;
  if (els.particleTurbulenceInput) els.particleTurbulenceInput.value = state.spatial.particleTurbulence;
  if (els.particleLifetimeInput) els.particleLifetimeInput.value = state.spatial.particleLifetime;
  if (els.particleDragInput) els.particleDragInput.value = state.spatial.particleDrag;
  if (els.trackingConfidenceInput) els.trackingConfidenceInput.value = state.spatial.trackingConfidence;
  if (els.trackingDepthInput) els.trackingDepthInput.value = state.spatial.trackingDepth;
  if (els.faceYawInput) els.faceYawInput.value = state.spatial.faceYaw;
  if (els.facePitchInput) els.facePitchInput.value = state.spatial.facePitch;
  if (els.faceBlendInput) els.faceBlendInput.value = state.spatial.faceBlend;
  if (els.textureSeamInput) els.textureSeamInput.value = state.spatial.textureSeam;
  if (els.textureNormalInput) els.textureNormalInput.value = state.spatial.textureNormal;
  if (els.textureRoughnessInput) els.textureRoughnessInput.value = state.spatial.textureRoughness;

  for (const button of els.spatialToolbar?.querySelectorAll("button[data-shading]") || []) {
    button.classList.toggle("active", button.dataset.shading === state.spatial.shading);
  }
  for (const button of els.particlePresetGrid?.querySelectorAll("button[data-preset]") || []) {
    button.classList.toggle("active", button.dataset.preset === state.spatial.particlePreset);
  }

  const x = 50 + state.spatial.x * 0.16;
  const y = 50 - state.spatial.y * 0.14;
  if (els.spatialGizmo) {
    els.spatialGizmo.style.left = `${clamp(x, 20, 80)}%`;
    els.spatialGizmo.style.top = `${clamp(y, 20, 80)}%`;
  }
  if (els.faceTopology) {
    els.faceTopology.style.setProperty("--face-yaw", `${state.spatial.faceYaw}deg`);
    els.faceTopology.style.setProperty("--face-pitch", `${state.spatial.facePitch}deg`);
    els.faceTopology.style.opacity = String(clamp(state.spatial.faceBlend / 100, 0.28, 1));
  }
  if (els.spatialFallback) {
    const preset = particlePresets[state.spatial.particlePreset] || particlePresets.ash;
    els.spatialFallback.style.setProperty("--spatial-x", `${state.spatial.x * 1.4}px`);
    els.spatialFallback.style.setProperty("--spatial-y", `${state.spatial.y * -1.1}px`);
    els.spatialFallback.style.setProperty("--face-yaw", `${state.spatial.faceYaw}deg`);
    els.spatialFallback.style.setProperty("--face-pitch", `${state.spatial.facePitch}deg`);
    els.spatialFallback.style.setProperty("--particle-a", preset.colorA);
    els.spatialFallback.style.setProperty("--particle-b", preset.colorB);
  }
  if (els.particleTrackingOverlay) {
    const preset = particlePresets[state.spatial.particlePreset] || particlePresets.ash;
    els.particleTrackingOverlay.style.setProperty("--particle-a", preset.colorA);
    els.particleTrackingOverlay.style.setProperty("--particle-b", preset.colorB);
    els.particleTrackingOverlay.style.opacity = String(clamp(0.3 + state.spatial.particleTurbulence / 120, 0.3, 0.95));
  }
  if (els.trackingOverlay) {
    els.trackingOverlay.style.transform = `translate(${state.spatial.x * 0.16}%, ${state.spatial.y * -0.12}%)`;
  }
  renderSpatialTelemetry();
}

function resizeSpatialViewport() {
  const canvas = els.spatialViewport;
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return null;
  if (typeof canvas.getContext !== "function") {
    state.spatial.runtime = "CSS spatial fallback";
    document.body.classList.add("spatial-canvas-fallback");
    document.body.classList.remove("spatial-canvas-ok");
    return null;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    state.spatial.runtime = "CSS spatial fallback";
    document.body.classList.add("spatial-canvas-fallback");
    document.body.classList.remove("spatial-canvas-ok");
    return null;
  }
  state.spatial.runtime = "Canvas WebGL fallback";
  document.body.classList.add("spatial-canvas-ok");
  document.body.classList.remove("spatial-canvas-fallback");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function drawSpatialGrid(ctx, width, height, time) {
  const horizon = height * 0.54;
  ctx.save();
  ctx.strokeStyle = "rgba(0, 229, 255, 0.16)";
  ctx.lineWidth = 1;
  for (let i = -8; i <= 8; i += 1) {
    const x = width / 2 + i * width * 0.07 + state.spatial.x * 0.6;
    ctx.beginPath();
    ctx.moveTo(width / 2 + state.spatial.x * 0.7, horizon);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let i = 0; i < 11; i += 1) {
    const y = horizon + Math.pow(i / 10, 1.7) * height * 0.46;
    ctx.globalAlpha = 0.22 + i * 0.028;
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(time + i) * 1.5);
    ctx.lineTo(width, y + Math.sin(time + i) * 1.5);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSkeletonRig(ctx, width, height, time) {
  const rigs = [
    { x: 0.5, y: 0.42, s: 1, alpha: 0.82 },
    { x: 0.31, y: 0.46, s: 0.76, alpha: 0.68 },
    { x: 0.7, y: 0.47, s: 0.68, alpha: 0.6 },
    { x: 0.83, y: 0.51, s: 0.5, alpha: 0.46 },
  ];
  ctx.save();
  for (const rig of rigs) {
    const cx = width * rig.x + state.spatial.x * 0.9;
    const cy = height * rig.y - state.spatial.y * 0.5;
    const scale = rig.s * clamp(1 + (state.spatial.z + 54) / 280, 0.74, 1.18);
    const sway = state.access.reduceMotion ? 0 : Math.sin(time * 1.2 + rig.x * 8) * 1.8;
    ctx.save();
    ctx.translate(cx, cy + sway);
    ctx.scale(scale, scale);
    ctx.globalAlpha = rig.alpha;
    ctx.strokeStyle = "rgba(0, 229, 255, 0.88)";
    ctx.fillStyle = "rgba(0, 229, 255, 0.16)";
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.arc(0, -42, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(0, 8);
    ctx.moveTo(-22, -16);
    ctx.lineTo(22, -16);
    ctx.moveTo(-22, -16);
    ctx.lineTo(-32, 16);
    ctx.moveTo(22, -16);
    ctx.lineTo(32, 16);
    ctx.moveTo(0, 8);
    ctx.lineTo(-18, 52);
    ctx.moveTo(0, 8);
    ctx.lineTo(18, 52);
    ctx.stroke();
    if (rig.s > 0.7) {
      ctx.strokeStyle = "rgba(255, 59, 130, 0.8)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-6, -43);
      ctx.lineTo(6, -43);
      ctx.moveTo(-8, -39);
      ctx.lineTo(8, -39);
      ctx.moveTo(-4, -35);
      ctx.lineTo(4, -35);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

function drawActorMesh(ctx, width, height, time) {
  const cx = width * 0.5 + state.spatial.x * 1.4;
  const cy = height * 0.48 - state.spatial.y * 1.1;
  const zScale = clamp(1 + (state.spatial.z + 54) / 220, 0.72, 1.22);
  const sway = state.access.reduceMotion ? 0 : Math.sin(time * 0.8) * 3;
  const wire = state.spatial.shading === "wireframe";
  ctx.save();
  ctx.translate(cx, cy + sway);
  ctx.scale(zScale, zScale);
  ctx.lineWidth = wire ? 1.4 : 1;
  ctx.strokeStyle = wire ? "rgba(0, 229, 255, 0.88)" : "rgba(217, 251, 255, 0.48)";
  ctx.fillStyle = state.spatial.shading === "solid"
    ? "rgba(34, 45, 58, 0.84)"
    : state.spatial.shading === "path"
      ? "rgba(241, 209, 123, 0.2)"
      : "rgba(0, 229, 255, 0.12)";

  ctx.beginPath();
  ctx.ellipse(0, -62, 34, 43, state.spatial.faceYaw * Math.PI / 360, 0, Math.PI * 2);
  if (!wire) ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-48, -12);
  ctx.quadraticCurveTo(0, -33, 48, -12);
  ctx.lineTo(34, 72);
  ctx.lineTo(-34, 72);
  ctx.closePath();
  if (!wire) ctx.fill();
  ctx.stroke();

  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 17, -102);
    ctx.lineTo(i * 11, 72);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-42 + i * 12, -92 + i * 15);
    ctx.lineTo(42 - i * 12, -92 + i * 15);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFaceTopology(ctx, width, height, time) {
  const cx = width * 0.5 + state.spatial.x * 1.4;
  const cy = height * 0.38 - state.spatial.y;
  const blend = clamp(state.spatial.faceBlend / 100, 0.2, 1);
  ctx.save();
  ctx.globalAlpha = blend;
  ctx.translate(cx, cy);
  ctx.rotate(state.spatial.faceYaw * Math.PI / 360);
  ctx.strokeStyle = "rgba(0, 229, 255, 0.62)";
  ctx.fillStyle = "rgba(0, 229, 255, 0.85)";
  ctx.lineWidth = 1;
  for (let row = -3; row <= 4; row += 1) {
    for (let col = -4; col <= 4; col += 1) {
      const px = col * 8 + Math.sin(row * 2 + time) * 1.2;
      const py = row * 8 + Math.cos(col * 2 + time) * 1.1;
      if ((px / 36) ** 2 + (py / 45) ** 2 > 1) continue;
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, 42, 54, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawParticles(ctx, width, height, time) {
  const preset = particlePresets[state.spatial.particlePreset] || particlePresets.ash;
  const count = state.activePanel === "particles" || state.timelineMode === "particles" ? 150 : 90;
  const windX = state.spatial.particleWindX / 100;
  const windY = state.spatial.particleWindY / 100;
  const turbulence = state.spatial.particleTurbulence / 100;
  const lifetime = state.spatial.particleLifetime / 100;
  const drag = state.spatial.particleDrag / 100;
  ctx.save();
  for (let i = 0; i < count; i += 1) {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const phase = seed - Math.floor(seed);
    const drift = state.access.reduceMotion ? phase : (phase + time * preset.speed * (0.28 + lifetime)) % 1;
    const radius = (0.7 + ((i * 17) % 11) / 7) * (1.1 - drag * 0.38);
    const angle = i * 2.399 + time * turbulence;
    const x = width * (0.12 + ((i * 37) % 100) / 124) + Math.sin(angle) * turbulence * 54 + windX * drift * width * 0.32;
    const y = height * (0.12 + drift * 0.78) + Math.cos(angle * 0.7) * turbulence * 34 + windY * drift * height * 0.18;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
    gradient.addColorStop(0, preset.colorA);
    gradient.addColorStop(1, `${preset.colorB}00`);
    ctx.globalAlpha = 0.24 + lifetime * 0.58;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function renderSpatialViewport(now = performance.now()) {
  const viewport = resizeSpatialViewport();
  if (!viewport) {
    renderSpatialTelemetry();
    return;
  }
  const { ctx, width, height } = viewport;
  const time = state.access.reduceMotion ? 0 : now / 1000;
  if (state.spatial.lastFrameTime) {
    const delta = Math.max(1, now - state.spatial.lastFrameTime);
    state.spatial.fps = state.spatial.fps * 0.88 + (1000 / delta) * 0.12;
  }
  state.spatial.lastFrameTime = now;

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, state.spatial.shading === "solid" ? "#10151b" : "#020609");
  bg.addColorStop(0.55, state.spatial.shading === "path" ? "#1f1722" : "#06141a");
  bg.addColorStop(1, "#010203");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  if (state.spatial.shading === "path") {
    const glow = ctx.createRadialGradient(width * 0.58, height * 0.36, 0, width * 0.58, height * 0.36, width * 0.6);
    glow.addColorStop(0, "rgba(241, 209, 123, 0.28)");
    glow.addColorStop(1, "rgba(241, 209, 123, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  drawSpatialGrid(ctx, width, height, time);
  drawSkeletonRig(ctx, width, height, time);
  drawParticles(ctx, width, height, time);
  drawActorMesh(ctx, width, height, time);
  if (state.workspaceMode === "face" || state.activePanel === "face" || state.activePanel === "tracking") {
    drawFaceTopology(ctx, width, height, time);
  }
  if (state.activePanel === "texture") {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = "rgba(241, 209, 123, 0.72)";
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(width * 0.35, height * 0.26, width * 0.3, height * 0.42);
    ctx.fillStyle = "rgba(241, 209, 123, 0.12)";
    ctx.fillRect(width * 0.35, height * 0.26, width * 0.3, height * 0.42);
    ctx.restore();
  }
  renderSpatialTelemetry();
}

function spatialLoop(now) {
  renderSpatialViewport(now);
  state.spatial.animationId = requestAnimationFrame(spatialLoop);
}

function startSpatialLoop() {
  if (state.spatial.animationId) return;
  state.spatial.animationId = requestAnimationFrame(spatialLoop);
}

function stopSpatialLoop() {
  if (!state.spatial.animationId) return;
  cancelAnimationFrame(state.spatial.animationId);
  state.spatial.animationId = null;
}

function renderSpatialStudio() {
  renderSpatialGraph();
  renderSpatialControls();
  if (isSpatialMode()) {
    state.spatial.enabled = true;
    startSpatialLoop();
  } else {
    stopSpatialLoop();
  }
}

function updateSpatial(patch, options = {}) {
  Object.assign(state.spatial, patch);
  state.spatial.enabled = true;
  setDirty();
  renderSpatialControls();
  renderTabs();
  renderInspector();
  renderLayerStack();
  renderSpatialGraph();
  renderFloatingPanels();
  renderSpatialViewport();
  if (options.timeline) renderTimeline();
  if (options.message) showHud(options.message);
}

function previewMotionTrack() {
  state.workspaceMode = "motion";
  state.activePanel = "tracking";
  state.timelineMode = state.timelineMode === "all" ? "tracking" : state.timelineMode;
  state.spatial.activeNode = "actor";
  render();
  setStatus("Motion tracking hook ready / model not installed");
  showHud("Rig preview hook ready");
}

function previewFaceTopology() {
  state.workspaceMode = "face";
  state.activePanel = "face";
  state.spatial.activeNode = "face";
  render();
  setStatus("Face topology preview active");
  showHud("468-point topology preview");
}

function previewTextureFixture() {
  state.workspaceMode = "3d";
  state.activePanel = "texture";
  state.spatial.activeNode = "fixture";
  render();
  setStatus("Texture fixture preview active");
  showHud("Fixture maps preview");
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
  if (els.deleteModeInput) els.deleteModeInput.value = state.editPolicy.deleteMode;
  if (els.duplicatePolicyInput) els.duplicatePolicyInput.value = state.editPolicy.duplicateMode;
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
  if (els.exportSchemaBtn) els.exportSchemaBtn.textContent = state.exporting ? "Schema..." : "Schema";
  if (els.compileRenderBtn) els.compileRenderBtn.textContent = state.exporting ? "Compiling..." : "Compile";
}

function render() {
  applyLayoutState();
  renderScenes();
  renderPreview();
  renderSpatialStudio();
  renderFloatingPanels();
  renderLayerStack();
  renderCompositionStack();
  renderRuntimeComparison();
  renderSchemaPanel();
  renderAuthState();
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
    schemaVersion: PROJECT_SCHEMA_VERSION,
    sourceTimeline: state.project.timeline || null,
    duration: Math.max(...scenes.map((scene) => scene.end)),
    audioPath: state.project.audio.path,
    rubabPath: state.project.rubab.path,
    scenes,
    markers: state.markers,
    keyframes: state.keyframes,
    dynamicTracks: structuredClone(state.dynamicTracks),
    compositions: structuredClone(state.compositions),
    activeCompositionId: state.activeCompositionId,
    editPolicy: structuredClone(state.editPolicy),
    duplicateDecisions: structuredClone(state.duplicateDecisions),
    audioMix: state.audio,
    accessibility: state.access,
    uxNotes: uxNotesPayload(),
    spatial: spatialPayload(),
    layers: {
      order: orderedLayerKeys(),
      visible: state.layerVisibility,
      locked: state.layerLocked,
      dynamic: structuredClone(state.dynamicTracks),
    },
  };
}

function normalizedSceneIdentity(scene, mode = "frame") {
  const value = mode === "title"
    ? `${scene.titleHi || ""} ${scene.titleEn || ""}`
    : scene.imagePath || scene.image || scene.source || scene.frameIndex || "";
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function decisionAction(kind) {
  if (state.editPolicy.duplicateMode === "keep") return "keep";
  if (state.editPolicy.duplicateMode === "collapse" && kind === "adjacent") return "collapse";
  return "mark";
}

function analyzeDuplicateDecisions() {
  const decisions = [];
  const scenes = sortedScenes();
  const addGroupedDecisions = (kind, groups, reason, confidence) => {
    for (const [key, items] of groups.entries()) {
      if (!key || items.length < 2) continue;
      decisions.push({
        id: `${kind}-${decisions.length + 1}`,
        kind,
        action: decisionAction(kind),
        reason,
        key,
        sceneIds: items.map((scene) => scene.id),
        time: Number(items[0].start) || 0,
        confidence,
      });
    }
  };

  const frameGroups = new Map();
  const titleGroups = new Map();
  for (const scene of scenes) {
    const frameKey = normalizedSceneIdentity(scene, "frame");
    if (frameKey) frameGroups.set(frameKey, [...(frameGroups.get(frameKey) || []), scene]);
    const titleKey = normalizedSceneIdentity(scene, "title");
    if (titleKey) titleGroups.set(titleKey, [...(titleGroups.get(titleKey) || []), scene]);
  }
  addGroupedDecisions("frame", frameGroups, "Exact frame source reused", 0.98);
  addGroupedDecisions("title", titleGroups, "Repeated title or reprise candidate", 0.72);

  const sequenceGroups = new Map();
  for (let index = 0; index <= scenes.length - 3; index += 1) {
    const windowScenes = scenes.slice(index, index + 3);
    const sequenceKey = windowScenes.map((scene) => normalizedSceneIdentity(scene, "frame") || normalizedSceneIdentity(scene, "title")).join(">");
    if (!sequenceKey.replace(/>/g, "")) continue;
    sequenceGroups.set(sequenceKey, [...(sequenceGroups.get(sequenceKey) || []), windowScenes]);
  }
  for (const [key, windows] of sequenceGroups.entries()) {
    if (windows.length < 2) continue;
    const firstWindow = windows[0];
    decisions.push({
      id: `sequence-${decisions.length + 1}`,
      kind: "sequence",
      action: state.editPolicy.duplicateMode === "keep" ? "keep" : "mark",
      reason: "Repeated three-shot sequence window",
      key,
      sceneIds: firstWindow.map((scene) => scene.id),
      time: Number(firstWindow[0].start) || 0,
      confidence: 0.82,
    });
  }

  for (let index = 1; index < scenes.length; index += 1) {
    const previous = scenes[index - 1];
    const current = scenes[index];
    const previousKey = normalizedSceneIdentity(previous, "frame");
    const currentKey = normalizedSceneIdentity(current, "frame");
    if (!previousKey || previousKey !== currentKey) continue;
    decisions.push({
      id: `adjacent-${decisions.length + 1}`,
      kind: "adjacent",
      action: decisionAction("adjacent"),
      reason: "Adjacent exact frame repeat",
      key: currentKey,
      sceneIds: [previous.id, current.id],
      time: Number(current.start) || 0,
      confidence: 1,
    });
  }

  return decisions;
}

function markDuplicateDecisions(decisions) {
  const existingManual = state.markers.filter((marker) => marker.kind !== "duplicate");
  const pins = decisions
    .filter((decision) => decision.action !== "keep")
    .map((decision, index) => ({
      id: `dupe-${decision.id}`,
      time: roundTime(decision.time),
      label: `D${index + 1}`,
      kind: "duplicate",
      decisionId: decision.id,
    }));
  state.markers = [...existingManual, ...pins];
}

function removeRangeArtifacts(start, end) {
  const inRange = (time) => Number(time) >= start && Number(time) < end;
  state.markers = state.markers.filter((marker) => !inRange(marker.time));
  state.keyframes = state.keyframes.filter((keyframe) => !inRange(keyframe.time));
  state.uxNotes = state.uxNotes.filter((note) => !inRange(note.time));
  state.compositions = state.compositions.filter((composition) => Number(composition.end) <= start || Number(composition.start) >= end);
  if (!state.compositions.some((composition) => composition.id === state.activeCompositionId)) state.activeCompositionId = null;
  if (!state.compositions.some((composition) => composition.id === state.selectedCompositionId)) state.selectedCompositionId = state.compositions[0]?.id || null;
}

function shiftTimelineAfter(afterTime, amount, options = {}) {
  const threshold = Number(afterTime) || 0;
  const shiftItem = (item) => {
    item.start = roundTime(Math.max(0, Number(item.start) + amount));
    item.end = roundTime(Math.max(item.start + MIN_SCENE_SECONDS, Number(item.end) + amount));
  };
  if (options.scenes !== false) {
    for (const scene of state.scenes) {
      if (Number(scene.start) >= threshold) shiftItem(scene);
    }
  }
  for (const track of state.dynamicTracks) {
    if (options.trackId && track.id !== options.trackId) continue;
    if (track.locked && options.ignoreLocks !== true) continue;
    for (const clip of track.clips) {
      if (Number(clip.start) >= threshold) shiftItem(clip);
    }
  }
  for (const marker of state.markers) {
    if (Number(marker.time) >= threshold) marker.time = roundTime(Math.max(0, Number(marker.time) + amount));
  }
  for (const keyframe of state.keyframes) {
    if (Number(keyframe.time) >= threshold) keyframe.time = roundTime(Math.max(0, Number(keyframe.time) + amount));
  }
  for (const note of state.uxNotes) {
    if (Number(note.time) >= threshold) note.time = roundTime(Math.max(0, Number(note.time) + amount));
  }
  for (const composition of state.compositions) {
    if (Number(composition.start) >= threshold) {
      composition.start = roundTime(Math.max(0, Number(composition.start) + amount));
      composition.end = roundTime(Math.max(composition.start + MIN_SCENE_SECONDS, Number(composition.end) + amount));
    }
  }
  if (state.currentTime >= threshold) {
    state.currentTime = roundTime(Math.max(0, state.currentTime + amount));
  }
}

function removeOverlappingDynamicClips(start, end) {
  for (const track of state.dynamicTracks) {
    if (track.locked) continue;
    track.clips = track.clips.filter((clip) => Number(clip.end) <= start || Number(clip.start) >= end);
  }
}

function closeGapAfterScene(scene) {
  const next = sceneAfter(scene);
  if (!scene || !next) return 0;
  const gap = roundTime(Math.max(0, Number(next.start) - Number(scene.end)));
  if (gap <= 0) return 0;
  shiftTimelineAfter(Number(next.start), -gap);
  return gap;
}

function deleteSceneByMode(scene, mode = state.editPolicy.deleteMode) {
  if (!scene || state.scenes.length <= 1 || state.layerLocked.video) return false;
  const start = Number(scene.start) || 0;
  const end = Number(scene.end) || start;
  const duration = roundTime(Math.max(0, end - start));
  const nextSceneId = sceneAfter(scene)?.id;
  if (mode === "gap") {
    const gap = closeGapAfterScene(scene);
    if (gap <= 0) showHud("No gap after selected scene");
    return gap > 0;
  }
  if (mode === "cascade") {
    removeRangeArtifacts(start, end);
    removeOverlappingDynamicClips(start, end);
  }
  state.scenes = state.scenes.filter((item) => item.id !== scene.id);
  if (mode === "ripple" || mode === "cascade") {
    shiftTimelineAfter(end, -duration);
  }
  state.selectedId = nextSceneId || sortedScenes()[0]?.id || null;
  state.selectedClipRefs = state.selectedClipRefs.filter((ref) => ref.type !== "scene" || ref.id !== scene.id);
  return true;
}

function closeGapAfterDynamicClip(track, clip) {
  if (!track || !clip) return 0;
  const next = track.clips
    .filter((item) => Number(item.start) >= Number(clip.end))
    .sort((a, b) => Number(a.start) - Number(b.start))[0];
  if (!next) return 0;
  const gap = roundTime(Math.max(0, Number(next.start) - Number(clip.end)));
  if (gap <= 0) return 0;
  shiftTimelineAfter(Number(next.start), -gap, { scenes: false, trackId: track.id });
  return gap;
}

function deleteDynamicClipByMode(ref, mode = state.editPolicy.deleteMode) {
  const { track, clip } = dynamicClipByRef(ref);
  if (!track || !clip || track.locked) return false;
  const start = Number(clip.start) || 0;
  const end = Number(clip.end) || start;
  const duration = roundTime(Math.max(0, end - start));
  if (mode === "gap") {
    const gap = closeGapAfterDynamicClip(track, clip);
    if (gap <= 0) showHud("No gap after selected clip");
    return gap > 0;
  }
  if (mode === "cascade") {
    removeRangeArtifacts(start, end);
    removeOverlappingDynamicClips(start, end);
    shiftTimelineAfter(end, -duration, { scenes: false });
  } else {
    track.clips = track.clips.filter((item) => item.id !== clip.id);
    if (mode === "ripple") shiftTimelineAfter(end, -duration, { scenes: false, trackId: track.id });
  }
  state.selectedClipRefs = state.selectedClipRefs.filter((item) => clipRefKey(item) !== clipRefKey(ref));
  state.selectedTrackId = track.id;
  return true;
}

function selectedSceneRefsForDelete() {
  const refs = state.selectedClipRefs.filter((ref) => ref.type === "scene");
  if (refs.length) return refs;
  return state.selectedId ? [{ type: "scene", id: state.selectedId }] : [];
}

function deleteSelectedTimelineItems(mode = state.editPolicy.deleteMode) {
  if (activeComposition()) {
    showHud("Return to Master before deleting timeline clips");
    return;
  }
  const dynamicRefs = state.selectedClipRefs.filter((ref) => ref.type === "dynamic");
  let changed = false;
  if (dynamicRefs.length) {
    for (const ref of dynamicRefs) changed = deleteDynamicClipByMode(ref, mode) || changed;
  } else {
    const scenes = selectedSceneRefsForDelete()
      .map((ref) => state.scenes.find((scene) => scene.id === ref.id))
      .filter(Boolean)
      .sort((a, b) => Number(b.start) - Number(a.start));
    for (const scene of scenes) changed = deleteSceneByMode(scene, mode) || changed;
  }
  if (!changed) {
    showHud("Nothing deleted");
    return;
  }
  if (!state.scenes.some((scene) => scene.id === state.selectedId)) {
    state.selectedId = sortedScenes()[0]?.id || null;
  }
  state.duplicateDecisions = analyzeDuplicateDecisions();
  setDirty();
  render();
  showHud(`${titleCase(mode)} delete applied`);
}

function collapseAdjacentDuplicateScenes(decisions) {
  let changed = false;
  const adjacent = decisions
    .filter((decision) => decision.kind === "adjacent" && decision.action === "collapse")
    .sort((a, b) => b.time - a.time);
  for (const decision of adjacent) {
    const [, duplicateId] = decision.sceneIds;
    const scene = state.scenes.find((item) => item.id === duplicateId);
    if (scene) changed = deleteSceneByMode(scene, "ripple") || changed;
  }
  return changed;
}

function applyDuplicatePolicy() {
  const decisions = analyzeDuplicateDecisions();
  state.duplicateDecisions = decisions;
  if (!decisions.length) {
    renderTimeline();
    showHud("No duplicate frames or repeated sequences found");
    return;
  }
  if (state.editPolicy.duplicateMode === "keep") {
    renderTimeline();
    showHud(`${decisions.length} duplicate decisions kept`);
    return;
  }
  if (state.editPolicy.duplicateMode === "collapse") {
    const collapsed = collapseAdjacentDuplicateScenes(decisions);
    if (!collapsed) {
      markDuplicateDecisions(decisions);
      showHud("No adjacent exact duplicate to collapse; marked instead");
    } else {
      state.duplicateDecisions = analyzeDuplicateDecisions();
      showHud("Adjacent duplicate frames collapsed");
    }
  } else {
    markDuplicateDecisions(decisions);
    showHud(`${decisions.length} duplicate decisions marked`);
  }
  setDirty();
  render();
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
  for (const lane of [els.videoLayer, els.overlayLayer, els.vfxLayer, els.threeLayer, els.trackingLayer, els.particlesLayer, els.captionLayer]) {
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

async function exportSchemaManifest() {
  state.exporting = true;
  renderExportState();
  setStatus("Exporting schema...");
  els.lastExportLink.hidden = true;
  try {
    const payload = {
      ...getProjectExportPayload(),
      exportMode: "manifest",
    };
    const response = await fetch("/api/export/schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || "Schema export failed");
    els.lastExportLink.href = result.schemaUrl;
    els.lastExportLink.hidden = false;
    els.lastExportLink.textContent = "Open export schema";
    setStatus(`Schema exported ${result.exportName}`);
  } catch (error) {
    setStatus(`Schema export failed: ${error.message}`);
  } finally {
    state.exporting = false;
    renderExportState();
  }
}

// ---- Real-time render telemetry HUD (frontend step 3) ----
// Streams the server's /api/v1/telemetry (CPU, GPU where available via
// nvidia-smi, viewport render-loop fps) into a live overlay while the manifest
// compiles, then folds in the authoritative post-encode -14 LUFS verification
// returned by the renderer report.
const renderTelemetryState = { timer: null, rafActive: false, uiFps: 0 };

function ensureTelemetryHud() {
  let hud = document.getElementById("renderTelemetryHud");
  if (hud) return hud;
  hud = document.createElement("div");
  hud.id = "renderTelemetryHud";
  hud.setAttribute("aria-live", "polite");
  hud.style.cssText =
    "position:fixed;right:14px;bottom:14px;z-index:9999;min-width:250px;padding:12px 14px;" +
    "border-radius:12px;background:rgba(18,20,28,0.95);border:1px solid #2a2f3e;color:#e7e9f0;" +
    "font:12px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
    "box-shadow:0 12px 40px rgba(0,0,0,0.55);display:none";
  if (document.body) document.body.appendChild(hud);
  return hud;
}

function startUiFpsMeter() {
  if (renderTelemetryState.rafActive) return;
  renderTelemetryState.rafActive = true;
  let frames = 0;
  let last = typeof performance !== "undefined" ? performance.now() : Date.now();
  const loop = (now) => {
    frames += 1;
    if (now - last >= 500) {
      renderTelemetryState.uiFps = Math.round((frames * 1000) / (now - last));
      frames = 0;
      last = now;
    }
    if (renderTelemetryState.rafActive) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function stopUiFpsMeter() {
  renderTelemetryState.rafActive = false;
}

function paintTelemetry(data, phase) {
  const hud = ensureTelemetryHud();
  hud.style.display = "block";
  if (!data) {
    hud.innerHTML = `<b>Render telemetry</b><div>${phase || "starting…"}</div>`;
    return;
  }
  const host = data.host || {};
  const gpu = data.gpu || {};
  const loop = data.renderLoop || {};
  const loud = data.loudness && data.loudness.status === "ok" ? data.loudness : null;
  const gpuLine = gpu.status === "ok" && Array.isArray(gpu.gpus) && gpu.gpus[0]
    ? `${gpu.gpus[0].name} · ${gpu.gpus[0].memUsagePct}% VRAM · ${gpu.gpus[0].utilizationPct}% util`
    : `${gpu.status || "n/a"}`;
  const rows = [
    `<b>Render telemetry${phase ? " · " + phase : ""}</b>`,
    `<div>CPU ${host.cpuUsagePct ?? "–"}% · MEM ${host.memUsagePct ?? "–"}%</div>`,
    `<div>GPU ${gpuLine}</div>`,
    `<div>Viewport ${loop.fps ?? "–"} fps (${loop.status || "–"})</div>`,
  ];
  if (loud) {
    rows.push(`<div>Master ${loud.integratedLUFS} LUFS · ${loud.conforms ? "conforms −14 LUFS" : loud.verdict}</div>`);
  }
  hud.innerHTML = rows.join("");
}

async function pollTelemetryOnce() {
  const query = new URLSearchParams({ loopFps: String(renderTelemetryState.uiFps || 0), loopTarget: "60" });
  const response = await fetch(`/api/v1/telemetry?${query.toString()}`);
  return response.json();
}

function startTelemetryStream() {
  startUiFpsMeter();
  paintTelemetry(null, "compiling");
  const tick = async () => {
    try {
      paintTelemetry(await pollTelemetryOnce(), "compiling");
    } catch (telemetryError) {
      /* transient poll failure — keep streaming */
    }
  };
  tick();
  renderTelemetryState.timer = setInterval(tick, 1000);
}

async function stopTelemetryStream(report) {
  if (renderTelemetryState.timer) {
    clearInterval(renderTelemetryState.timer);
    renderTelemetryState.timer = null;
  }
  stopUiFpsMeter();
  let snapshot = null;
  try {
    snapshot = await pollTelemetryOnce();
  } catch (telemetryError) {
    snapshot = null;
  }
  if (snapshot && report && report.audioMix && report.audioMix.outputLoudness) {
    snapshot.loudness = report.audioMix.outputLoudness;
  }
  paintTelemetry(snapshot, report ? "complete" : "failed");
}

async function compileSchemaRender() {
  state.exporting = true;
  renderExportState();
  setStatus("Compiling manifest renderer preview...");
  els.lastExportLink.hidden = true;
  startTelemetryStream();
  let compiledReport = null;
  try {
    const payload = {
      ...getProjectExportPayload(),
      exportMode: "manifest",
    };
    const schemaResponse = await fetch("/api/export/schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const schemaResult = await schemaResponse.json();
    if (!schemaResult.ok) throw new Error(schemaResult.error || "Schema export failed");

    const compileResponse = await fetch("/api/v1/render/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manifest: schemaResult.schema,
        profile: "preview",
        width: 1280,
        height: 720,
        fps: 24,
        maxDurationSec: 30,
      }),
    });
    const compileResult = await compileResponse.json();
    if (!compileResult.ok) throw new Error(compileResult.error || "Renderer compile failed");
    compiledReport = compileResult.report || null;
    els.lastExportLink.href = compileResult.videoUrl;
    els.lastExportLink.hidden = false;
    els.lastExportLink.textContent = "Open compiled preview";
    const loud = compiledReport && compiledReport.audioMix && compiledReport.audioMix.outputLoudness;
    const loudNote = loud && loud.status === "ok" ? ` · ${loud.integratedLUFS} LUFS` : "";
    setStatus(`Renderer compiled ${compileResult.report.renderId}${loudNote}`);
  } catch (error) {
    setStatus(`Renderer compile failed: ${error.message}`);
  } finally {
    await stopTelemetryStream(compiledReport);
    state.exporting = false;
    renderExportState();
  }
}

function setWorkspaceMode(mode) {
  state.workspaceMode = mode;
  const panelByMode = {
    edit: "inspector",
    audio: "audio",
    vfx: "vfx",
    accessibility: "accessibility",
    "3d": "spatial",
    particles: "particles",
    motion: "tracking",
    face: "face",
  };
  state.activePanel = panelByMode[mode] || state.activePanel;
  if (mode === "3d") state.spatial.activeNode = state.spatial.mesh === "face" ? "face" : "actor";
  if (mode === "particles") state.spatial.activeNode = "particles";
  if (mode === "motion") state.spatial.activeNode = "actor";
  if (mode === "face") state.spatial.activeNode = "face";
  openFloatingPanelsForMode(mode);
  setStatus(`${mode} workspace`);
  render();
  showHud(`${titleCase(mode)} workspace`);
}

function setPanel(panel) {
  state.activePanel = panel;
  if (els.rightScroll) els.rightScroll.scrollTop = 0;
  const modeByPanel = {
    spatial: "3d",
    particles: "particles",
    tracking: "motion",
    face: "face",
    texture: "3d",
  };
  if (modeByPanel[panel]) state.workspaceMode = modeByPanel[panel];
  if (panel === "particles") state.spatial.activeNode = "particles";
  if (panel === "tracking") state.spatial.activeNode = "actor";
  if (panel === "face") state.spatial.activeNode = "face";
  if (panel === "texture") state.spatial.activeNode = "fixture";
  if (modeByPanel[panel]) openFloatingPanelsForMode(modeByPanel[panel]);
  renderTabs();
  renderInspector();
  renderSpatialStudio();
  renderLayerStack();
  renderCompositionStack();
  renderRuntimeComparison();
  renderSchemaPanel();
  renderAuthState();
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
  const panelByMode = {
    audio: "audio",
    vfx: "vfx",
    captions: "accessibility",
    "3d": "spatial",
    particles: "particles",
    tracking: "tracking",
  };
  const workspaceByMode = {
    "3d": "3d",
    particles: "particles",
    tracking: "motion",
  };
  if (panelByMode[mode]) state.activePanel = panelByMode[mode];
  if (workspaceByMode[mode]) state.workspaceMode = workspaceByMode[mode];
  if (mode === "3d") state.spatial.activeNode = "actor";
  if (mode === "particles") state.spatial.activeNode = "particles";
  if (mode === "tracking") state.spatial.activeNode = "actor";
  if (workspaceByMode[mode]) openFloatingPanelsForMode(workspaceByMode[mode]);
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

function setDeleteMode(mode) {
  if (!["static", "ripple", "cascade", "gap"].includes(mode)) return;
  state.editPolicy.deleteMode = mode;
  setDirty();
  renderToolState();
  updateTransportUi();
  showHud(`${titleCase(mode)} delete mode`);
}

function setDuplicateMode(mode) {
  if (!["smart", "keep", "mark", "collapse"].includes(mode)) return;
  state.editPolicy.duplicateMode = mode;
  state.duplicateDecisions = analyzeDuplicateDecisions();
  setDirty();
  renderToolState();
  updateTransportUi();
  showHud(`${titleCase(mode)} duplicate policy`);
}

function commandActions() {
  return [
    { label: "Play or pause", shortcut: "Space", run: togglePlayback },
    { label: "Split scene at playhead", shortcut: "B", run: splitSceneAtPlayhead },
    { label: "Add marker", shortcut: "M", run: () => addMarker("Command marker", "manual") },
    { label: "Add or cycle transition", shortcut: "T", run: cycleTransition },
    { label: "Make composition from selected clips", shortcut: "Comp", run: createCompositionFromSelection },
    { label: "Open selected composition", shortcut: "Open Comp", run: () => openComposition() },
    { label: "Return to master timeline", shortcut: "Master", run: closeCompositionTimeline },
    { label: "Delete selected using current mode", shortcut: "Delete", run: () => deleteSelectedTimelineItems() },
    { label: "Set delete mode static", run: () => setDeleteMode("static") },
    { label: "Set delete mode ripple", run: () => setDeleteMode("ripple") },
    { label: "Set delete mode cascade", run: () => setDeleteMode("cascade") },
    { label: "Set delete mode gap", run: () => setDeleteMode("gap") },
    { label: "Decide duplicate frames and sequences", shortcut: "Dupes", run: applyDuplicatePolicy },
    { label: "Add empty video layer", shortcut: "+V", run: () => createEmptyLayer("video") },
    { label: "Add empty audio layer", shortcut: "+A", run: () => createEmptyLayer("audio") },
    { label: "Nudge selected clip left", shortcut: "-1f", run: () => nudgeSelectedScene(-1) },
    { label: "Nudge selected clip right", shortcut: "+1f", run: () => nudgeSelectedScene(1) },
    { label: "Center selected clip", shortcut: "Zoom Sel", run: fitSelectedClip },
    { label: "Add keyframe", shortcut: "K", run: addKeyframe },
    { label: "Open VFX panel", run: () => setWorkspaceMode("vfx") },
    { label: "Open audio mixer", run: () => setWorkspaceMode("audio") },
    { label: "Open 3D Studio", shortcut: "3D", run: () => setWorkspaceMode("3d") },
    { label: "Open particles gallery", shortcut: "Particles", run: () => setWorkspaceMode("particles") },
    { label: "Preview motion tracking", shortcut: "Track", run: previewMotionTrack },
    { label: "Preview face topology", shortcut: "Face", run: previewFaceTopology },
    { label: "Preview texture fixture", shortcut: "Texture", run: previewTextureFixture },
    { label: "Show floating panels", shortcut: "Panels", run: showAllFloatingPanels },
    { label: "Reset floating panels", shortcut: "Panels reset", run: () => {
      state.floatingPanels = structuredClone(floatingPanelDefaults);
      renderFloatingPanels();
      showHud("Floating panels reset");
    } },
    { label: "Open accessibility panel", run: () => setWorkspaceMode("accessibility") },
    { label: "Show reconstructed storyline", shortcut: "Story", run: openStorylinePanel },
    { label: "Open feature matrix", shortcut: "Matrix", run: () => setPanel("matrix") },
    { label: "Open full schema", shortcut: "Schema", run: () => setPanel("schema") },
    { label: "Open account", shortcut: "Auth", run: () => setPanel("account") },
    { label: "Open plan and license", shortcut: "Plan", run: () => setPanel("plan") },
    { label: "Open project CRUD", shortcut: "Projects", run: () => setPanel("projects") },
    { label: "Save project", shortcut: "Save", run: createSavedProject },
    { label: "Update selected project", shortcut: "Update", run: updateSavedProject },
    { label: "Open composition panel", shortcut: "Comps", run: () => setPanel("compositions") },
    { label: "Compare Electron and Tauri", shortcut: "Runtime", run: () => setPanel("runtime") },
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
    { label: "Export schema manifest", shortcut: "Schema export", run: exportSchemaManifest },
    { label: "Compile schema-native render", shortcut: "Render core", run: compileSchemaRender },
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
  els.authOpenBtn.addEventListener("click", () => setPanel("account"));
  els.planPanelTopBtn.addEventListener("click", () => setPanel("plan"));
  els.projectPanelTopBtn.addEventListener("click", () => setPanel("projects"));
  els.saveProjectTopBtn.addEventListener("click", saveCurrentProject);
  els.loginBtn.addEventListener("click", loginUser);
  els.registerBtn.addEventListener("click", registerUser);
  els.logoutBtn.addEventListener("click", logoutUser);
  els.refreshProjectsBtn.addEventListener("click", () => refreshProjects());
  els.saveProjectBtn.addEventListener("click", createSavedProject);
  els.updateProjectBtn.addEventListener("click", updateSavedProject);
  els.authPasswordInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (els.authNameInput.value.trim()) registerUser();
    else loginUser();
  });
  els.subscriptionPlanGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-plan]");
    if (button) updateSubscription(button.dataset.plan);
  });
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
  window.addEventListener("resize", () => {
    applyLayoutState({ rerenderTimeline: true });
    renderFloatingPanels();
    renderSpatialViewport();
  });
  els.floatingPanelsLayer.addEventListener("click", (event) => {
    const panel = event.target.closest("[data-floating-panel]");
    const key = panel?.dataset.floatingPanel;
    if (!key) return;
    if (event.target.closest("[data-floating-close]")) {
      state.floatingPanels[key].open = false;
      applyFloatingPanelFrame(key);
      showHud(`${titleCase(key)} panel closed`);
      return;
    }
    if (event.target.closest("[data-floating-reset]")) {
      resetFloatingPanel(key);
      return;
    }
    const preset = event.target.closest("[data-floating-preset]");
    if (preset) {
      state.workspaceMode = "particles";
      state.activePanel = "particles";
      updateSpatial({
        particlePreset: preset.dataset.floatingPreset,
        activeNode: "particles",
      }, {
        timeline: true,
        message: particlePresets[preset.dataset.floatingPreset]?.label || "Particle preset",
      });
      return;
    }
    const node = event.target.closest("[data-node-action]");
    if (node) {
      nodeGraphAction(node.dataset.nodeAction);
    }
  });
  els.floatingPanelsLayer.addEventListener("pointerdown", (event) => {
    const panel = event.target.closest("[data-floating-panel]");
    const key = panel?.dataset.floatingPanel;
    if (!key) return;
    if (event.target.closest("button, input, select, textarea")) return;
    bringFloatingPanelToFront(key);
    const rect = panel.getBoundingClientRect();
    const nearResizeCorner = event.clientX >= rect.right - 30 && event.clientY >= rect.bottom - 30;
    if (event.target.closest("[data-floating-resize-handle]") || nearResizeCorner) {
      beginFloatingPanelInteraction(event, key, "resize");
      return;
    }
    if (event.target.closest("[data-floating-drag-handle]")) {
      beginFloatingPanelInteraction(event, key, "drag");
    }
  });
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
  els.makeCompositionBtn.addEventListener("click", createCompositionFromSelection);
  els.makeCompositionPanelBtn.addEventListener("click", createCompositionFromSelection);
  els.openCompositionBtn.addEventListener("click", () => openComposition());
  els.backToMasterBtn.addEventListener("click", closeCompositionTimeline);
  els.runtimeDocBtn.addEventListener("click", () => {
    state.activePanel = "runtime";
    renderInspector();
    renderRuntimeComparison();
    showHud("Electron vs Tauri comparison");
  });
  els.schemaJsonBtn.addEventListener("click", () => {
    downloadBlob("mahavisphot_compositor_schema.json", JSON.stringify(schemaPayload(), null, 2), "application/json");
    showHud("Schema JSON exported");
  });
  els.nudgeLeftBtn.addEventListener("click", () => nudgeSelectedScene(-1));
  els.nudgeRightBtn.addEventListener("click", () => nudgeSelectedScene(1));
  els.rippleBtn.addEventListener("click", rippleScenes);
  els.deleteSelectedBtn.addEventListener("click", () => deleteSelectedTimelineItems());
  els.deleteModeInput.addEventListener("change", () => {
    setDeleteMode(els.deleteModeInput.value);
  });
  els.duplicatePolicyInput.addEventListener("change", () => {
    setDuplicateMode(els.duplicatePolicyInput.value);
  });
  els.applyDuplicatePolicyBtn.addEventListener("click", applyDuplicatePolicy);
  els.fitSelectionBtn.addEventListener("click", fitSelectedClip);
  els.addVideoLayerBtn.addEventListener("click", () => createEmptyLayer("video"));
  els.addAudioLayerBtn.addEventListener("click", () => createEmptyLayer("audio"));
  els.renameLayerBtn.addEventListener("click", renameSelectedLayer);
  els.duplicateLayerBtn.addEventListener("click", duplicateSelectedLayer);
  els.deleteLayerBtn.addEventListener("click", deleteSelectedLayer);

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

  els.spatialToolbar.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-shading]");
    if (!button) return;
    updateSpatial({ shading: button.dataset.shading }, {
      timeline: true,
      message: `${titleCase(button.dataset.shading)} viewport`,
    });
  });
  els.spatialFocusBtn.addEventListener("click", () => setWorkspaceMode("3d"));
  els.spatialTransformInput.addEventListener("change", () => {
    updateSpatial({ transformMode: els.spatialTransformInput.value }, { message: "Transform mode changed" });
  });
  els.spatialMeshInput.addEventListener("change", () => {
    const mesh = els.spatialMeshInput.value;
    updateSpatial({
      mesh,
      activeNode: mesh === "face" ? "face" : mesh === "particles" ? "particles" : "actor",
    }, { timeline: true, message: "Active mesh changed" });
  });
  for (const [input, key, label] of [
    [els.spatialXInput, "x", "Position X"],
    [els.spatialYInput, "y", "Position Y"],
    [els.spatialZInput, "z", "Position Z"],
    [els.spatialFocalInput, "focal", "Focal length"],
    [els.particleWindXInput, "particleWindX", "Wind X"],
    [els.particleWindYInput, "particleWindY", "Wind Y"],
    [els.particleTurbulenceInput, "particleTurbulence", "Turbulence"],
    [els.particleLifetimeInput, "particleLifetime", "Lifetime"],
    [els.particleDragInput, "particleDrag", "Drag"],
    [els.trackingConfidenceInput, "trackingConfidence", "Track confidence"],
    [els.trackingDepthInput, "trackingDepth", "Depth bias"],
    [els.faceYawInput, "faceYaw", "Face yaw"],
    [els.facePitchInput, "facePitch", "Face pitch"],
    [els.faceBlendInput, "faceBlend", "Face blend"],
    [els.textureSeamInput, "textureSeam", "Seam stitch"],
    [els.textureNormalInput, "textureNormal", "Normal depth"],
    [els.textureRoughnessInput, "textureRoughness", "Roughness"],
  ]) {
    input.addEventListener("input", () => updateSpatial({ [key]: Number(input.value) }, { message: `${label} ${input.value}` }));
  }
  els.particlePresetGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-preset]");
    if (!button) return;
    updateSpatial({
      particlePreset: button.dataset.preset,
      activeNode: "particles",
    }, {
      timeline: true,
      message: particlePresets[button.dataset.preset]?.label || "Particle preset",
    });
  });
  els.particleApplyBtn.addEventListener("click", () => {
    state.workspaceMode = "particles";
    state.activePanel = "particles";
    state.timelineMode = "particles";
    updateSpatial({ activeNode: "particles" }, {
      timeline: true,
      message: "Particle pass applied",
    });
  });
  els.trackingPreviewBtn.addEventListener("click", previewMotionTrack);
  els.facePreviewBtn.addEventListener("click", previewFaceTopology);
  els.textureBakeBtn.addEventListener("click", previewTextureFixture);

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
  els.trackCreateRow.addEventListener("dragover", (event) => {
    const target = event.target.closest("[data-create-track-kind]");
    if (!target) return;
    event.preventDefault();
    target.classList.add("drop-ready");
  });
  els.trackCreateRow.addEventListener("dragleave", (event) => {
    const target = event.target.closest("[data-create-track-kind]");
    if (target) target.classList.remove("drop-ready");
  });
  els.trackCreateRow.addEventListener("drop", (event) => {
    const target = event.target.closest("[data-create-track-kind]");
    if (!target) return;
    event.preventDefault();
    target.classList.remove("drop-ready");
    const payload = readDragPayload(event);
    createDynamicTrack(target.dataset.createTrackKind, payload, dropTimeFromEvent(event));
  });
  els.trackCreateRow.addEventListener("click", (event) => {
    const target = event.target.closest("[data-create-track-kind]");
    if (!target) return;
    const kind = target.dataset.createTrackKind;
    const scene = selectedScene();
    const payload = kind === "audio" ? audioClipDragPayload() : sceneDragPayload(scene);
    if (!payload) {
      createDynamicTrack(kind, null, state.currentTime);
      return;
    }
    createDynamicTrack(kind, payload, state.currentTime);
  });
  for (const lane of [els.videoLayer, els.overlayLayer, els.vfxLayer, els.threeLayer, els.trackingLayer, els.particlesLayer, els.captionLayer]) {
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
    if (payload?.type === "dynamic-layer") moveDynamicTrackToEnd(payload.id);
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
    deleteSelectedTimelineItems();
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
    if ((event.key === "Delete" || event.key === "Backspace") && !event.target.closest(".marker-clip, .marker-editor")) {
      event.preventDefault();
      deleteSelectedTimelineItems();
      return;
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
  els.exportSchemaBtn.addEventListener("click", exportSchemaManifest);
  els.compileRenderBtn.addEventListener("click", compileSchemaRender);
  els.exportVideoBtn.addEventListener("click", exportVideo);
  els.loadGeneratedTimelineBtn.addEventListener("click", () => loadFirstGeneratedTimeline());
  els.loadDenseTimelineBtn.addEventListener("click", () => loadDenseShotTimeline());
  els.loadVargTimelineBtn.addEventListener("click", () => loadVargKaKhelTimeline());
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
  state.compositions = [];
  state.nextCompositionId = 1;
  state.activeCompositionId = null;
  state.selectedCompositionId = null;
  state.selectedClipRefs = [];
  state.dynamicTracks = [];
  state.nextDynamicTrackId = 1;
  state.selectedTrackId = null;
  state.duplicateDecisions = [];
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
  ensureDefaultDynamicTracks();
  state.duplicateDecisions = analyzeDuplicateDecisions();
  setStatus(statusText);
  render();
}

async function loadProjectFromTimeline(timelineId = "first-generated", options = {}) {
  let project;
  try {
    const response = await fetch(`/api/project?timeline=${encodeURIComponent(timelineId)}`);
    project = await response.json();
    if (!response.ok || project.ok === false) {
      throw new Error(project.error || "Timeline load failed");
    }
  } catch (error) {
    project = fallbackProject(timelineId);
    if (location.protocol !== "file:") {
      setStatus(`API fallback: ${error.message || error}`);
    }
  }
  const timelineName = project.timeline?.name || "generated timeline";
  applyProject(project, options.statusText || `Loaded ${timelineName}`);
  if (options.hud !== false) showHud(`${timelineName} loaded`);
}

function loadVargKaKhelTimeline() {
  return loadProjectFromTimeline("varg-ka-khel", {
    statusText: "Loaded Varg Ka Khel song edit",
  });
}

async function loadStoryline() {
  try {
    const response = await fetch("reconstructed_storyline.json");
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
  await refreshAuth();
  await loadStoryline();
  await loadProjectFromTimeline("first-generated", { statusText: "Loaded first generated timeline", hud: false });
}

init().catch((error) => {
  setStatus(`Load failed: ${error.message}`);
});
