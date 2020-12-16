"use strict";
/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const status_1 = require("./status");
const util_1 = require("./util");
const { formatters, formatActiveDocument } = require("./beautify");
function activate(context) {
    console.log('Congratulations, compile hero is now active!');
    let openInBrowser = vscode.commands.registerCommand("compile-hero.openInBrowser", (path) => {
        let uri = path.fsPath;
        util_1.openBrowser(uri);
    });
    let closePort = vscode.commands.registerCommand("compile-hero.closePort", () => __awaiter(this, void 0, void 0, function* () {
        let inputPort = yield vscode.window.showInputBox({
            placeHolder: "Enter the port you need to close?",
        });
        let info = yield util_1.command(`lsof -i :${inputPort}`);
        let port = util_1.transformPort(info);
        if (port) {
            yield util_1.command(`kill -9 ${port}`);
            vscode.window.setStatusBarMessage("Port closed successfully!");
        }
    }));
    let compileFile = vscode.commands.registerCommand("compile-hero.compileFile", (path) => {
        const uri = path.fsPath;
        try {
            if (fs.readdirSync(uri).length > 0) {
                util_1.complieDir(uri);
            }
            else {
                util_1.complieFile(uri);
            }
        }
        catch (error) {
            util_1.complieFile(uri);
        }
    });
    let compileSelected = vscode.commands.registerCommand("compile-hero.compileSelected", (path) => {
        var _a;
        const uri = path ? path.fsPath : (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
        const selectedText = util_1.getSelectedText();
        util_1.readFileName({ fileName: uri, selectedText });
    });
    let compileHeroOn = vscode.commands.registerCommand("compile-hero.compileHeroOn", () => {
        let config = vscode.workspace.getConfiguration("compile-hero");
        config.update("disable-compile-files-on-did-save-code", true);
        status_1.StatusBarUi.notWatching();
    });
    let compileHeroOff = vscode.commands.registerCommand("compile-hero.compileHeroOff", () => {
        let config = vscode.workspace.getConfiguration("compile-hero");
        config.update("disable-compile-files-on-did-save-code", false);
        status_1.StatusBarUi.watching();
    });
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
    context.subscriptions.push(beautify);
    context.subscriptions.push(beautifyFile);
    context.subscriptions.push(formattersConfigure);
    context.subscriptions.push(formattersOnFileOpen);
    vscode.workspace.onDidSaveTextDocument((document) => {
        let config = vscode.workspace.getConfiguration("compile-hero");
        let isDisableOnDidSaveTextDocument = config.get("disable-compile-files-on-did-save-code") || "";
        if (isDisableOnDidSaveTextDocument)
            return;
        const { fileName } = document;
        util_1.readFileName({ fileName });
    });
    status_1.StatusBarUi.init(vscode.workspace.getConfiguration("compile-hero").get("disable-compile-files-on-did-save-code") || "");
}
exports.activate = activate;
function deactivate() {
    status_1.StatusBarUi.dispose();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map