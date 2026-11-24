<div align="center">
<img src="assets/icons.png" width="180" alt="MLP FiM Themes icon">

<h1>🦄 Visual Studio Code MLP Themes</h1>

9 pastel dark themes for VS Code, Cursor, Windsurf & VSCodium - the Mane 6
and the Princesses of Equestria, styled with a Catppuccin-inspired design
system and a smart theme switcher.

[![VS Code Marketplace](https://badgen.net/vs-marketplace/v/Arviixzuh.mlp-fim-themes?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Arviixzuh.mlp-fim-themes)
[![Open VSX](https://img.shields.io/open-vsx/v/Arviixzuh/mlp-fim-themes?label=Open%20VSX&logo=eclipse-ide)](https://open-vsx.org/extension/Arviixzuh/mlp-fim-themes)
[![License: MIT](https://img.shields.io/badge/License-MIT-f9e2af?style=flat)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS_Code-%5E1.85.0-89dceb?style=flat)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Themes](https://img.shields.io/badge/Themes-9-f5c2e7?style=flat)](#themes)

</div>

## Overview

MLP Themes brings the Mane 6 and the Princesses of Equestria into your
editor. Every theme shares the same layered surface hierarchy (`crust` →
`mantle` → `base` → `surface0-2` → `overlay0-2`), Catppuccin-style invisible
structural borders, accent-driven chrome, pastel-softened syntax colors, a
16-color terminal palette, bracket pair colorization, and Git decorations -
no pure blacks, no neon, no eye strain on long sessions.

On top of the themes, a lightweight extension adds a status bar quick
switcher with live preview, keyboard cycling, per-workspace overrides, and a
Celestia-by-day / Luna-by-night auto-schedule.

## Themes

| Theme                                                                                     | Character         | Signature accents                                                   |
| ----------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------- |
| ![Twilight Sparkle](https://img.shields.io/badge/-lavender%20%23cba6f7-141221?style=flat) | Twilight Sparkle  | `#cba6f7` mauve · `#f5c2e7` pink · `#f9e2af` cream                  |
| ![Rainbow Dash](https://img.shields.io/badge/-sky%20%2389dceb-111824?style=flat)          | Rainbow Dash      | `#89dceb` sky · `#74c7ec` sapphire · `#f38ba8` coral                |
| ![Fluttershy](https://img.shields.io/badge/-rose%20%23f5c2e7-1e151a?style=flat)           | Fluttershy        | `#f9e2af` buttercream · `#f5e0dc` rosewater · `#a6e3a1` sage        |
| ![Rarity](https://img.shields.io/badge/-periwinkle%20%23b4befe-14151e?style=flat)         | Rarity            | `#cdd6f4` pearl · `#89b4fa` sapphire · `#cba6f7` amethyst           |
| ![Applejack](https://img.shields.io/badge/-peach%20%23fab387-191512?style=flat)           | Applejack         | `#fab387` peach · `#f9e2af` yellow · `#a6e3a1` orchard              |
| ![Pinkie Pie](https://img.shields.io/badge/-flamingo%20%23f2cdcd-191219?style=flat)       | Pinkie Pie        | `#f2cdcd` flamingo · `#f5c2e7` pink · `#89dceb` sky                 |
| ![Princess Luna](https://img.shields.io/badge/-midnight%20%2389b4fa-0e101c?style=flat)    | Princess Luna     | `#89b4fa` starry blue · `#bac2de` lunar silver · `#b4befe` lavender |
| ![Princess Celestia](https://img.shields.io/badge/-solar%20%23f9e2af-181518?style=flat)   | Princess Celestia | `#f9e2af` solar gold · `#fab387` peach · `#94e2d5` teal             |
| ![Sunset Shimmer](https://img.shields.io/badge/-ember%20%23eba0ac-191314?style=flat)      | Sunset Shimmer    | `#fab387` peach · `#eba0ac` maroon · `#f38ba8` coral                |

## Key Features

- 9 complete themes with full workbench coverage: editor, sidebar, tabs,
  status bar, title bar, panel, inputs, lists, scrollbars, and focus rings.
- TextMate scopes + semantic tokens tuned for TypeScript/JavaScript, Rust,
  Java, Python, HTML/CSS, JSON, SQL, and Markdown.
- `$(sparkle)` status bar item — click for a quick pick with **live preview**
  that reverts on cancel.
- `MLP Themes: Next Theme` command (`Ctrl+Alt+T` / `Cmd+Alt+T`) to cycle.
- `MLP Themes: Set Workspace Theme` for per-workspace overrides.
- Celestia/Luna auto-schedule with configurable day/night hours.
- Fully generated theme JSON — one source of truth, zero drift between themes.

## Architecture

The project is split into three small, well-separated pieces:

- `src/extension.ts` is the runtime extension: status bar item, commands,
  quick pick, and the auto-schedule timer. Zero runtime dependencies.
- `src/palette-generator.ts` is a build-time script that compiles the
  structured Catppuccin-style tokens into the 9 theme JSON files under
  `themes/`, and validates contrast ratios for every output.
- `src/theme-catalog.ts` is the shared metadata (labels, files, taglines)
  consumed by both the generator and the extension.

### How it works

`npm run build:themes` compiles the TypeScript sources and runs the
generator, which emits one `themes/<character>.json` per pony. VS Code loads
those files via `contributes.themes` in `package.json`. At runtime the
extension reads `workbench.colorTheme`, applies themes with
`workspace.getConfiguration().update()`, and evaluates the auto-schedule on
startup and every 60 seconds.

## Project Structure

```text
├── package.json              # manifest: themes, commands, settings, keybindings
├── tsconfig.json             # strict TypeScript
├── src/
│   ├── extension.ts          # status bar, quick pick, commands, auto-schedule
│   ├── palette-generator.ts  # build-time theme JSON generator + contrast check
│   └── theme-catalog.ts      # shared theme metadata
├── themes/                   # 9 generated theme JSON files
├── assets/icons.png          # extension icon
├── .github/workflows/        # publish pipeline (vsce → Marketplace + Open VSX)
├── README.md / LICENSE / CHANGELOG.md
└── mlp-fim-themes.vsix       # packaged extension (gitignored)
```

## Requirements

- VS Code `^1.85.0` — also works in Cursor, Windsurf, and VSCodium.
- Node.js 18+ and npm (development only).

## Getting Started

### Install

**Marketplace / Open VSX:** open the Extensions view (`Ctrl+Shift+X`),
search **"My Little Pony: Friendship is Magic Themes"**, install, then pick a
theme via `Preferences: Color Theme` or the status bar sparkle.

**From source:**

```powershell
git clone https://github.com/Arviixzuh/vscode-mlp-themes.git
cd vscode-mlp-themes
npm install
npm run compile
npm run package   # → mlp-fim-themes-*.vsix
code --install-extension mlp-fim-themes-*.vsix
```

**Development host:** open the folder in VS Code and press `F5` — an
Extension Development Host window opens with the extension loaded.

## Usage

| Action                                  | Result                              |
| --------------------------------------- | ----------------------------------- |
| Click the `$(sparkle)` status bar item  | Quick pick with live theme preview  |
| `MLP Themes: Next Theme` / `Ctrl+Alt+T` | Cycle through all 9 themes          |
| `MLP Themes: Set Workspace Theme`       | Bind a theme to this workspace only |
| `mlpThemes.autoSchedule.enabled`        | Celestia by day, Luna by night      |

```jsonc
{
  "mlpThemes.showStatusBarItem": true,
  "mlpThemes.autoSchedule.enabled": false,
  "mlpThemes.autoSchedule.dayTheme": "Princess Celestia",
  "mlpThemes.autoSchedule.nightTheme": "Princess Luna",
  "mlpThemes.autoSchedule.dayStartHour": 7,
  "mlpThemes.autoSchedule.nightStartHour": 19,
}
```

Hours are `0–23` local time and may wrap past midnight (`9` → `2` works).

## Development

```powershell
npm install
npm run build:themes   # regenerate themes/*.json from src/palette-generator.ts
npm run compile        # strict TypeScript build → out/
npm run lint           # typecheck only
npm run package        # vsce package → .vsix
```

Theme JSON is fully generated — edit `src/palette-generator.ts` (character
palettes live there) and re-run `npm run build:themes`. The script validates
each generated file and prints WCAG contrast ratios for foreground, muted,
and status bar text.

## License

[MIT](LICENSE)

_My Little Pony: Friendship is Magic_ and its characters are trademarks of
Hasbro. This is an unofficial fan project, not affiliated with or endorsed
by Hasbro.
