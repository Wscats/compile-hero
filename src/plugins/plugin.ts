/**
 * Plugin interface for compile-hero
 * Each language compiler implements this interface
 */

import * as vscode from 'vscode'

export interface CompileResult {
  success: boolean
  outputPath?: string
  error?: string
  warnings?: string[]
}

export interface CompilerPlugin {
  /** Unique identifier for this plugin */
  readonly id: string
  /** Human-readable name */
  readonly name: string
  /** File extensions this plugin handles (without dot) */
  readonly extensions: string[]
  /** VSCode language IDs this plugin handles */
  readonly languageIds: string[]

  /**
   * Compile the given file and write output to outputPath
   */
  compile(inputPath: string, outputPath: string, options?: Record<string, unknown>): Promise<CompileResult>

  /**
   * Check if this plugin can handle the given file
   */
  canHandle(filePath: string): boolean
}

// ─── Plugin Registry ──────────────────────────────────────────────────────────
export class PluginRegistry {
  private plugins = new Map<string, CompilerPlugin>()
  private diagnosticCollection: vscode.DiagnosticCollection

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('compile-hero')
  }

  register(plugin: CompilerPlugin): void {
    this.plugins.set(plugin.id, plugin)
  }

  findPlugin(filePath: string): CompilerPlugin | undefined {
    for (const plugin of this.plugins.values()) {
      if (plugin.canHandle(filePath)) return plugin
    }
    return undefined
  }

  getAll(): CompilerPlugin[] {
    return [...this.plugins.values()]
  }

  async compileFile(
    inputPath: string,
    outputPath: string,
    statusBar: vscode.StatusBarItem
  ): Promise<void> {
    const plugin = this.findPlugin(inputPath)
    if (!plugin) {
      vscode.window.showWarningMessage(`No compiler found for: ${inputPath}`)
      return
    }

    statusBar.text = `$(sync~spin) Compiling ${plugin.name}...`
    statusBar.show()

    try {
      const result = await plugin.compile(inputPath, outputPath)

      if (result.success) {
        // Clear diagnostics on success
        this.diagnosticCollection.delete(vscode.Uri.file(inputPath))
        statusBar.text = `$(check) Compiled successfully`
        setTimeout(() => statusBar.hide(), 3000)
      } else {
        // Push error to Problems panel
        const uri = vscode.Uri.file(inputPath)
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(0, 0, 0, 0),
          result.error ?? 'Compilation failed',
          vscode.DiagnosticSeverity.Error
        )
        this.diagnosticCollection.set(uri, [diagnostic])
        statusBar.text = `$(error) Compilation failed`
        setTimeout(() => statusBar.hide(), 5000)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      statusBar.text = `$(error) ${message}`
      setTimeout(() => statusBar.hide(), 5000)
    }
  }

  dispose(): void {
    this.diagnosticCollection.dispose()
  }
}
