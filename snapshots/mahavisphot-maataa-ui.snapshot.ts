export type SnapshotStatus = "VERIFIED" | "PREVIEW" | "PLANNED" | "BLOCKED" | "SCAFFOLD";
export type RuntimeReadiness = "ready" | "preview" | "scaffold" | "blocked";
export type CommandDisplayMode = "icon" | "key" | "label" | "icon+key" | "icon+label" | "icon+key+label";

export interface SnapshotFrame {
  index: number;
  title: string;
  status: SnapshotStatus;
  badge: "evidence" | "schema" | "runtime" | "runtime-gate";
  kind: string;
  purpose: string;
  asciiLayout: string;
  phkd: {
    productionReady: false;
    note: string;
  };
}

export interface StudioCommand {
  id: string;
  icon: string;
  key: string;
  winKey?: string;
  label: string;
  group: string;
  status: RuntimeReadiness;
}

export interface RuntimeContract {
  id: string;
  name: string;
  status: RuntimeReadiness;
  purpose: string;
  productionReady: false;
}

export interface MaataaComponentContract {
  id: string;
  name: string;
  status: RuntimeReadiness;
  slots: string[];
  purpose: string;
}

export const COMMAND_DISPLAY_MODES: Record<string, CommandDisplayMode> = {
  icon: "icon",
  key: "key",
  label: "label",
  iconKey: "icon+key",
  iconLabel: "icon+label",
  iconKeyLabel: "icon+key+label",
};

export const MAHAVISPHOT_24_FRAMES: SnapshotFrame[] = [
  {
    index: 1,
    title: "New Project Wizard",
    status: "VERIFIED",
    badge: "schema",
    kind: "wizard",
    purpose: "Create a local Mahavisphot project with type, details, assets, timeline beats, and evidence gate.",
    asciiLayout: `┌──────────────────────────────────────────────┐\n│ NEW PROJECT WIZARD                 Step 1/5  │\n├──────────────┬───────────────────────────────┤\n│ Steps        │ Project Type / Details / Assets│\n│ ① Type       │ 🎬 Film  🎞 VFX  🎵 Audio      │\n│ ② Details    │ Name, language, aspect, fps    │\n│ ③ Assets     │ Frames, audio, script, refs     │\n│ ④ Timeline   │ Beats, duration, markers        │\n│ ⑤ Evidence   │ PHKD gate + create project      │\n├──────────────┴───────────────────────────────┤\n│ [Cancel]                         [Create ▸]  │\n└──────────────────────────────────────────────┘`,
    phkd: { productionReady: false, note: "Creates local schema only; no fake AI/runtime/export readiness." },
  },
  {
    index: 2,
    title: "Launch Studio",
    status: "VERIFIED",
    badge: "evidence",
    kind: "launch",
    purpose: "Project launcher, recent projects, runtime health, evidence/docs/export access.",
    asciiLayout: `┌──────────────────────────────────────────────┐\n│ MAHAVISPHOT LAUNCH STUDIO                    │\n├──────────────┬──────────────┬────────────────┤\n│ New Project  │ Open Project │ Runtime Health │\n│              │              │ GPU  RAM  FPS  │\n├──────────────┴──────────────┴────────────────┤\n│ Recent Projects                               │\n│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │\n│ │ Film A │ │ VFX B  │ │ Audio C│ │ Board D│  │\n│ └────────┘ └────────┘ └────────┘ └────────┘  │\n└──────────────────────────────────────────────┘`,
    phkd: { productionReady: false, note: "Launcher evidence is local; production readiness remains false." },
  },
  {
    index: 3,
    title: "Studio Dashboard",
    status: "PREVIEW",
    badge: "schema",
    kind: "dashboard",
    purpose: "Main media bin, stage, inspector, timeline, layers, transport shell.",
    asciiLayout: `┌──────────────────────────────────────────────┐\n│ STUDIO DASHBOARD                 local/offline│\n├──────────────┬───────────────────┬───────────┤\n│ Media Bin    │ Preview Stage      │ Inspector │\n│ ▣ ▣ ▣ ▣      │ ┌───────────────┐  │ VFX       │\n│ ▣ ▣ ▣ ▣      │ │  current shot │  │ Motion    │\n│ Search...    │ └───────────────┘  │ Captions  │\n├──────────────┴───────────────────┴───────────┤\n│ Timeline: V1 ━━━━━━━  V2 ━━━━━  A1 ≋≋≋≋≋     │\n└──────────────────────────────────────────────┘`,
    phkd: { productionReady: false, note: "Preview shell; not a production renderer claim." },
  },
  {
    index: 4,
    title: "Project OS",
    status: "VERIFIED",
    badge: "evidence",
    kind: "project",
    purpose: "Story beats, assets, evidence, tasks, project status, and notes.",
    asciiLayout: `┌──────────────────────────────────────────────┐\n│ PROJECT OS                                   │\n├──────────────┬──────────────┬────────────────┤\n│ Story Beats  │ Assets       │ Evidence       │\n│ 01 Origin    │ Frames       │ ✓ data         │\n│ 02 Conflict  │ Audio        │ ✓ board        │\n│ 03 Eclipse   │ Captions     │ ✓ export       │\n├──────────────┴──────────────┴────────────────┤\n│ Project Timeline · Tasks · Status · Notes     │\n└──────────────────────────────────────────────┘`,
    phkd: { productionReady: false, note: "Project contract is evidenced, runtime still gated." },
  },
  ...[
    "Timeline Editor", "Compositor", "VFX Studio", "Motion Tracking", "Face Studio", "Digital Makeup",
    "Costume Studio", "Props Studio", "Particle Studio", "3D Studio", "Toon Designer", "Cel Animation",
    "Comic Studio", "Audio Studio", "Color Studio", "XR Studio", "Local AI Mode", "Cloud AI Mode",
    "Hybrid AI Mode", "Render Observatory"
  ].map((title, offset): SnapshotFrame => {
    const index = offset + 5;
    const blocked = title.includes("AI Mode") || title === "VFX Studio" || title === "Motion Tracking";
    const planned = ["Face Studio", "Digital Makeup", "Costume Studio", "Props Studio", "Comic Studio", "XR Studio"].includes(title);
    const verified = title === "Render Observatory";
    return {
      index,
      title,
      status: blocked ? "BLOCKED" : planned ? "PLANNED" : verified ? "VERIFIED" : "PREVIEW",
      badge: blocked ? "runtime-gate" : verified ? "evidence" : "schema",
      kind: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      purpose: `${title} frame contract for the Mahavisphot all-frames board.`,
      asciiLayout: `┌──────────────────────────────────────────────┐\n│ ${title.padEnd(34, " ")} │\n├──────────────┬───────────────────┬───────────┤\n│ Tools        │ Preview / Graph    │ Inspector │\n│ Commands     │ ┌───────────────┐  │ Params    │\n│ Assets       │ │ frame surface │  │ Status    │\n│ Evidence     │ └───────────────┘  │ Gate      │\n├──────────────┴───────────────────┴───────────┤\n│ PHKD: preview/scaffold unless evidence exists  │\n└──────────────────────────────────────────────┘`,
      phkd: { productionReady: false, note: blocked ? "Runtime gated; no fake operational claim." : "Preview/evidence contract only; productionReady false." },
    };
  }),
];

