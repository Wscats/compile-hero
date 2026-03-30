/**
 * Plugin interface for compile-hero
 * Each language compiler implements this interface
 * Follows spec.md section 2.6 CompilerPlugin interface
 */

import * as vscode from "vscode";

export interface CompileInput {
  /** Absolute path to the source file */
  inputPath: string;
  /** Absolute path for the output file */
  outputPath: string;
  /** Optional compiler-specific options */
  options?: Record<string, unknown>;
}

export interface CompileOutput {
  success: boolean;
  outputPath?: string;
  error?: string;
  warnings?: string[];
}

/**
 * Core plugin interface — every compiler plugin must implement this.
 * Plugins are lazily loaded via dynamic import() to minimize activation overhead.
 */
export interface CompilerPlugin {
  /** Unique identifier for this plugin */
  readonly id: string;
  /** Human-readable name */
  readonly name: string;
  /** File extensions this plugin handles (without dot) */
  readonly supportedExtensions: readonly string[];
  /** VSCode language IDs this plugin handles */
  readonly languageIds: readonly string[];

  /**
   * Compile the given file and write output to outputPath
   */
  compile(input: CompileInput): Promise<CompileOutput>;

  /**
   * Check if this plugin can handle the given file
   */
  canHandle(filePath: string): boolean;

  /**
   * Release any resources held by this plugin
   */
  dispose(): void;
}

// ─── Plugin Registry ──────────────────────────────────────────────────────────
export class PluginRegistry {
  private readonly plugins = new Map<string, CompilerPlugin>();
  private readonly diagnosticCollection: vscode.DiagnosticCollection;

  constructor() {
    this.diagnosticCollection =
      vscode.languages.createDiagnosticCollection("compile-hero");
  }

  register(plugin: CompilerPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  findPlugin(filePath: string): CompilerPlugin | undefined {
    for (const plugin of this.plugins.values()) {
      if (plugin.canHandle(filePath)) return plugin;
    }
    return undefined;
  }

  getAll(): CompilerPlugin[] {
    return [...this.plugins.values()];
  }

  async compileFile(
    inputPath: string,
    outputPath: string,
    statusBar: vscode.StatusBarItem,
  ): Promise<void> {
    const plugin = this.findPlugin(inputPath);
    if (!plugin) {
      void vscode.window.showWarningMessage(
        `No compiler found for: ${inputPath}`,
      );
      return;
    }

    statusBar.text = `$(sync~spin) Compiling ${plugin.name}...`;
    statusBar.show();

    try {
      const result = await plugin.compile({ inputPath, outputPath });

      if (result.success) {
        // Clear diagnostics on success
        this.diagnosticCollection.delete(vscode.Uri.file(inputPath));
        statusBar.text = `$(check) Compiled successfully`;
        setTimeout(() => {
          statusBar.hide();
        }, 3000);
      } else {
        // Push error to Problems panel (never use showErrorMessage for recoverable errors)
        const uri = vscode.Uri.file(inputPath);
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(0, 0, 0, 0),
          result.error ?? "Compilation failed",
          vscode.DiagnosticSeverity.Error,
        );
        this.diagnosticCollection.set(uri, [diagnostic]);
        statusBar.text = `$(error) Compilation failed`;
        setTimeout(() => {
          statusBar.hide();
        }, 5000);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      statusBar.text = `$(error) ${message}`;
      setTimeout(() => {
        statusBar.hide();
      }, 5000);
    }
  }

  dispose(): void {
    for (const plugin of this.plugins.values()) {
      plugin.dispose();
    }
    this.diagnosticCollection.dispose();
  }
}

