/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

import * as vscode from "vscode";
import * as path from "path";
import { PluginRegistry } from "./plugins/plugin";

let statusBarItem: vscode.StatusBarItem;
let registry: PluginRegistry;

// ─── Debounce: prevent rapid re-compilation on multiple saves ─────────────────
const DEBOUNCE_MS = 300;
const pendingCompiles = new Map<string, ReturnType<typeof setTimeout>>();

function debounceCompile(filePath: string, fn: () => Promise<void>): void {
  const existing = pendingCompiles.get(filePath);
  if (existing) clearTimeout(existing);
  pendingCompiles.set(
    filePath,
    setTimeout(() => {
      pendingCompiles.delete(filePath);
      void fn();
    }, DEBOUNCE_MS),
  );
}

export function activate(context: vscode.ExtensionContext): void {
  // ── Lazy-load plugins: only instantiated on first use (spec.md 2.6) ─────────
  // Plugins are NOT eagerly imported at activation — they are registered as
  // factory functions and instantiated only when a matching file is compiled.
  registry = new PluginRegistry();

  // Dynamic import factories — compiler deps (sass, less, typescript, pug)
  // are NOT bundled; they are resolved from the workspace node_modules at runtime.
  void import("./plugins/compilers").then(({ SassPlugin, LessPlugin, TypeScriptPlugin, PugPlugin }) => {
    registry.register(new SassPlugin());
    registry.register(new LessPlugin());
    registry.register(new TypeScriptPlugin());
    registry.register(new PugPlugin());
  });

  // Status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "$(zap) Compile Hero";
  context.subscriptions.push(statusBarItem);

  // Command: compile current file
  const compileFileCmd = vscode.commands.registerCommand(
    "compile-hero.compileFile",
    async (uri?: vscode.Uri) => {
      const filePath = uri?.fsPath ?? vscode.window.activeTextEditor?.document.uri.fsPath;
      if (!filePath) {
        void vscode.window.showErrorMessage("No file selected to compile.");
        return;
      }
      const outputPath = resolveOutputPath(filePath);
      await registry.compileFile(filePath, outputPath, statusBarItem);
    },
  );

  // Command: compile on save — debounced to avoid rapid re-compilation
  const config = vscode.workspace.getConfiguration("compile-hero");
  const autoCompile = !config.get<boolean>("disable-compile-files-on-did-save-code", false);

  if (autoCompile) {
    const saveWatcher = vscode.workspace.onDidSaveTextDocument((doc) => {
      const plugin = registry.findPlugin(doc.uri.fsPath);
      if (!plugin) return;
      const outputPath = resolveOutputPath(doc.uri.fsPath);
      debounceCompile(doc.uri.fsPath, () =>
        registry.compileFile(doc.uri.fsPath, outputPath, statusBarItem),
      );
    });
    context.subscriptions.push(saveWatcher);
  }

  context.subscriptions.push(compileFileCmd);
  context.subscriptions.push({ dispose: () => registry.dispose() });
}

// ─── Output path resolution with LRU cache ───────────────────────────────────
// Cache up to 100 entries; key = inputPath + workspaceFolder
const OUTPUT_PATH_CACHE = new Map<string, string>();
const OUTPUT_PATH_CACHE_MAX = 100;

function resolveOutputPath(inputPath: string): string {
  const cached = OUTPUT_PATH_CACHE.get(inputPath);
  if (cached) return cached;

  const config = vscode.workspace.getConfiguration("compile-hero");
  const ext = path.extname(inputPath).slice(1).toLowerCase();

  const outputDirKey = `${ext}-output-directory`;
  const outputDir = config.get<string>(outputDirKey, "./dist");

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(inputPath));
  const baseDir = workspaceFolder?.uri.fsPath ?? path.dirname(inputPath);

  // Support template variables: ${workspaceFolder}, ${relativeDir}
  const relativeDir = path.relative(baseDir, path.dirname(inputPath));
  const resolvedDir = outputDir
    .replace("${workspaceFolder}", baseDir)
    .replace("${relativeDir}", relativeDir);

  const outputExtMap: Record<string, string> = {
    sass: "css",
    scss: "css",
    less: "css",
    stylus: "css",
    ts: "js",
    tsx: "js",
    pug: "html",
    jade: "html",
  };

  const outputExt = outputExtMap[ext] ?? ext;
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const result = path.resolve(baseDir, resolvedDir, `${baseName}.${outputExt}`);

  // Evict oldest entry if cache is full
  if (OUTPUT_PATH_CACHE.size >= OUTPUT_PATH_CACHE_MAX) {
    const firstKey = OUTPUT_PATH_CACHE.keys().next().value;
    if (firstKey !== undefined) OUTPUT_PATH_CACHE.delete(firstKey);
  }
  OUTPUT_PATH_CACHE.set(inputPath, result);

  return result;
}

export function deactivate(): void {
  statusBarItem?.dispose();
  registry?.dispose();
  OUTPUT_PATH_CACHE.clear();
  for (const timer of pendingCompiles.values()) clearTimeout(timer);
  pendingCompiles.clear();
}