export const MAHAVISPHOT_STUDIO_COMMANDS: StudioCommand[] = [
  { id: "search", icon: "🔎", key: "⌘K", winKey: "Ctrl+K", label: "Search", group: "global", status: "ready" },
  { id: "save-project", icon: "💾", key: "⌘S", winKey: "Ctrl+S", label: "Save Project", group: "global", status: "ready" },
  { id: "export", icon: "📤", key: "⌘E", winKey: "Ctrl+E", label: "Export", group: "global", status: "preview" },
  { id: "edit", icon: "✂️", key: "1", label: "Edit", group: "modes", status: "ready" },
  { id: "audio", icon: "🎚️", key: "2", label: "Audio", group: "modes", status: "preview" },
  { id: "vfx", icon: "✨", key: "3", label: "VFX", group: "modes", status: "preview" },
  { id: "3d-studio", icon: "🧊", key: "4", label: "3D Studio", group: "modes", status: "preview" },
  { id: "particles", icon: "🌌", key: "5", label: "Particles", group: "modes", status: "preview" },
  { id: "motion-track", icon: "🎯", key: "6", label: "Motion Track", group: "modes", status: "blocked" },
  { id: "face-swap", icon: "🧑‍🎭", key: "7", label: "Face Swap", group: "modes", status: "blocked" },
  { id: "access", icon: "♿", key: "8", label: "Access", group: "modes", status: "preview" },
];

export function getCommandKey(command: StudioCommand, platform: "mac" | "win" = "mac"): string {
  return platform === "win" && command.winKey ? command.winKey : command.key;
}

