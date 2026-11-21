import * as vscode from 'vscode';
import { THEME_CATALOG, ThemeInfo } from './theme-catalog';

const WORKBENCH_SECTION = 'workbench';
const CONFIG_SECTION = 'mlpThemes';

let statusBarItem: vscode.StatusBarItem | undefined;
let scheduleTimer: NodeJS.Timeout | undefined;

function currentThemeLabel(): string {
  return vscode.workspace
    .getConfiguration(WORKBENCH_SECTION)
    .get<string>('colorTheme', '');
}

function findTheme(label: string): ThemeInfo | undefined {
  return THEME_CATALOG.find((t) => t.label === label);
}

async function applyTheme(
  label: string,
  target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global,
): Promise<void> {
  await vscode.workspace
    .getConfiguration(WORKBENCH_SECTION)
    .update('colorTheme', label, target);
}

function updateStatusBar(): void {
  if (!statusBarItem) {
    return;
  }
  const label = currentThemeLabel();
  const theme = findTheme(label);
  statusBarItem.text = theme ? `$(sparkle) ${theme.label}` : '$(sparkle) MLP Themes';
  statusBarItem.tooltip = theme
    ? `Active theme: ${theme.label}\n${theme.description}\nClick to switch themes.`
    : 'Click to switch MLP themes.';
}

function refreshStatusBarVisibility(): void {
  const show = vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .get<boolean>('showStatusBarItem', true);
  if (show && !statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      90,
    );
    statusBarItem.command = 'mlpThemes.quickPickTheme';
    statusBarItem.show();
  } else if (!show && statusBarItem) {
    statusBarItem.dispose();
    statusBarItem = undefined;
  }
  updateStatusBar();
}

/** Quick pick with live preview: highlights a theme, applies it immediately,
 *  and reverts on hide unless the user accepted a selection. */
function pickTheme(): Thenable<ThemeInfo | undefined> {
  return new Promise((resolve) => {
    const original = currentThemeLabel();
    let previewed: string | undefined;
    let accepted = false;

    const qp = vscode.window.createQuickPick<ThemeInfo>();
    qp.title = 'My Little Pony: Friendship is Magic Themes';
    qp.placeholder = 'Pick a theme — selection is previewed live';
    qp.items = THEME_CATALOG;
    qp.matchOnDescription = true;
    qp.matchOnDetail = true;

    qp.onDidChangeSelection(async (selection) => {
      const picked = selection[0];
      if (picked && picked.label !== currentThemeLabel()) {
        previewed = picked.label;
        await applyTheme(picked.label);
      }
    });

    qp.onDidAccept(() => {
      const picked = qp.selectedItems[0];
      accepted = true;
      qp.hide();
      resolve(picked);
    });

    qp.onDidHide(async () => {
      if (!accepted && previewed && previewed !== original) {
        await applyTheme(original);
      }
      previewed = undefined;
      accepted = false;
      qp.dispose();
      resolve(undefined);
    });

    qp.show();
  });
}

async function quickPickTheme(): Promise<void> {
  await pickTheme();
}

async function nextTheme(): Promise<void> {
  const current = currentThemeLabel();
  const idx = THEME_CATALOG.findIndex((t) => t.label === current);
  const next = THEME_CATALOG[(idx + 1) % THEME_CATALOG.length];
  await applyTheme(next.label);
  vscode.window.showInformationMessage(`MLP theme: ${next.label}`);
}

async function setWorkspaceTheme(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showWarningMessage('MLP Themes: no workspace folder open.');
    return;
  }
  const picked = await pickTheme();
  if (!picked) {
    return;
  }
  await applyTheme(picked.label, vscode.ConfigurationTarget.Workspace);
  vscode.window.showInformationMessage(
    `MLP Themes: "${picked.label}" is now the theme for this workspace.`,
  );
}

// ---------------------------------------------------------------------------
// Celestia / Luna auto-schedule
// ---------------------------------------------------------------------------

function scheduledTheme(): string | undefined {
  const cfg = vscode.workspace.getConfiguration(`${CONFIG_SECTION}.autoSchedule`);
  if (!cfg.get<boolean>('enabled', false)) {
    return undefined;
  }
  const hour = new Date().getHours();
  const dayStart = cfg.get<number>('dayStartHour', 7);
  const nightStart = cfg.get<number>('nightStartHour', 19);
  const isDay =
    dayStart <= nightStart
      ? hour >= dayStart && hour < nightStart
      : hour >= dayStart || hour < nightStart;
  return cfg.get<string>(isDay ? 'dayTheme' : 'nightTheme', 'Princess Celestia');
}

async function applyScheduledTheme(): Promise<void> {
  const desired = scheduledTheme();
  if (desired && desired !== currentThemeLabel() && findTheme(desired)) {
    await applyTheme(desired);
  }
}

function startScheduler(): void {
  stopScheduler();
  scheduleTimer = setInterval(() => {
    void applyScheduledTheme();
  }, 60_000);
}

function stopScheduler(): void {
  if (scheduleTimer) {
    clearInterval(scheduleTimer);
    scheduleTimer = undefined;
  }
}

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

export function activate(context: vscode.ExtensionContext): void {
  refreshStatusBarVisibility();

  context.subscriptions.push(
    vscode.commands.registerCommand('mlpThemes.quickPickTheme', quickPickTheme),
    vscode.commands.registerCommand('mlpThemes.nextTheme', nextTheme),
    vscode.commands.registerCommand('mlpThemes.setWorkspaceTheme', setWorkspaceTheme),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(CONFIG_SECTION)) {
        refreshStatusBarVisibility();
        void applyScheduledTheme();
      }
      if (e.affectsConfiguration('workbench.colorTheme')) {
        updateStatusBar();
      }
      if (e.affectsConfiguration(`${CONFIG_SECTION}.autoSchedule`)) {
        void applyScheduledTheme();
      }
    }),
  );

  startScheduler();
  context.subscriptions.push({ dispose: stopScheduler });

  // Evaluate schedule shortly after startup (lets the workbench settle first).
  setTimeout(() => void applyScheduledTheme(), 2000);
}

export function deactivate(): void {
  stopScheduler();
}
