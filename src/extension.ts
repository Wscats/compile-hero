/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */


import * as vscode from 'vscode'
import * as path from 'path'
import { PluginRegistry } from './plugins/plugin'
import { SassPlugin, LessPlugin, TypeScriptPlugin, PugPlugin } from './plugins/compilers'

let statusBarItem: vscode.StatusBarItem
let registry: PluginRegistry

export function activate(context: vscode.ExtensionContext): void {
  // Initialize plugin registry and register all compiler plugins
  registry = new PluginRegistry()
  registry.register(new SassPlugin())
  registry.register(new LessPlugin())
  registry.register(new TypeScriptPlugin())
  registry.register(new PugPlugin())

  // Status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)
  statusBarItem.text = '$(zap) Compile Hero'
  context.subscriptions.push(statusBarItem)

  // Command: compile current file
  const compileFileCmd = vscode.commands.registerCommand(
    'compile-hero.compileFile',
    async (uri?: vscode.Uri) => {
      const filePath = uri?.fsPath ?? vscode.window.activeTextEditor?.document.uri.fsPath
      if (!filePath) {
        vscode.window.showErrorMessage('No file selected to compile.')
        return
      }
      const outputPath = resolveOutputPath(filePath)
      await registry.compileFile(filePath, outputPath, statusBarItem)
    }
  )

  // Command: compile on save (triggered by file watcher)
  const config = vscode.workspace.getConfiguration('compile-hero')
  const autoCompile = !config.get<boolean>('disable-compile-files-on-did-save-code', false)

  if (autoCompile) {
    const saveWatcher = vscode.workspace.onDidSaveTextDocument(async (doc) => {
      const plugin = registry.findPlugin(doc.uri.fsPath)
      if (!plugin) return
      const outputPath = resolveOutputPath(doc.uri.fsPath)
      await registry.compileFile(doc.uri.fsPath, outputPath, statusBarItem)
    })
    context.subscriptions.push(saveWatcher)
  }

  context.subscriptions.push(compileFileCmd)
  context.subscriptions.push({ dispose: () => registry.dispose() })
}

function resolveOutputPath(inputPath: string): string {
  const config = vscode.workspace.getConfiguration('compile-hero')
  const ext = path.extname(inputPath).slice(1).toLowerCase()

  const outputDirKey = `${ext}-output-directory`
  const outputDir = config.get<string>(outputDirKey, './dist')

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(inputPath))
  const baseDir = workspaceFolder?.uri.fsPath ?? path.dirname(inputPath)

  // Support template variables: ${workspaceFolder}, ${relativeDir}
  const relativeDir = path.relative(baseDir, path.dirname(inputPath))
  const resolvedDir = outputDir
    .replace('${workspaceFolder}', baseDir)
    .replace('${relativeDir}', relativeDir)

  const outputExtMap: Record<string, string> = {
    sass: 'css', scss: 'css', less: 'css', stylus: 'css',
    ts: 'js', tsx: 'js',
    pug: 'html', jade: 'html',
  }

  const outputExt = outputExtMap[ext] ?? ext
  const baseName = path.basename(inputPath, path.extname(inputPath))
  return path.resolve(baseDir, resolvedDir, `${baseName}.${outputExt}`)
}

export function deactivate(): void {
  statusBarItem?.dispose()
  registry?.dispose()
}