export function renderCommandDisplay(command: StudioCommand, mode: CommandDisplayMode = "icon+key+label", platform: "mac" | "win" = "mac"): string {
  const icon = command.icon || "";
  const key = getCommandKey(command, platform) || "";
  const label = command.label || "";
  switch (mode) {
    case "icon": return icon;
    case "key": return key;
    case "label": return label;
    case "icon+key": return [icon, key].filter(Boolean).join(" ");
    case "icon+label": return [icon, label].filter(Boolean).join(" ");
    case "icon+key+label":
    default: return [icon, key, label].filter(Boolean).join(" ");
  }
}

export const MAATAA_UI_RUNTIMES: RuntimeContract[] = [
  { id: "maataa-os", name: "Maataa OS", status: "scaffold", purpose: "Umbrella runtime shell.", productionReady: false },
  { id: "mahavisphot-studio", name: "Mahavisphot Studio", status: "preview", purpose: "Video/audio/VFX/AI compositor studio shell.", productionReady: false },
  { id: "tlp", name: "The Line Producers Platform", status: "preview", purpose: "Film production OS.", productionReady: false },
  { id: "kbs", name: "KBS", status: "scaffold", purpose: "Knowledge base system surface.", productionReady: false },
  { id: "hkd", name: "HKD", status: "scaffold", purpose: "Hemant knowledge/design runtime.", productionReady: false },
  { id: "lipi", name: "Lipi", status: "scaffold", purpose: "Language/script intelligence surface.", productionReady: false },
  { id: "radio-vaigyaaniq", name: "Radio Vaigyaaniq", status: "preview", purpose: "Audio/radio runtime surface.", productionReady: false },
  { id: "digital-gurukul", name: "Digital Gurukul", status: "preview", purpose: "Learning/curriculum runtime.", productionReady: false },
  { id: "investorhub", name: "InvestorHub", status: "scaffold", purpose: "Investment and marketplace scaffold.", productionReady: false },
  { id: "braahmini", name: "Braahmini", status: "scaffold", purpose: "Future runtime surface.", productionReady: false },
];

export const MAATAA_UI_COMPONENTS: MaataaComponentContract[] = [
  { id: "sovereign-header", name: "SovereignHeader", status: "scaffold", slots: ["brand", "nav", "runtime", "actions"], purpose: "Top-level product header." },
  { id: "runtime-shell", name: "RuntimeShell", status: "scaffold", slots: ["header", "sidebar", "main", "inspector", "footer"], purpose: "Composable runtime application shell." },
  { id: "command-palette", name: "CommandPalette", status: "preview", slots: ["input", "filters", "results", "footer"], purpose: "Searchable command surface using six display modes." },
  { id: "command-display", name: "CommandDisplay", status: "preview", slots: ["icon", "key", "label"], purpose: "Renders icon/key/label command combinations." },
  { id: "runtime-pulse", name: "RuntimePulse", status: "scaffold", slots: ["status", "health", "evidence"], purpose: "Honest runtime status indicator." },
  { id: "status-matrix", name: "StatusMatrix", status: "scaffold", slots: ["rows", "filters", "legend"], purpose: "Status and blocker matrix." },
  { id: "evidence-panel", name: "EvidencePanel", status: "scaffold", slots: ["claims", "sources", "blockers"], purpose: "PHKD evidence display." },
  { id: "release-authority-panel", name: "ReleaseAuthorityPanel", status: "scaffold", slots: ["gates", "signatures", "verdict"], purpose: "Release authority surface." },
];

export const SNAPSHOT = {
  name: "mahavisphot-maataa-ui-typescript-snapshot",
  version: "0.1.0",
  generatedFrom: "conversation-recollection-and-repo-state",
  repo: "wortforfilms/aham",
  packageStarted: "packages/maataa-ui/package.json",
  frames: MAHAVISPHOT_24_FRAMES,
  commandDisplayModes: COMMAND_DISPLAY_MODES,
  commands: MAHAVISPHOT_STUDIO_COMMANDS,
  runtimes: MAATAA_UI_RUNTIMES,
  components: MAATAA_UI_COMPONENTS,
  phkd: {
    productionReady: false,
    verdict: "PREVIEW_SNAPSHOT",
    honesty: "No fake runtime, telemetry, AI, render, or production readiness claims.",
  },
} as const;

export default SNAPSHOT;
