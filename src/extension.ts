/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */


import * as vscode from "vscode";
import * as fs from "fs";

import { StatusBarUi } from './status';
import { command, transformPort, complieDir, complieFile, readFileName, getSelectedText, openBrowser, fileType, suffixs } from './util';
const { formatters, formatActiveDocument } = require("./beautify");

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, compile hero is now active!');
  let openInBrowser = vscode.commands.registerCommand(
    "compile-hero.openInBrowser",
    (path) => {
      let uri = path.fsPath;
      openBrowser(uri);
    }
  );
  let closePort = vscode.commands.registerCommand(
    "compile-hero.closePort",
    async () => {
      let inputPort = await vscode.window.showInputBox({
        placeHolder: "Enter the port you need to close?",
      });
      let info = await command(`lsof -i :${inputPort}`);
      let port = transformPort(info);
      if (port) {
        await command(`kill -9 ${port}`);
        vscode.window.setStatusBarMessage("Port closed successfully!");
      }
    }
  );

  let compileFile = vscode.commands.registerCommand(
    "compile-hero.compileFile",
    (path) => {
      const uri = path.fsPath;
      try {
        if (fs.readdirSync(uri).length > 0) {
          complieDir(uri);
        } else {
          complieFile(uri);
        }
      } catch (error) {
        complieFile(uri);
      }
    }
  );

  let compileSelected = vscode.commands.registerCommand(
    "compile-hero.compileSelected",
    (path) => {
      const uri = path ? path.fsPath : vscode.window.activeTextEditor?.document.uri.fsPath;
      const selectedText = getSelectedText();
      readFileName({ fileName: uri, selectedText });
    }
  );

  let compileHeroOn = vscode.commands.registerCommand(
    "compile-hero.compileHeroOn",
    () => {
      let config = vscode.workspace.getConfiguration("compile-hero");
      config.update("disable-compile-files-on-did-save-code", true);
      StatusBarUi.notWatching();
    }
  );

  let compileHeroOff = vscode.commands.registerCommand(
    "compile-hero.compileHeroOff",
    () => {
      let config = vscode.workspace.getConfiguration("compile-hero");
      config.update("disable-compile-files-on-did-save-code", false);
      StatusBarUi.watching();
    }
  );

  let compileHeroStatus = vscode.window.onDidChangeActiveTextEditor((document) => {
    if (!document?.document.fileName) {
      StatusBarUi.hide();
      return;
    }
    // 编辑器是否命中正确的编译文件，如果编译文件后缀正确才显示右下角状态栏
    if (suffixs.includes(fileType(document?.document.fileName))) {
      StatusBarUi.show();
    } else {
      StatusBarUi.hide();
    }
  })

  let compileHeroConfigure = vscode.workspace.onDidChangeConfiguration(() => {
    // 修改配置，更新右下角底部状态栏
    let config = vscode.workspace.getConfiguration("compile-hero");
    let isDisable = config.get("disable-compile-files-on-did-save-code");
    if (isDisable) {
      StatusBarUi.notWatching();
    } else {
      StatusBarUi.watching();
    }
  })

  formatters.configure();
  let beautify = vscode.commands.registerCommand('compile-hero.beautify', formatActiveDocument.bind(0, true));
  let beautifyFile = vscode.commands.registerCommand('compile-hero.beautifyFile', formatActiveDocument.bind(0, false));
  let formattersConfigure = vscode.workspace.onDidChangeConfiguration(formatters.configure.bind(formatters));
  let formattersOnFileOpen = vscode.workspace.onDidOpenTextDocument(formatters.onFileOpen.bind(formatters));

  context.subscriptions.push(openInBrowser);
  context.subscriptions.push(closePort);
  context.subscriptions.push(compileFile);
  context.subscriptions.push(compileSelected);
  context.subscriptions.push(compileHeroOn);
  context.subscriptions.push(compileHeroOff);
  context.subscriptions.push(compileHeroStatus);
  context.subscriptions.push(compileHeroConfigure);
  context.subscriptions.push(beautify);
  context.subscriptions.push(beautifyFile);
  context.subscriptions.push(formattersConfigure);
  context.subscriptions.push(formattersOnFileOpen);

  vscode.workspace.onDidSaveTextDocument((document) => {
    let config = vscode.workspace.getConfiguration("compile-hero");
    let isDisableOnDidSaveTextDocument =
      config.get<string>("disable-compile-files-on-did-save-code") || "";
    if (isDisableOnDidSaveTextDocument) return;
    const { fileName } = document;
    readFileName({ fileName });
  });

  StatusBarUi.init(vscode.workspace.getConfiguration("compile-hero").get<string>("disable-compile-files-on-did-save-code") || "");
}
export function deactivate() {
  StatusBarUi.dispose();
}
