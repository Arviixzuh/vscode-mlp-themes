/**
 * Build-time generator for the MLP:FiM VS Code themes.
 *
 * Compiles structured Catppuccin-inspired layered tokens into full VS Code
 * theme JSON files under `themes/`. Run via `npm run build:themes`.
 *
 * This script is also compiled by `tsc` (it lives in `src/`), so it must only
 * use erasable TypeScript syntax and must not import `vscode`.
 */

import * as fs from 'fs';
import * as path from 'path';
import { THEME_CATALOG } from './theme-catalog';

// ---------------------------------------------------------------------------
// Palette model
// ---------------------------------------------------------------------------

interface AnsiPalette {
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

interface GitColors {
  added: string;
  modified: string;
  deleted: string;
  untracked: string;
  ignored: string;
  conflict: string;
}

interface Palette {
  // Layered surfaces (Catppuccin hierarchy)
  base: string;
  mantle: string;
  crust: string;
  surface0: string;
  surface1: string;
  surface2: string;
  overlay0: string;
  overlay1: string;
  overlay2: string;
  // Text
  text: string;
  subtext0: string;
  subtext1: string;
  // Syntax roles
  comment: string;
  keyword: string;
  func: string;
  type: string;
  str: string;
  num: string;
  con: string;
  op: string;
  variable: string;
  tag: string;
  attr: string;
  deco: string;
  head: string;
  invalid: string;
  // Extras
  ansi: AnsiPalette;
  git: GitColors;
  brackets: [string, string, string, string, string, string];
}

// Catppuccin Mocha defaults — every character palette inherits these and only
// overrides the surface tint plus the signature pastel accents.
const MOCHA: Palette = {
  base: '#1e1e2e',
  mantle: '#181825',
  crust: '#11111b',
  surface0: '#313244',
  surface1: '#45475a',
  surface2: '#585b70',
  overlay0: '#6c7086',
  overlay1: '#7f849c',
  overlay2: '#9399b2',
  text: '#cdd6f4',
  subtext0: '#a6adc8',
  subtext1: '#bac2de',
  comment: '#6c7086',
  keyword: '#cba6f7',
  func: '#89b4fa',
  type: '#f9e2af',
  str: '#a6e3a1',
  num: '#fab387',
  con: '#f38ba8',
  op: '#89dceb',
  variable: '#cdd6f4',
  tag: '#94e2d5',
  attr: '#fab387',
  deco: '#eba0ac',
  head: '#b4befe',
  invalid: '#f38ba8',
  ansi: {
    black: '#45475a',
    red: '#f38ba8',
    green: '#a6e3a1',
    yellow: '#f9e2af',
    blue: '#89b4fa',
    magenta: '#cba6f7',
    cyan: '#89dceb',
    white: '#bac2de',
    brightBlack: '#585b70',
    brightRed: '#f38ba8',
    brightGreen: '#a6e3a1',
    brightYellow: '#f9e2af',
    brightBlue: '#89b4fa',
    brightMagenta: '#cba6f7',
    brightCyan: '#89dceb',
    brightWhite: '#cdd6f4',
  },
  git: {
    added: '#a6e3a1',
    modified: '#f9e2af',
    deleted: '#f38ba8',
    untracked: '#89dceb',
    ignored: '#6c7086',
    conflict: '#f38ba8',
  },
  brackets: ['#f38ba8', '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5', '#89b4fa'],
};

function palette(overrides: Partial<Palette> & { ansi?: Partial<AnsiPalette>; git?: Partial<GitColors> }): Palette {
  return {
    ...MOCHA,
    ...overrides,
    ansi: { ...MOCHA.ansi, ...overrides.ansi },
    git: { ...MOCHA.git, ...overrides.git },
    brackets: overrides.brackets ?? MOCHA.brackets,
  };
}

// ---------------------------------------------------------------------------
// Character palettes
// ---------------------------------------------------------------------------

const PALETTES: Record<string, Palette> = {
  // 1. Twilight Sparkle — lavender / mauve alicorn
  twilight: palette({
    base: '#141221',
    mantle: '#100e1b',
    crust: '#0c0a15',
    keyword: '#cba6f7',
    func: '#74c7ec',
    type: '#f9e2af',
    str: '#a6e3a1',
    num: '#fab387',
    con: '#f38ba8',
    op: '#89dceb',
    deco: '#f5c2e7',
    head: '#b4befe',
    brackets: ['#f5c2e7', '#cba6f7', '#89dceb', '#f9e2af', '#a6e3a1', '#fab387'],
  }),

  // 2. Rainbow Dash — sky / sapphire pegasus
  rainbow: palette({
    base: '#111824',
    mantle: '#0d131d',
    crust: '#090e16',
    keyword: '#74c7ec',
    func: '#89b4fa',
    type: '#f9e2af',
    str: '#a6e3a1',
    num: '#fab387',
    con: '#f38ba8',
    op: '#89dceb',
    deco: '#f38ba8',
    head: '#b4befe',
    brackets: ['#f38ba8', '#89dceb', '#74c7ec', '#a6e3a1', '#f9e2af', '#89b4fa'],
  }),

  // 3. Fluttershy — rosewater / sage pegasus (soft rose-tinted dark, not brown)
  fluttershy: palette({
    base: '#1e151a',
    mantle: '#181114',
    crust: '#130e11',
    surface0: '#33262b',
    surface1: '#46343d',
    surface2: '#5f4753',
    keyword: '#a6e3a1',
    func: '#89b4fa',
    type: '#f5c2e7',
    str: '#fab387',
    num: '#f9e2af',
    con: '#f38ba8',
    op: '#94e2d5',
    variable: '#f5e0dc',
    deco: '#f5c2e7',
    head: '#b4befe',
    brackets: ['#f9e2af', '#f5c2e7', '#a6e3a1', '#fab387', '#94e2d5', '#89b4fa'],
  }),

  // 4. Rarity — pearl / periwinkle unicorn
  rarity: palette({
    base: '#14151e',
    mantle: '#101119',
    crust: '#0c0d14',
    keyword: '#b4befe',
    func: '#89b4fa',
    type: '#f9e2af',
    str: '#a6e3a1',
    num: '#fab387',
    con: '#f38ba8',
    op: '#89dceb',
    deco: '#cba6f7',
    head: '#89dceb',
    brackets: ['#b4befe', '#89b4fa', '#cba6f7', '#f9e2af', '#a6e3a1', '#fab387'],
  }),

  // 5. Applejack — peach / orchard earth pony
  applejack: palette({
    base: '#191512',
    mantle: '#14110e',
    crust: '#100d0b',
    keyword: '#fab387',
    func: '#89b4fa',
    type: '#f9e2af',
    str: '#a6e3a1',
    num: '#f9e2af',
    con: '#f38ba8',
    op: '#94e2d5',
    deco: '#eba0ac',
    head: '#b4befe',
    brackets: ['#fab387', '#f9e2af', '#a6e3a1', '#94e2d5', '#89b4fa', '#eba0ac'],
  }),

  // 6. Pinkie Pie — flamingo pink earth pony
  pinkie: palette({
    base: '#191219',
    mantle: '#140e14',
    crust: '#100b10',
    keyword: '#f5c2e7',
    func: '#89dceb',
    type: '#b4befe',
    str: '#a6e3a1',
    num: '#f9e2af',
    con: '#f38ba8',
    op: '#94e2d5',
    deco: '#cba6f7',
    head: '#89dceb',
    brackets: ['#f5c2e7', '#f2cdcd', '#89dceb', '#f9e2af', '#a6e3a1', '#b4befe'],
  }),

  // 7. Princess Luna — midnight sapphire alicorn
  luna: palette({
    base: '#0e101c',
    mantle: '#0b0d17',
    crust: '#080912',
    keyword: '#89b4fa',
    func: '#74c7ec',
    type: '#b4befe',
    str: '#94e2d5',
    num: '#89dceb',
    con: '#f38ba8',
    op: '#cba6f7',
    variable: '#bac2de',
    deco: '#f5c2e7',
    head: '#b4befe',
    brackets: ['#89b4fa', '#89dceb', '#b4befe', '#cba6f7', '#94e2d5', '#f5c2e7'],
  }),

  // 8. Princess Celestia — solar peach / gold alicorn
  celestia: palette({
    base: '#181518',
    mantle: '#131114',
    crust: '#0f0d10',
    keyword: '#f9e2af',
    func: '#fab387',
    type: '#f5c2e7',
    str: '#94e2d5',
    num: '#fab387',
    con: '#f38ba8',
    op: '#89dceb',
    deco: '#eba0ac',
    head: '#b4befe',
    brackets: ['#f9e2af', '#fab387', '#eba0ac', '#94e2d5', '#89dceb', '#f5c2e7'],
  }),

  // 9. Sunset Shimmer — ember peach / maroon
  sunset: palette({
    base: '#191314',
    mantle: '#140f10',
    crust: '#100b0c',
    keyword: '#eba0ac',
    func: '#f5c2e7',
    type: '#fab387',
    str: '#a6e3a1',
    num: '#f9e2af',
    con: '#f38ba8',
    op: '#94e2d5',
    deco: '#cba6f7',
    head: '#fab387',
    brackets: ['#eba0ac', '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5', '#f5c2e7'],
  }),
};

// ---------------------------------------------------------------------------
// Theme JSON assembly
// ---------------------------------------------------------------------------

interface TokenRule {
  scope: string | string[];
  settings: { foreground?: string; background?: string; fontStyle?: string };
}

function buildTokenColors(p: Palette): TokenRule[] {
  const italic = 'italic';
  const rules: TokenRule[] = [
    // Comments — muted overlay tone, italic
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: p.comment, fontStyle: italic } },
    // Keywords & storage
    { scope: ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'], settings: { foreground: p.keyword } },
    { scope: ['keyword.operator.new', 'keyword.operator.expression'], settings: { foreground: p.keyword } },
    // Strings & constants
    { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string'], settings: { foreground: p.str } },
    { scope: ['constant.numeric', 'constant.character', 'constant.other'], settings: { foreground: p.num } },
    { scope: ['constant.language', 'variable.other.constant', 'support.constant', 'entity.name.constant'], settings: { foreground: p.con } },
    // Functions & methods
    {
      scope: [
        'entity.name.function',
        'support.function',
        'meta.function',
        'variable.function',
        'entity.name.method',
        'meta.method',
      ],
      settings: { foreground: p.func },
    },
    // Types, classes, structs, traits, interfaces
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.name.struct',
        'entity.name.trait',
        'entity.name.interface',
        'entity.name.enum',
        'support.type',
        'support.class',
        'storage.type.generic',
        'entity.name.namespace',
      ],
      settings: { foreground: p.type },
    },
    // Variables & parameters
    { scope: ['variable', 'variable.other', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: p.variable } },
    { scope: ['variable.language', 'variable.language.this', 'variable.language.self'], settings: { foreground: p.op } },
    // Tags & attributes (HTML/CSS/XML)
    { scope: ['entity.name.tag', 'punctuation.definition.tag'], settings: { foreground: p.tag } },
    { scope: ['entity.other.attribute-name', 'support.type.property-name', 'meta.object-literal.key'], settings: { foreground: p.attr } },
    { scope: ['entity.other.attribute-name.class.css', 'support.type.vendored.property-name'], settings: { foreground: p.attr } },
    // Decorators / macros / attributes
    { scope: ['meta.decorator', 'punctuation.decorator', 'entity.name.function.decorator', 'meta.preprocessor', 'keyword.other.macdef'], settings: { foreground: p.deco } },
    // Operators & punctuation
    { scope: ['keyword.operator', 'punctuation.accessor', 'punctuation.separator.key-value'], settings: { foreground: p.op } },
    { scope: ['punctuation', 'meta.brace', 'meta.delimiter'], settings: { foreground: p.subtext0 } },
    // Headings & markup
    { scope: ['markup.heading', 'entity.name.section'], settings: { foreground: p.head, fontStyle: 'bold' } },
    { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { fontStyle: italic } },
    { scope: ['markup.inline.raw', 'markup.fenced_code'], settings: { foreground: p.str } },
    // Invalid
    { scope: 'invalid', settings: { foreground: p.invalid } },
    // SQL-ish & misc support
    { scope: ['support.function.sql', 'keyword.other.DML.sql'], settings: { foreground: p.keyword } },
    { scope: ['constant.other.symbol'], settings: { foreground: p.num } },
  ];
  return rules;
}

