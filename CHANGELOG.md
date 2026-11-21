# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-21

### Added

- 9 Catppuccin-inspired pastel dark themes: Twilight Sparkle, Rainbow Dash,
  Fluttershy, Rarity, Applejack, Pinkie Pie, Princess Luna, Princess Celestia,
  and Sunset Shimmer.
- Build-time theme generator (`npm run build:themes`) producing full VS Code
  theme JSON with workbench colors, TextMate scopes, semantic tokens,
  bracket pair colorization, 16-color terminal ANSI palette, and Git decorations.
- Status bar quick switcher with live preview (`$(sparkle)` item, bottom-right).
- `MLP Themes: Next Theme` command with `Ctrl+Alt+T` / `Cmd+Alt+T` keybinding.
- `MLP Themes: Set Workspace Theme` command for per-workspace overrides.
- Celestia/Luna auto-schedule mode (`mlpThemes.autoSchedule.*`) with configurable
  day/night hours and a lightweight timer.
- GitHub Actions workflow for lint, theme build, `vsce package`, and publishing
  to the VS Code Marketplace and Open VSX.
