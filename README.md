<div align="center">

<img src="assets/icons.png" width="180" alt="MLP FiM Themes icon">

# My Little Pony: Friendship is Magic Themes

**9 pastel dark themes for VS Code, Cursor, Windsurf & VSCodium** —
the Mane 6 and the Princesses of Equestria, styled with a
Catppuccin-inspired design system.

[![License: MIT](https://img.shields.io/badge/License-MIT-rosewater?style=flat)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.85.0-89dceb?style=flat)](https://code.visualstudio.com/)

</div>

Low-fatigue by design: layered dark surfaces, soft pastel syntax colors,
Catppuccin-style invisible borders, accent-driven chrome, and a smart
switcher with live preview and a Celestia-by-day / Luna-by-night schedule.

---

## Themes

| Theme | Character | Signature accents |
| --- | --- | --- |
| ![Twilight Sparkle](https://img.shields.io/badge/-lavender%20%23cba6f7-141221?style=flat) | Twilight Sparkle | `#cba6f7` mauve · `#f5c2e7` pink · `#f9e2af` cream |
| ![Rainbow Dash](https://img.shields.io/badge/-sky%20%2389dceb-111824?style=flat) | Rainbow Dash | `#89dceb` sky · `#74c7ec` sapphire · `#f38ba8` coral |
| ![Fluttershy](https://img.shields.io/badge/-rose%20%23f5c2e7-1e151a?style=flat) | Fluttershy | `#f9e2af` buttercream · `#f5e0dc` rosewater · `#a6e3a1` sage |
| ![Rarity](https://img.shields.io/badge/-periwinkle%20%23b4befe-14151e?style=flat) | Rarity | `#cdd6f4` pearl · `#89b4fa` sapphire · `#cba6f7` amethyst |
| ![Applejack](https://img.shields.io/badge/-peach%20%23fab387-191512?style=flat) | Applejack | `#fab387` peach · `#f9e2af` yellow · `#a6e3a1` orchard |
| ![Pinkie Pie](https://img.shields.io/badge/-flamingo%20%23f2cdcd-191219?style=flat) | Pinkie Pie | `#f2cdcd` flamingo · `#f5c2e7` pink · `#89dceb` sky |
| ![Princess Luna](https://img.shields.io/badge/-midnight%20%2389b4fa-0e101c?style=flat) | Princess Luna | `#89b4fa` starry blue · `#bac2de` lunar silver · `#b4befe` lavender |
| ![Princess Celestia](https://img.shields.io/badge/-solar%20%23f9e2af-181518?style=flat) | Princess Celestia | `#f9e2af` solar gold · `#fab387` peach · `#94e2d5` teal |
| ![Sunset Shimmer](https://img.shields.io/badge/-ember%20%23eba0ac-191314?style=flat) | Sunset Shimmer | `#fab387` peach · `#eba0ac` maroon · `#f38ba8` coral |

All nine share the same layered surface hierarchy (`crust` → `mantle` →
`base` → `surface0-2`), pastel-softened syntax colors, 16-color terminal
palette, bracket pair colorization, and Git decorations. No pure blacks,
no neon.

## Features

- **$(sparkle) Status bar switcher** — click it (bottom-right) for a quick
  pick with live preview; it reverts if you cancel.
- **Keyboard cycling** — `Ctrl+Alt+T` (`Cmd+Alt+T` on macOS) cycles themes.
- **Workspace overrides** — bind a theme to one workspace's settings.
- **Auto-schedule** — day/night themes with configurable hours.

## Install

**Marketplace / Open VSX:** Extensions view (`Ctrl+Shift+X`) → search
**"My Little Pony: Friendship is Magic Themes"** → install → pick a theme via
`Preferences: Color Theme` or the status bar sparkle.

**From source:**

```bash
git clone https://github.com/Arviixzuh/vscode-mlp-themes.git
cd vscode-mlp-themes
npm install
npm run compile
npm run package   # → mlp-fim-themes-*.vsix
code --install-extension mlp-fim-themes-*.vsix
```

## Commands

| Command | Keybinding | What it does |
| --- | --- | --- |
| `MLP Themes: Pick Theme` | — | Quick pick with live preview |
| `MLP Themes: Next Theme` | `Ctrl+Alt+T` / `Cmd+Alt+T` | Cycle all 9 themes |
| `MLP Themes: Set Workspace Theme` | — | Per-workspace theme override |

## Settings

```jsonc
{
  "mlpThemes.showStatusBarItem": true,

  // Celestia by day, Luna by night — checked on startup and every minute.
  "mlpThemes.autoSchedule.enabled": false,
  "mlpThemes.autoSchedule.dayTheme": "Princess Celestia",
  "mlpThemes.autoSchedule.nightTheme": "Princess Luna",
  "mlpThemes.autoSchedule.dayStartHour": 7,
  "mlpThemes.autoSchedule.nightStartHour": 19
}
```

Hours are `0–23` local time and may wrap past midnight
(e.g. `9` → `2` works as expected).

## Development

```bash
npm install
npm run build:themes   # regenerate themes/*.json
npm run compile        # strict TypeScript build → out/
npm run lint           # typecheck only
npm run package        # vsce package → .vsix
```

Theme JSON is fully generated — edit `src/palette-generator.ts` and re-run
`npm run build:themes`. The script validates each file and prints WCAG
contrast ratios.

---

## License

[MIT](LICENSE)

*My Little Pony: Friendship is Magic* and its characters are trademarks of
Hasbro. This is an unofficial fan project, not affiliated with or endorsed
by Hasbro.
