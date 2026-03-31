/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - VSCode Extension entry point.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';
import * as fs from 'fs';

import { StatusBarUi } from './status';
import {
  command,
  transformPort,
  complieDir,
  complieFile,
  readFileName,
  getSelectedText,
  openBrowser,
  fileType,
  suffixs,
} from './util';
const { formatters, formatActiveDocument } = require('./beautify');

/**
 * Called when the extension is activated.
 * Registers all commands, event listeners, and initializes the status bar.
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('Congratulations, compile hero is now active!');

  // ── Commands ─────────────────────────────────────────────────────────────

  const openInBrowser = vscode.commands.registerCommand(
    'compile-hero.openInBrowser',
    (path: vscode.Uri) => {
      const uri = path.fsPath;
      openBrowser(uri);
    },
  );

  const closePort = vscode.commands.registerCommand(
    'compile-hero.closePort',
    async () => {
      const inputPort = await vscode.window.showInputBox({
        placeHolder: 'Enter the port you need to close?',
      });
      if (!inputPort) {
        return;
      }
      const info = await command(`lsof -i :${inputPort}`);
      const port = transformPort(info);
      if (port) {
        await command(`kill -9 ${port}`);
        vscode.window.setStatusBarMessage('Port closed successfully!');
      }
    },
  );

  const compileFile = vscode.commands.registerCommand(
    'compile-hero.compileFile',
    (path: vscode.Uri) => {
      const uri = path.fsPath;
      try {
        if (fs.readdirSync(uri).length > 0) {
          complieDir(uri);
        } else {
          complieFile(uri);
        }
      } catch {
        complieFile(uri);
      }
    },
  );

  const compileSelected = vscode.commands.registerCommand(
    'compile-hero.compileSelected',
    (path?: vscode.Uri) => {
      const uri = path
        ? path.fsPath
        : vscode.window.activeTextEditor?.document.uri.fsPath;
      if (!uri) {
        return;
      }
      const selectedText = getSelectedText();
      readFileName({ fileName: uri, selectedText });
    },
  );

  const compileHeroOn = vscode.commands.registerCommand(
    'compile-hero.compileHeroOn',
    () => {
      const config = vscode.workspace.getConfiguration('compile-hero');
      config.update('disable-compile-files-on-did-save-code', true);
      StatusBarUi.notWatching();
    },
  );

  const compileHeroOff = vscode.commands.registerCommand(
    'compile-hero.compileHeroOff',
    () => {
      const config = vscode.workspace.getConfiguration('compile-hero');
      config.update('disable-compile-files-on-did-save-code', false);
      StatusBarUi.watching();
    },
  );

  // ── Event Listeners ──────────────────────────────────────────────────────

  const compileHeroStatus = vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      if (!editor?.document.fileName) {
        StatusBarUi.hide();
        return;
      }
      // Only show status bar for supported file types
      if (suffixs.includes(fileType(editor.document.fileName))) {
        StatusBarUi.show();
      } else {
        StatusBarUi.hide();
      }
    },
  );

  const compileHeroConfigure = vscode.workspace.onDidChangeConfiguration(() => {
    // Update status bar when configuration changes
    const config = vscode.workspace.getConfiguration('compile-hero');
    const isDisable = config.get<boolean>('disable-compile-files-on-did-save-code');
    if (isDisable) {
      StatusBarUi.notWatching();
    } else {
      StatusBarUi.watching();
    }
  });

  // ── Beautify ─────────────────────────────────────────────────────────────

  formatters.configure();
  const beautify = vscode.commands.registerCommand(
    'compile-hero.beautify',
    formatActiveDocument.bind(0, true),
  );
  const beautifyFile = vscode.commands.registerCommand(
    'compile-hero.beautifyFile',
    formatActiveDocument.bind(0, false),
  );
  const formattersConfigure = vscode.workspace.onDidChangeConfiguration(
    formatters.configure.bind(formatters),
  );
  const formattersOnFileOpen = vscode.workspace.onDidOpenTextDocument(
    formatters.onFileOpen.bind(formatters),
  );

  // ── Register Subscriptions ───────────────────────────────────────────────

  context.subscriptions.push(
    openInBrowser,
    closePort,
    compileFile,
    compileSelected,
    compileHeroOn,
    compileHeroOff,
    compileHeroStatus,
    compileHeroConfigure,
    beautify,
    beautifyFile,
    formattersConfigure,
    formattersOnFileOpen,
  );

  // ── Auto-compile on Save ─────────────────────────────────────────────────

  const onSaveDisposable = vscode.workspace.onDidSaveTextDocument((document) => {
    const config = vscode.workspace.getConfiguration('compile-hero');
    const isDisableOnDidSaveTextDocument = config.get<boolean>(
      'disable-compile-files-on-did-save-code',
    );
    if (isDisableOnDidSaveTextDocument) {
      return;
    }
    const { fileName } = document;
    readFileName({ fileName });
  });
  context.subscriptions.push(onSaveDisposable);

  // ── Initialize Status Bar ────────────────────────────────────────────────

  const initialDisableState =
    vscode.workspace
      .getConfiguration('compile-hero')
      .get<boolean>('disable-compile-files-on-did-save-code') ?? true;
  StatusBarUi.init(initialDisableState);
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
  StatusBarUi.dispose();
}