function buildSemanticTokenColors(p: Palette): Record<string, string> {
  return {
    namespace: p.type,
    type: p.type,
    class: p.type,
    enum: p.type,
    interface: p.type,
    struct: p.type,
    typeParameter: p.func,
    parameter: p.variable,
    variable: p.variable,
    property: p.attr,
    enumMember: p.con,
    event: p.func,
    function: p.func,
    method: p.func,
    macro: p.deco,
    keyword: p.keyword,
    modifier: p.keyword,
    comment: p.comment,
    string: p.str,
    number: p.num,
    regexp: p.con,
    operator: p.op,
    decorator: p.deco,
  };
}

// ---------------------------------------------------------------------------
// Color helpers — pastel surface derivation
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Linear blend between two hex colors. `t` = 0 → a, 1 → b. */
function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

/** Append an alpha channel (0–1) to a hex color → `#rrggbbaa`. */
function alpha(hex: string, a: number): string {
  const byte = Math.round(Math.min(1, Math.max(0, a)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${byte}`;
}

function buildColors(p: Palette): Record<string, string> {
  const c: Record<string, string> = {
    // Core editor
    'editor.background': p.base,
    'editor.foreground': p.text,
    'editorCursor.foreground': p.text,
    'editorLineNumber.foreground': p.overlay1,
    'editorLineNumber.activeForeground': p.subtext1,
    'editorIndentGuide.background1': p.surface1,
    'editorIndentGuide.activeBackground1': p.surface2,
    'editor.selectionBackground': `${p.surface1}99`,
    'editor.inactiveSelectionBackground': `${p.surface0}66`,
    'editor.selectionHighlightBackground': `${p.surface1}55`,
    'editor.wordHighlightBackground': `${p.surface2}66`,
    'editor.wordHighlightStrongBackground': `${p.surface2}99`,
    'editor.findMatchBackground': `${p.num}55`,
    'editor.findMatchHighlightBackground': `${p.surface1}55`,
    'editor.lineHighlightBackground': `${p.surface0}59`,
    'editor.lineHighlightBorder': `${p.surface1}00`,
    'editorWhitespace.foreground': `${p.overlay0}66`,
    'editorRuler.foreground': `${p.surface1}00`,
    // Bracket pair colorization
    'editorBracketHighlight.foreground1': p.brackets[0],
    'editorBracketHighlight.foreground2': p.brackets[1],
    'editorBracketHighlight.foreground3': p.brackets[2],
    'editorBracketHighlight.foreground4': p.brackets[3],
    'editorBracketHighlight.foreground5': p.brackets[4],
    'editorBracketHighlight.foreground6': p.brackets[5],
    'editorBracketPairGuide.background1': `${p.brackets[0]}33`,
    'editorBracketPairGuide.activeBackground1': `${p.brackets[0]}66`,
    // Tabs
    'tab.activeBackground': p.base,
    'tab.activeForeground': p.text,
    'tab.inactiveBackground': p.mantle,
    'tab.inactiveForeground': p.subtext0,
    'tab.border': p.mantle,
    'tab.activeBorder': p.base,
    'tab.activeBorderTop': p.keyword,
    'tab.hoverBackground': p.surface0,
    'tab.unfocusedActiveForeground': p.subtext1,
    'tab.unfocusedInactiveForeground': p.overlay1,
    // Editor groups
    'editorGroupHeader.tabsBackground': p.mantle,
    'editorGroupHeader.tabsBorder': p.mantle,
    'editorGroup.border': p.mantle,
    'editorGroup.dropBackground': `${p.surface1}80`,
    // Side bar / activity bar
    'sideBar.background': mix(p.mantle, p.keyword, 0.05),
    'sideBar.foreground': mix(p.subtext1, p.keyword, 0.12),
    'sideBar.border': p.crust,
    'sideBarTitle.foreground': p.text,
    'sideBarSectionHeader.background': p.mantle,
    'sideBarSectionHeader.foreground': p.subtext0,
    'activityBar.background': mix(p.crust, p.keyword, 0.08),
    'activityBar.foreground': mix(p.text, p.keyword, 0.22),
    'activityBar.inactiveForeground': mix(p.overlay1, p.keyword, 0.32),
    'activityBar.border': p.mantle,
    'activityBarBadge.background': p.keyword,
    'activityBarBadge.foreground': p.base,
    'activityBar.activeBorder': p.keyword,
    'activityBar.activeFocusBorder': p.func,
    // Status bar
    'statusBar.background': p.crust,
    'statusBar.foreground': p.subtext1,
    'statusBar.border': p.mantle,
    'statusBar.debuggingBackground': p.keyword,
    'statusBar.debuggingForeground': p.base,
    'statusBar.noFolderBackground': p.crust,
    'statusBarItem.hoverBackground': p.surface0,
    'statusBarItem.remoteBackground': p.surface0,
    // Title bar
    'titleBar.activeBackground': p.mantle,
    'titleBar.activeForeground': p.text,
    'titleBar.inactiveBackground': p.mantle,
    'titleBar.inactiveForeground': p.subtext0,
    'titleBar.border': p.crust,
    // Panel
    'panel.background': p.mantle,
    'panel.border': p.crust,
    'panelTitle.activeForeground': p.text,
    'panelTitle.activeBorder': p.keyword,
    'panelTitle.inactiveForeground': p.subtext0,
    // Inputs / dropdowns
    'input.background': p.surface0,
    'input.foreground': p.text,
    'input.border': p.surface1,
    'input.placeholderForeground': p.overlay1,
    'inputOption.activeBorder': p.keyword,
    'dropdown.background': p.surface1,
    'dropdown.foreground': p.text,
    'dropdown.border': p.surface1,
    // Lists
    'list.activeSelectionBackground': `${p.surface1}cc`,
    'list.activeSelectionForeground': p.text,
    'list.hoverBackground': `${p.surface0}b3`,
    'list.hoverForeground': p.text,
    'list.inactiveSelectionBackground': `${p.surface0}99`,
    'list.focusBackground': `${p.surface1}b3`,
    'list.focusForeground': p.text,
    'list.highlightForeground': p.keyword,
    'list.invalidItemForeground': p.invalid,
    // Buttons / badges / notifications / quick pick
    'button.background': p.keyword,
    'button.foreground': p.base,
    'button.hoverBackground': p.func,
    'button.secondaryBackground': p.surface1,
    'button.secondaryForeground': p.text,
    'badge.background': p.keyword,
    'badge.foreground': p.base,
    'notification.background': p.surface1,
    'notification.foreground': p.text,
    'notification.border': p.surface2,
    'notificationCenterHeader.background': p.mantle,
    'quickInput.background': p.mantle,
    'quickInput.foreground': p.text,
    'quickInputList.focusBackground': `${p.surface1}b3`,
    'quickInputTitle.background': p.mantle,
    // Terminal
    'terminal.background': p.crust,
    'terminal.foreground': p.text,
    'terminal.border': p.mantle,
    'terminalCursor.foreground': p.text,
    'terminalCursor.background': p.base,
    'terminal.selectionBackground': `${p.surface1}99`,
    'terminal.ansiBlack': p.ansi.black,
    'terminal.ansiRed': p.ansi.red,
    'terminal.ansiGreen': p.ansi.green,
    'terminal.ansiYellow': p.ansi.yellow,
    'terminal.ansiBlue': p.ansi.blue,
    'terminal.ansiMagenta': p.ansi.magenta,
    'terminal.ansiCyan': p.ansi.cyan,
    'terminal.ansiWhite': p.ansi.white,
    'terminal.ansiBrightBlack': p.ansi.brightBlack,
    'terminal.ansiBrightRed': p.ansi.brightRed,
    'terminal.ansiBrightGreen': p.ansi.brightGreen,
    'terminal.ansiBrightYellow': p.ansi.brightYellow,
    'terminal.ansiBrightBlue': p.ansi.brightBlue,
    'terminal.ansiBrightMagenta': p.ansi.brightMagenta,
    'terminal.ansiBrightCyan': p.ansi.brightCyan,
    'terminal.ansiBrightWhite': p.ansi.brightWhite,
    // Git decorations
    'gitDecoration.addedResourceForeground': p.git.added,
    'gitDecoration.modifiedResourceForeground': p.git.modified,
    'gitDecoration.deletedResourceForeground': p.git.deleted,
    'gitDecoration.untrackedResourceForeground': p.git.untracked,
    'gitDecoration.ignoredResourceForeground': p.git.ignored,
    'gitDecoration.conflictingResourceForeground': p.git.conflict,
    'gitDecoration.stageModifiedResourceForeground': p.git.modified,
    'gitDecoration.stageDeletedResourceForeground': p.git.deleted,
    // Scrollbars & misc
    'scrollbarSlider.background': `${p.overlay0}66`,
    'scrollbarSlider.hoverBackground': `${p.overlay1}99`,
    'scrollbarSlider.activeBackground': `${p.overlay2}cc`,
    'focusBorder': `${p.keyword}88`,
    'foreground': p.text,
  };

  // ---- Derived pastel "card" surfaces — each character's signature hue
  //      tints widgets so cards/peek views feel personal, not generic. ----
  const card = mix(p.surface1, p.keyword, 0.14);
  const cardAlt = mix(p.surface1, p.func, 0.12);
  const cardBorder = mix(p.surface2, p.keyword, 0.12);
  const selSoft = mix(p.surface1, p.keyword, 0.35);
  const hoverSoft = mix(p.surface0, p.keyword, 0.25);

  Object.assign(c, {
    // Editor widgets & floating cards
    'editorWidget.background': card,
    'editorWidget.foreground': p.text,
    'editorWidget.border': cardBorder,
    'editorHoverWidget.background': card,
    'editorHoverWidget.border': cardBorder,
    'editorHoverWidget.highlightForeground': p.keyword,
    'editorSuggestWidget.background': card,
    'editorSuggestWidget.border': cardBorder,
    'editorSuggestWidget.selectedBackground': selSoft,
    'editorSuggestWidget.selectedForeground': p.text,
    'editorSuggestWidget.highlightForeground': p.keyword,
    'editorStickyScroll.background': mix(p.mantle, p.base, 0.4),
    'editorStickyScroll.border': p.surface1,
    'editorStickyScroll.shadow': alpha(p.keyword, 0.2),

    // Peek view ("go to definition" card)
    'peekViewEditor.background': card,
    'peekViewEditor.border': cardBorder,
    'peekViewEditorGutter.background': p.mantle,
    'peekViewResult.background': cardAlt,
    'peekViewResult.border': cardBorder,
    'peekViewResult.fileForeground': p.subtext1,
    'peekViewResult.lineForeground': p.subtext0,
    'peekViewResult.matchHighlightBackground': alpha(p.keyword, 0.27),
    'peekViewResult.selectionBackground': alpha(p.surface2, 0.6),
    'peekViewResult.selectionForeground': p.text,
    'peekViewTitle.background': card,
    'peekViewTitle.foreground': p.text,
    'peekViewTitle.border': cardBorder,
    'peekViewTitle.labelForeground': p.subtext0,

    // Merge & diff editors
    'mergeEditor.background': p.base,
    'mergeEditor.border': cardBorder,
    'mergeEditor.change.background': alpha(p.keyword, 0.2),
    'mergeEditor.change.word.background': alpha(p.keyword, 0.33),
    'mergeEditor.incomingHeaderBackground': alpha(p.func, 0.2),
    'mergeEditor.currentHeaderBackground': alpha(p.con, 0.2),
    'diffEditor.insertedTextBackground': alpha(p.git.added, 0.2),
    'diffEditor.removedTextBackground': alpha(p.git.deleted, 0.2),
    'diffEditor.insertedLineBackground': alpha(p.git.added, 0.1),
    'diffEditor.removedLineBackground': alpha(p.git.deleted, 0.1),
    'diffEditorGutter.insertedLineBackground': p.git.added,
    'diffEditorGutter.removedLineBackground': p.git.deleted,
    'diffEditorOverview.insertedForeground': p.git.added,
    'diffEditorOverview.removedForeground': p.git.deleted,
    'diffEditor.diagonalFill.inserted': alpha(p.git.added, 0.08),
    'diffEditor.diagonalFill.removed': alpha(p.git.deleted, 0.08),

    // Severity markers & squiggles
    'editorError.foreground': p.invalid,
    'editorError.background': alpha(p.invalid, 0.1),
    'editorError.border': alpha(p.invalid, 0.5),
    'editorWarning.foreground': p.num,
    'editorWarning.background': alpha(p.num, 0.1),
    'editorWarning.border': alpha(p.num, 0.5),
    'editorInfo.foreground': p.func,
    'editorInfo.background': alpha(p.func, 0.1),
    'editorInfo.border': alpha(p.func, 0.5),
    'editorHint.foreground': p.op,
    'editorHint.background': alpha(p.op, 0.1),
    'editorHint.border': alpha(p.op, 0.5),
    'problemsErrorIcon.foreground': p.invalid,
    'problemsWarningIcon.foreground': p.num,
    'problemsInfoIcon.foreground': p.func,
    'notificationsErrorIcon.foreground': p.invalid,
    'notificationsWarningIcon.foreground': p.num,
    'notificationsInfoIcon.foreground': p.func,
    'editorLightBulb.foreground': p.num,
    'editorLightBulbAutoFix.foreground': p.func,
    'editorCodeLens.foreground': p.subtext1,

    // Inlay hints
    'editorInlayHint.foreground': p.subtext0,
    'editorInlayHint.background': alpha(p.surface0, 0.5),
    'editorInlayHint.typeForeground': p.subtext1,
    'editorInlayHint.parameterForeground': p.attr,

    // Breadcrumb
    'breadcrumb.background': p.mantle,
    'breadcrumb.foreground': p.subtext0,
    'breadcrumb.focusForeground': p.text,
    'breadcrumb.activeSelectionForeground': p.keyword,
    'breadcrumbPicker.background': p.mantle,

    // Gutter / overview ruler / minimap
    'editorGutter.background': p.base,
    'editorGutter.addedBackground': alpha(p.git.added, 0.55),
    'editorGutter.modifiedBackground': alpha(p.git.modified, 0.55),
    'editorGutter.deletedBackground': alpha(p.git.deleted, 0.55),
    'editorOverviewRuler.border': p.surface0,
    'editorOverviewRuler.addedForeground': p.git.added,
    'editorOverviewRuler.modifiedForeground': p.git.modified,
    'editorOverviewRuler.deletedForeground': p.git.deleted,
    'editorOverviewRuler.errorForeground': p.invalid,
    'editorOverviewRuler.warningForeground': p.num,
    'editorOverviewRuler.infoForeground': p.func,
    'editorOverviewRuler.findMatchForeground': alpha(p.keyword, 0.8),
    'editorOverviewRuler.rangeHighlightForeground': alpha(p.surface2, 0.6),
    'editorOverviewRuler.selectionHighlightForeground': alpha(p.surface1, 0.6),
    'editorOverviewRuler.wordHighlightForeground': alpha(p.surface2, 0.4),
    'editorOverviewRuler.wordHighlightStrongForeground': alpha(p.surface2, 0.7),
    'editorOverviewRuler.bracketMatchForeground': alpha(p.func, 0.5),
    'minimap.background': p.mantle,
    'minimap.selectionHighlight': alpha(p.surface2, 0.4),
    'minimap.findMatchHighlight': alpha(p.keyword, 0.4),
    'minimap.errorHighlight': alpha(p.invalid, 0.7),
    'minimap.warningHighlight': alpha(p.num, 0.7),
    'minimapGutter.addedBackground': p.git.added,
    'minimapGutter.modifiedBackground': p.git.modified,
    'minimapGutter.deletedBackground': p.git.deleted,

    // Stack frames & snippet ranges
    'editor.stackFrameHighlightBackground': alpha(p.func, 0.2),
    'editor.focusedStackFrameHighlightBackground': alpha(p.func, 0.35),
    'editor.rangeHighlightBackground': alpha(p.surface1, 0.4),
    'editor.linkedEditingBackground': alpha(p.keyword, 0.2),
    'editor.snippetTabstopHighlightBackground': alpha(p.keyword, 0.27),
    'editor.snippetFinalTabstopHighlightBackground': alpha(p.func, 0.27),

    // Text / markdown chrome
    'textLink.foreground': p.func,
    'textLink.activeForeground': p.keyword,
    'textPreformat.foreground': p.subtext1,
    'textPreformat.background': p.surface0,
    'textBlockQuote.background': alpha(p.keyword, 0.08),
    'textBlockQuote.border': alpha(p.keyword, 0.3),
    'textCodeBlock.background': p.surface0,
    'textSeparator.foreground': p.surface1,
    'descriptionForeground': p.subtext0,
    'errorForeground': p.invalid,
    'warningForeground': p.num,
    'icon.foreground': p.subtext1,
    'disabledForeground': p.overlay1,

    // Welcome / getting started cards
    'welcomePage.background': p.mantle,
    'welcomePage.foreground': p.text,
    'welcomePage.tileBackground': p.surface0,
    'welcomePage.tileHoverBackground': hoverSoft,
    'welcomePage.tileBorder': p.surface1,
    'welcomePage.progress.background': alpha(p.keyword, 0.4),
    'welcomePage.progress.foreground': p.keyword,
    'welcomePage.button.background': p.keyword,
    'welcomePage.button.foreground': p.base,
    'welcomePage.button.hoverBackground': p.func,
    'welcomePage.textLink.foreground': p.func,
    'welcomePage.textLink.activeForeground': p.keyword,
    'walkThrough.embeddedEditorBackground': p.base,

    // Extension & marketplace UI
    'extensionButton.prominentBackground': p.keyword,
    'extensionButton.prominentForeground': p.base,
    'extensionButton.prominentHoverBackground': p.func,
    'extensionButton.secondaryBackground': p.surface1,
    'extensionButton.secondaryForeground': p.text,
    'extensionButton.secondaryHoverBackground': p.surface2,
    'extensionBadge.remoteBackground': alpha(p.func, 0.2),
    'extensionBadge.remoteForeground': p.func,
    'extensionBadge.marketplaceBackground': alpha(p.keyword, 0.18),
    'extensionBadge.marketplaceForeground': p.keyword,
    'extensionIcon.starForeground': p.num,
    'extensionIcon.verifiedForeground': p.func,
    'extensionIcon.preReleaseForeground': p.con,
    'extensionIcon.sponsorForeground': p.deco,

    // Debug & testing
    'debugToolBar.background': p.mantle,
    'debugToolBar.border': p.surface1,
    'debugToolBar.foreground': p.text,
    'debugToolBar.hoverBackground': p.surface0,
    'debugIcon.breakpointForeground': p.con,
    'debugIcon.breakpointDisabledForeground': p.overlay1,
    'debugIcon.breakpointUnverifiedForeground': p.overlay2,
    'debugIcon.breakpointCurrentStackframeForeground': p.keyword,
    'debugIcon.breakpointStackframeForeground': p.func,
    'debugIcon.startForeground': p.str,
    'debugIcon.pauseForeground': p.num,
    'debugIcon.disconnectForeground': p.con,
    'debugIcon.restartForeground': p.num,
    'debugIcon.stepOverForeground': p.num,
    'debugIcon.stepIntoForeground': p.func,
    'debugIcon.stepOutForeground': p.op,
    'debugIcon.continueForeground': p.str,
    'debugIcon.stepBackForeground': p.overlay1,
    'debugConsole.infoForeground': p.func,
    'debugConsole.warningForeground': p.num,
    'debugConsole.errorForeground': p.invalid,
    'debugConsole.sourceForeground': p.subtext1,
    'testing.iconPassed': p.str,
    'testing.iconFailed': p.invalid,
    'testing.iconErrored': p.invalid,
    'testing.iconQueued': p.overlay1,
    'testing.iconUnset': p.overlay1,
    'testing.iconSkipped': p.overlay1,

    // Notebook
    'notebook.cellBorderColor': p.surface1,
    'notebook.cellEditorBackground': p.base,
    'notebook.cellToolbarSeparator': p.surface1,
    'notebook.focusedEditorBorder': alpha(p.keyword, 0.4),
    'notebook.selectedCellBackground': alpha(p.surface0, 0.7),
    'notebook.selectedCellBorder': alpha(p.keyword, 0.5),
    'notebook.symbolHighlightBackground': alpha(p.keyword, 0.2),

    // Menus & context menus (hover states)
    'menu.background': card,
    'menu.foreground': p.text,
    'menu.selectionBackground': selSoft,
    'menu.selectionForeground': p.text,
    'menu.selectionBorder': alpha(p.keyword, 0.4),
    'menu.separatorBackground': p.surface1,
    'menu.border': cardBorder,

    // Ports, sash, scrollbar shadow
    'ports.iconRunningProcessForeground': p.func,
    'sash.hoverBorder': alpha(p.keyword, 0.4),
    'scrollbar.shadow': alpha(p.crust, 0.8),

    // Chat / interactive window
    'chat.requestBackground': alpha(p.surface0, 0.5),
    'chat.requestBorder': cardBorder,
    'chat.editedFileForeground': p.func,
    'chat.linesAddedForeground': p.str,
    'chat.linesRemovedForeground': p.invalid,
    'chat.slashCommandForeground': p.keyword,
    'chat.slashCommandBackground': alpha(p.keyword, 0.15),
    'interactive.activeCodeBorder': alpha(p.keyword, 0.5),

    // Symbol icons — outline glyph accents give each pony its own icon personality
    'symbolIcon.arrayForeground': p.num,
    'symbolIcon.booleanForeground': p.con,
    'symbolIcon.classForeground': p.type,
    'symbolIcon.colorForeground': p.deco,
    'symbolIcon.constantForeground': p.con,
    'symbolIcon.constructorForeground': p.func,
    'symbolIcon.enumeratorForeground': p.type,
    'symbolIcon.enumeratorMemberForeground': p.con,
    'symbolIcon.eventForeground': p.con,
    'symbolIcon.fieldForeground': p.attr,
    'symbolIcon.fileForeground': p.subtext1,
    'symbolIcon.folderForeground': p.num,
    'symbolIcon.functionForeground': p.func,
    'symbolIcon.interfaceForeground': p.type,
    'symbolIcon.keyForeground': p.attr,
    'symbolIcon.keywordForeground': p.keyword,
    'symbolIcon.methodForeground': p.func,
    'symbolIcon.moduleForeground': p.head,
    'symbolIcon.namespaceForeground': p.head,
    'symbolIcon.nullForeground': p.overlay1,
    'symbolIcon.numberForeground': p.num,
    'symbolIcon.objectForeground': p.type,
    'symbolIcon.operatorForeground': p.op,
    'symbolIcon.packageForeground': p.head,
    'symbolIcon.propertyForeground': p.attr,
    'symbolIcon.referenceForeground': p.func,
    'symbolIcon.snippetForeground': p.deco,
    'symbolIcon.stringForeground': p.str,
    'symbolIcon.structForeground': p.type,
    'symbolIcon.textForeground': p.subtext1,
    'symbolIcon.typeParameterForeground': p.func,
    'symbolIcon.unitForeground': p.op,
    'symbolIcon.variableForeground': p.variable,
  });

  // ---- Catppuccin-parity pass ------------------------------------------------
  // Mirrors the structure of the official Catppuccin VS Code port: a single
  // signature `accent` drives chrome (activity bar icons, focus borders, tabs,
  // badges, links), surfaces stay on the layered crust→mantle→base→surface
  // hierarchy, and semantic roles map 1:1 to palette colors. The pony
  // differentiator lives in the tinted "card" widgets above and the per-
  // character accent choices — everything else follows Catppuccin exactly.
  const accent = p.keyword;
  const dropBg = alpha(accent, 0.2);
  const transparent = '#00000000';
  // Catppuccin default: structural borders are invisible (`border` resolves to
  // transparent unless "extra borders" is enabled). Accent is reserved for
  // functional indicators (focus ring, active tab, dropdowns).
  const thinBorder = transparent;
  const shade = (c: string, t: number): string =>
    mix(c, t >= 0 ? '#000000' : '#ffffff', Math.abs(t));

  Object.assign(c, {
    // Base
    focusBorder: accent,
    foreground: p.text,
    disabledForeground: p.subtext0,
    'widget.shadow': alpha(p.mantle, 0.5),
    'selection.background': alpha(accent, 0.4),
    descriptionForeground: p.text,
    errorForeground: p.invalid,
    'icon.foreground': accent,
    'sash.hoverBorder': accent,

    // Text / markdown chrome
    'textBlockQuote.background': p.mantle,
    'textBlockQuote.border': p.crust,
    'textCodeBlock.background': p.mantle,
    'textLink.activeForeground': p.op,
    'textLink.foreground': p.func,
    'textPreformat.foreground': p.text,
    'textSeparator.foreground': accent,

    // Activity bar — Catppuccin signature: every icon in the accent color
    'activityBar.background': p.crust,
    'activityBar.foreground': accent,
    'activityBar.dropBorder': dropBg,
    'activityBar.inactiveForeground': p.overlay0,
    'activityBar.border': thinBorder,
    'activityBarBadge.background': accent,
    'activityBarBadge.foreground': p.crust,
    'activityBar.activeBorder': transparent,
    'activityBar.activeBackground': transparent,
    'activityBar.activeFocusBorder': transparent,
    'activityBarTop.foreground': accent,
    'activityBarTop.activeBorder': transparent,
    'activityBarTop.inactiveForeground': p.overlay0,
    'activityBarTop.dropBorder': dropBg,

    // Badge / buttons / checkbox
    'badge.background': p.surface1,
    'badge.foreground': p.text,
    'button.background': accent,
    'button.foreground': p.crust,
    'button.hoverBackground': shade(accent, 0.07),
    'button.secondaryBackground': p.surface2,
    'button.secondaryForeground': p.text,
    'button.secondaryHoverBackground': shade(p.surface2, 0.07),
    'checkbox.background': p.surface1,
    'checkbox.border': thinBorder,
    'checkbox.foreground': accent,

    // Breadcrumb
    'breadcrumb.activeSelectionForeground': accent,
    'breadcrumb.background': p.base,
    'breadcrumb.focusForeground': accent,
    'breadcrumb.foreground': alpha(p.text, 0.8),
    'breadcrumbPicker.background': p.mantle,

    // Dropdowns & inputs
    'dropdown.background': p.mantle,
    'dropdown.listBackground': p.surface2,
    'dropdown.border': accent,
    'dropdown.foreground': p.text,
    'input.background': p.surface0,
    'input.border': transparent,
    'input.foreground': p.text,
    'input.placeholderForeground': alpha(p.text, 0.45),
    'inputOption.activeBackground': p.surface2,
    'inputOption.activeBorder': accent,
    'inputOption.activeForeground': p.text,
    'inputValidation.errorBackground': p.invalid,
    'inputValidation.errorBorder': alpha(p.crust, 0.2),
    'inputValidation.errorForeground': p.base,
    'inputValidation.infoBackground': p.func,
    'inputValidation.infoBorder': alpha(p.crust, 0.2),
    'inputValidation.infoForeground': p.base,
    'inputValidation.warningBackground': p.num,
    'inputValidation.warningBorder': alpha(p.crust, 0.2),
    'inputValidation.warningForeground': p.base,

    // Debug extras
    'debugToolBar.background': p.crust,
    'debugToolBar.border': transparent,
    'debugExceptionWidget.background': p.crust,
    'debugExceptionWidget.border': accent,
    'debugTokenExpression.number': p.num,
    'debugTokenExpression.boolean': p.con,
    'debugTokenExpression.string': p.str,
    'debugTokenExpression.error': p.invalid,
    'debugConsoleInputIcon.foreground': p.text,

    // Testing — full Catppuccin set incl. retired variants
    'testing.runAction': accent,
    'testing.iconErrored': p.invalid,
    'testing.iconFailed': p.invalid,
    'testing.iconPassed': p.str,
    'testing.iconQueued': p.func,
    'testing.iconUnset': p.text,
    'testing.iconSkipped': p.subtext0,
    'testing.iconErrored.retired': p.invalid,
    'testing.iconFailed.retired': p.invalid,
    'testing.iconPassed.retired': p.str,
    'testing.iconQueued.retired': p.func,
    'testing.iconUnset.retired': p.text,
    'testing.iconSkipped.retired': p.subtext0,
    'testing.peekBorder': accent,
    'testing.peekHeaderBackground': p.surface2,
    'testing.message.error.lineBackground': alpha(p.invalid, 0.15),
    'testing.message.info.decorationForeground': alpha(p.str, 0.8),
    'testing.message.info.lineBackground': alpha(p.str, 0.15),
    'testing.messagePeekBorder': accent,
    'testing.messagePeekHeaderBackground': p.surface2,
    'testing.coveredBackground': alpha(p.str, 0.3),
    'testing.coveredBorder': transparent,
    'testing.coveredGutterBackground': alpha(p.str, 0.3),
    'testing.uncoveredBranchBackground': alpha(p.invalid, 0.2),
    'testing.uncoveredBackground': alpha(p.invalid, 0.2),
    'testing.uncoveredBorder': transparent,
    'testing.uncoveredGutterBackground': alpha(p.invalid, 0.25),
    'testing.coverCountBadgeBackground': transparent,
    'testing.coverCountBadgeForeground': accent,

    // Diff editor extras
    'diffEditor.border': p.surface2,
    'diffEditor.diagonalFill': alpha(p.surface2, 0.6),

    // Editor chrome
    'editor.findMatchBackground': mix(p.base, p.invalid, 0.3),
    'editor.findMatchBorder': alpha(p.invalid, 0.2),
    'editor.findMatchHighlightBackground': mix(p.base, p.op, 0.3),
    'editor.findMatchHighlightBorder': alpha(p.op, 0.2),
    'editor.findRangeHighlightBackground': mix(p.base, p.op, 0.3),
    'editor.findRangeHighlightBorder': alpha(p.op, 0.2),
    'editor.foldBackground': alpha(p.op, 0.25),
    'editor.hoverHighlightBackground': alpha(p.op, 0.25),
    'editor.selectionHighlightBorder': alpha(p.surface2, 0.2),
    'editor.wordHighlightStrongBackground': alpha(p.func, 0.2),
    'editorBracketMatch.background': alpha(p.surface2, 0.1),
    'editorBracketMatch.border': p.surface2,
    'editorCursor.foreground': mix(p.text, accent, 0.3),
    'editorGroup.border': p.surface2,
    'editorGroup.emptyBackground': p.base,
    'editorGutter.commentRangeForeground': p.surface0,
    'editorGutter.commentGlyphForeground': accent,
    'editorGutter.foldingControlForeground': p.overlay2,
    'editorGutter.modifiedBackground': p.num,
    'editorHoverWidget.foreground': p.text,
    'editorLink.activeForeground': accent,
    'editorLineNumber.activeForeground': accent,
    'editorLineNumber.foreground': p.overlay1,
    'editorMarkerNavigation.background': p.mantle,
    'editorMarkerNavigationError.background': p.invalid,
    'editorMarkerNavigationInfo.background': p.func,
    'editorMarkerNavigationWarning.background': p.num,
    'editorOverviewRuler.background': p.mantle,
    'editorOverviewRuler.border': alpha(p.text, 0.07),
    'editorOverviewRuler.modifiedForeground': p.num,
    'editorRuler.foreground': p.surface2,
    'editorStickyScrollHover.background': p.surface0,

    // Extensions UI
    'extensionButton.separator': p.base,
    'extensionButton.prominentHoverBackground': shade(accent, 0.07),
    'extensionBadge.remoteBackground': p.func,
    'extensionBadge.remoteForeground': p.base,
    'extensionIcon.starForeground': p.num,
    'extensionIcon.verifiedForeground': p.str,
    'extensionIcon.preReleaseForeground': p.surface2,
    'extensionIcon.sponsorForeground': p.deco,

    // Lists & trees
    'list.activeSelectionBackground': p.surface0,
    'list.activeSelectionForeground': p.text,
    'list.dropBackground': dropBg,
    'list.focusBackground': p.surface0,
    'list.focusForeground': p.text,
    'list.focusOutline': transparent,
    'list.highlightForeground': accent,
    'list.hoverBackground': alpha(p.surface0, 0.5),
    'list.hoverForeground': p.text,
    'list.inactiveSelectionBackground': p.surface0,
    'list.inactiveSelectionForeground': p.text,
    'list.warningForeground': p.num,
    'listFilterWidget.background': p.surface1,
    'listFilterWidget.noMatchesOutline': p.invalid,
    'listFilterWidget.outline': transparent,
    'tree.indentGuidesStroke': p.overlay2,
    'tree.inactiveIndentGuidesStroke': p.surface1,

    // Menus
    'menu.background': p.base,
    'menu.border': alpha(p.crust, 0.55),
    'menu.foreground': p.text,
    'menu.selectionBackground': p.surface2,
    'menu.selectionBorder': transparent,
    'menu.selectionForeground': p.text,
    'menu.separatorBackground': p.surface2,
    'menubar.selectionBackground': p.surface1,
    'menubar.selectionForeground': p.text,

    // Merge editor
    'merge.commonContentBackground': p.surface1,
    'merge.commonHeaderBackground': p.surface2,
    'merge.currentContentBackground': alpha(p.git.added, 0.2),
    'merge.currentHeaderBackground': alpha(p.git.added, 0.4),
    'merge.incomingContentBackground': alpha(p.func, 0.2),
    'merge.incomingHeaderBackground': alpha(p.func, 0.4),

    // Minimap slider — accent tinted
    'minimapSlider.background': alpha(accent, 0.2),
    'minimapSlider.hoverBackground': alpha(accent, 0.4),
    'minimapSlider.activeBackground': alpha(accent, 0.6),

    // Notifications
    'notificationCenter.border': accent,
    'notificationCenterHeader.foreground': p.text,

    // Panel
    'panel.background': p.base,
    'panel.border': p.surface2,
    'panelSection.border': p.surface2,
    'panelSection.dropBackground': dropBg,
    'panelTitle.activeBorder': accent,
    'panelTitle.activeForeground': p.text,
    'panelTitle.inactiveForeground': p.subtext0,

    // Peek view
    'peekView.border': accent,
    'peekViewEditor.matchHighlightBackground': alpha(p.op, 0.3),
    'peekViewResult.matchHighlightBackground': alpha(p.op, 0.3),
    'peekViewTitle.background': p.base,
    'peekViewTitleDescription.foreground': alpha(p.subtext1, 0.7),
    'peekViewTitleLabel.foreground': p.text,

    // Picker & progress
    'pickerGroup.border': accent,
    'pickerGroup.foreground': accent,
    'progressBar.background': accent,

    // Scrollbar
    'scrollbarSlider.activeBackground': alpha(p.surface0, 0.4),
    'scrollbarSlider.background': alpha(p.surface2, 0.5),
    'scrollbarSlider.hoverBackground': p.overlay0,

    // Settings editor
    'settings.focusedRowBackground': alpha(p.surface2, 0.2),
    'settings.headerForeground': p.text,
    'settings.modifiedItemIndicator': accent,
    'settings.dropdownBackground': p.surface1,
    'settings.dropdownListBorder': transparent,
    'settings.textInputBackground': p.surface1,
    'settings.textInputBorder': transparent,
    'settings.numberInputBackground': p.surface1,
    'settings.numberInputBorder': transparent,

    // Sidebar
    'sideBar.background': p.mantle,
    'sideBar.dropBackground': dropBg,
    'sideBar.foreground': p.text,
    'sideBar.border': thinBorder,
    'sideBarSectionHeader.background': p.mantle,
    'sideBarSectionHeader.foreground': p.text,
    'sideBarTitle.foreground': accent,

    // Banners (Restricted Mode etc.)
    'banner.background': p.surface1,
    'banner.foreground': p.text,
    'banner.iconForeground': accent,

    // Status bar
    'statusBar.background': p.crust,
    'statusBar.foreground': p.text,
    'statusBar.border': thinBorder,
    'statusBar.noFolderBackground': p.crust,
    'statusBar.noFolderForeground': p.text,
    'statusBar.noFolderBorder': thinBorder,
    'statusBar.debuggingBackground': p.num,
    'statusBar.debuggingForeground': p.base,
    'statusBar.debuggingBorder': thinBorder,
    'statusBarItem.remoteBackground': p.func,
    'statusBarItem.remoteForeground': p.base,
    'statusBarItem.activeBackground': alpha(p.surface2, 0.4),
    'statusBarItem.hoverBackground': alpha(p.surface2, 0.2),
    'statusBarItem.prominentForeground': accent,
    'statusBarItem.prominentBackground': transparent,
    'statusBarItem.prominentHoverBackground': alpha(p.surface2, 0.2),
    'statusBarItem.errorForeground': p.invalid,
    'statusBarItem.errorBackground': transparent,
    'statusBarItem.warningForeground': p.num,
    'statusBarItem.warningBackground': transparent,

    // Command center
    'commandCenter.foreground': p.subtext1,
    'commandCenter.background': p.mantle,
    'commandCenter.border': transparent,
    'commandCenter.activeForeground': p.text,
    'commandCenter.activeBackground': p.surface0,
    'commandCenter.activeBorder': accent,
    'commandCenter.inactiveForeground': p.overlay0,
    'commandCenter.inactiveBorder': transparent,

    // Tabs — active tab title & top border in accent
    'tab.activeBackground': p.base,
    'tab.activeBorder': transparent,
    'tab.activeBorderTop': accent,
    'tab.activeForeground': accent,
    'tab.activeModifiedBorder': p.num,
    'tab.border': p.mantle,
    'tab.hoverBackground': shade(p.base, 0.05),
    'tab.hoverBorder': transparent,
    'tab.hoverForeground': accent,
    'tab.inactiveBackground': p.mantle,
    'tab.inactiveForeground': p.overlay0,
    'tab.inactiveModifiedBorder': alpha(p.num, 0.3),
    'tab.lastPinnedBorder': accent,
    'tab.unfocusedActiveBackground': p.mantle,
    'tab.unfocusedActiveBorder': transparent,
    'tab.unfocusedActiveBorderTop': alpha(accent, 0.3),
    'tab.unfocusedInactiveBackground': shade(p.mantle, -0.05),

    // Terminal extras
    'terminal.border': p.surface2,
    'terminal.selectionBackground': p.surface2,
    'terminal.inactiveSelectionBackground': alpha(p.surface2, 0.5),
    'terminalCursor.foreground': mix(p.text, accent, 0.3),
    'terminalCursor.background': p.base,
    'terminal.dropBackground': dropBg,
    'terminal.tab.activeBorder': accent,
    'terminalCommandDecoration.defaultBackground': p.surface2,
    'terminalCommandDecoration.successBackground': p.str,
    'terminalCommandDecoration.errorBackground': p.invalid,

    // Title bar — flush with the crust activity bar, Catppuccin-style
    'titleBar.activeBackground': p.crust,
    'titleBar.activeForeground': p.text,
    'titleBar.inactiveBackground': p.crust,
    'titleBar.inactiveForeground': alpha(p.text, 0.5),
    'titleBar.border': thinBorder,

    // SCM graph (commit graph lanes)
    'scmGraph.foreground1': accent,
    'scmGraph.foreground2': p.func,
    'scmGraph.foreground3': p.str,
    'scmGraph.foreground4': p.num,
    'scmGraph.foreground5': p.tag,
  });
  return c;
}

function buildTheme(label: string, p: Palette): Record<string, unknown> {
  // Pastel pass for code: every syntax role is blended ~20% toward the text
  // color, lowering saturation so long sessions stay low-fatigue. UI chrome
  // (activity bar, tabs, widgets) keeps the full-strength accents.
  const soft = (c: string, amount = 0.28): string => mix(c, p.text, amount);
  const sp: Palette = {
    ...p,
    keyword: soft(p.keyword),
    func: soft(p.func),
    type: soft(p.type),
    str: soft(p.str),
    num: soft(p.num),
    con: soft(p.con),
    op: soft(p.op),
    tag: soft(p.tag),
    attr: soft(p.attr),
    deco: soft(p.deco),
    head: soft(p.head),
    variable: soft(p.variable),
    invalid: soft(p.invalid, 0.1),
  };
  return {
    name: label,
    type: 'dark',
    semanticHighlighting: true,
    colors: buildColors(p),
    tokenColors: buildTokenColors(sp),
    semanticTokenColors: buildSemanticTokenColors(sp),
  };
}

// ---------------------------------------------------------------------------
// Contrast validation (WCAG relative luminance)
// ---------------------------------------------------------------------------

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const themesDir = path.resolve(__dirname, '..', 'themes');
  fs.mkdirSync(themesDir, { recursive: true });

  let failures = 0;
  for (const info of THEME_CATALOG) {
    const p = PALETTES[info.character];
    if (!p) {
      console.error(`No palette defined for character "${info.character}" (${info.label})`);
      failures++;
      continue;
    }

    const theme = buildTheme(info.label, p);
    const outPath = path.join(themesDir, `${info.file}.json`);
    fs.writeFileSync(outPath, JSON.stringify(theme, null, 2) + '\n', 'utf8');

    // Validate: parse back, check required top-level keys, report contrast.
    const parsed = JSON.parse(fs.readFileSync(outPath, 'utf8')) as Record<string, unknown>;
    for (const key of ['name', 'type', 'semanticHighlighting', 'colors', 'tokenColors', 'semanticTokenColors']) {
      if (!(key in parsed)) {
        console.error(`${info.label}: missing "${key}" in generated JSON`);
        failures++;
      }
    }
    const fgContrast = contrastRatio(p.text, p.base);
    const mutedContrast = contrastRatio(p.subtext0, p.base);
    const statusContrast = contrastRatio(p.subtext1, p.crust);
    console.log(
      `${info.label.padEnd(20)} fg/bg ${fgContrast.toFixed(2)}:1  muted ${mutedContrast.toFixed(2)}:1  statusbar ${statusContrast.toFixed(2)}:1`,
    );
    if (fgContrast < 4.5 || mutedContrast < 3 || statusContrast < 3) {
      console.warn(`  ^ low contrast in ${info.label} — review palette`);
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} theme(s) failed validation.`);
    process.exit(1);
  }
  console.log(`\nGenerated ${THEME_CATALOG.length} themes in ${themesDir}`);
}

main();
