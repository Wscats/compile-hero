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
exports.readFileName = exports.getWorkspaceRoot = exports.getSelectedText = exports.complieDir = exports.complieFile = exports.empty = exports.transformPort = exports.command = exports.fileType = exports.readFileContext = exports.openBrowser = exports.open = exports.defaultBrowser = exports.standardizedBrowserName = exports.wsl = exports.docker = exports.errorMessage = exports.successMessage = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const open_1 = require("./open");
const browser_1 = require("./browser");
const through = require("through2");
const minimatch = require('minimatch');
const sass_1 = require("./compile/sass");
const javascript_1 = require("./compile/javascript");
const less_1 = require("./compile/less");
const typescript_1 = require("./compile/typescript");
const typescriptx_1 = require("./compile/typescriptx");
const pug_1 = require("./compile/pug");
const stylus_1 = require("./compile/stylus");
exports.successMessage = "✔ Compilation Successed!";
exports.errorMessage = "❌ Compilation Failed!";
let isDocker;
exports.docker = () => {
    const hasDockerEnv = () => {
        try {
            fs.statSync('/.dockerenv');
            return true;
        }
        catch (_) {
            return false;
        }
    };
    const hasDockerCGroup = () => {
        try {
            return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
        }
        catch (_) {
            return false;
        }
    };
    if (isDocker === undefined) {
        isDocker = hasDockerEnv() || hasDockerCGroup();
    }
    return isDocker;
};
const wsll = () => {
    if (process.platform !== 'linux') {
        return false;
    }
    if (os.release().toLowerCase().includes('microsoft')) {
        if (exports.docker()) {
            return false;
        }
        return true;
    }
    try {
        return fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft') ?
            !exports.docker() : false;
    }
    catch (_) {
        return false;
    }
};
exports.wsl = process.env.__IS_WSL_TEST__ ? wsll : wsll();
exports.standardizedBrowserName = (name = '') => {
    let _name = name.toLowerCase();
    const browser = browser_1.browserConfig.browsers.find(item => {
        return item.acceptName.indexOf(_name) !== -1;
    });
    return browser ? browser.standardName : '';
};
exports.defaultBrowser = () => {
    const config = vscode.workspace.getConfiguration(browser_1.browserConfig.app);
    return config ? config.default : '';
};
exports.open = (path, browser) => {
    open_1.default(path, { app: browser }).catch((err) => {
        vscode.window.showErrorMessage(`Open browser failed!! Please check if you have installed the browser ${browser} correctly!`);
    });
};
exports.openBrowser = (path) => {
    const browser = exports.standardizedBrowserName(exports.defaultBrowser());
    exports.open(path, browser);
};
exports.readFileContext = (path) => {
    return fs.readFileSync(path).toString();
};
exports.fileType = (filename) => {
    const index1 = filename.lastIndexOf(".");
    const index2 = filename.length;
    const type = filename.substring(index1, index2);
    return type;
};
exports.command = (cmd) => {
    return new Promise((resolve, reject) => {
        child_process_1.exec(cmd, (err, stdout, stderr) => {
            resolve(stdout);
        });
    });
};
exports.transformPort = (data) => {
    let port = "";
    data.split(/[\n|\r]/).forEach((item) => {
        if (item.indexOf("LISTEN") !== -1 && !port) {
            let reg = item.split(/\s+/);
            if (/\d+/.test(reg[1])) {
                port = reg[1];
            }
        }
    });
    return port;
};
exports.empty = function (code) {
    let stream = through.obj((file, encoding, callback) => {
        if (!file.isBuffer()) {
            return callback();
        }
        file.contents = Buffer.from(code || "");
        stream.push(file);
        callback();
    });
    return stream;
};
exports.complieFile = (uri) => {
    exports.readFileName({ fileName: uri });
};
exports.complieDir = (uri) => {
    const files = fs.readdirSync(uri);
    files.forEach((filename) => {
        const fileUrl = path.join(uri, filename);
        const fileStats = fs.statSync(fileUrl);
        if (fileStats.isDirectory()) {
            exports.complieDir(fileUrl);
        }
        else {
            exports.complieFile(fileUrl);
        }
    });
};
// 获取当前选中的文本
exports.getSelectedText = () => {
    var _a, _b, _c, _d;
    const documentText = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.getText();
    if (!documentText) {
        return "";
    }
    const activeSelection = (_b = vscode.window.activeTextEditor) === null || _b === void 0 ? void 0 : _b.selection;
    if (activeSelection === null || activeSelection === void 0 ? void 0 : activeSelection.isEmpty) {
        return "";
    }
    const selectStartOffset = (_c = vscode.window.activeTextEditor) === null || _c === void 0 ? void 0 : _c.document.offsetAt(activeSelection === null || activeSelection === void 0 ? void 0 : activeSelection.start);
    const selectEndOffset = (_d = vscode.window.activeTextEditor) === null || _d === void 0 ? void 0 : _d.document.offsetAt(activeSelection === null || activeSelection === void 0 ? void 0 : activeSelection.end);
    let selectedText = documentText.slice(selectStartOffset, selectEndOffset).trim();
    selectedText = selectedText.replace(/\s\s+/g, " ");
    return selectedText;
};
// 获取工作区位置
exports.getWorkspaceRoot = (doc) => {
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0)
        return;
    if (!doc || doc.isUntitled)
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
    if (!folder)
        return;
    return folder.uri.fsPath;
};
exports.readFileName = ({ fileName, selectedText }) => __awaiter(void 0, void 0, void 0, function* () {
    let workspaceRootPath = vscode.workspace.rootPath;
    let fileSuffix = exports.fileType(fileName);
    let config = vscode.workspace.getConfiguration("compile-hero");
    let outputDirectoryPath = {
        ".js": config.get("javascript-output-directory") || "",
        ".scss": config.get("scss-output-directory") || "",
        ".sass": config.get("sass-output-directory") || "",
        ".less": config.get("less-output-directory") || "",
        ".jade": config.get("jade-output-directory") || "",
        ".ts": config.get("typescript-output-directory") || "",
        ".tsx": config.get("typescriptx-output-directory") || "",
        ".pug": config.get("pug-output-directory") || "",
        ".styl": config.get("stylus-output-directory") || "",
    };
    let compileStatus = {
        ".js": config.get("javascript-output-toggle"),
        ".scss": config.get("scss-output-toggle"),
        ".sass": config.get("sass-output-toggle"),
        ".less": config.get("less-output-toggle"),
        ".jade": config.get("jade-output-toggle"),
        ".ts": config.get("typescript-output-toggle"),
        ".tsx": config.get("typescriptx-output-toggle"),
        ".pug": config.get("pug-output-toggle"),
        ".styl": config.get("stylus-output-toggle"),
    };
    let ignore = config.get("ignore") || [];
    if (workspaceRootPath && fileName.startsWith(workspaceRootPath)) {
        let relativePath = path.relative(workspaceRootPath, fileName);
        if (!Array.isArray(ignore)) {
            ignore = [ignore];
        }
        ;
        if (ignore.some(glob => minimatch(relativePath, glob)))
            return;
    }
    ;
    let notificationStatus = config.get("notification-toggle");
    let compileOptions = {
        generateMinifiedHtml: config.get("generate-minified-html"),
        generateMinifiedCss: config.get("generate-minified-css"),
        generateMinifiedJs: config.get("generate-minified-javascript"),
    };
    if (!compileStatus[fileSuffix])
        return;
    let outputPath = path.resolve(fileName, "../", outputDirectoryPath[fileSuffix]);
    let loaderOption = { fileName, outputPath, notificationStatus, compileOptions, selectedText };
    switch (fileSuffix) {
        case ".scss":
        case ".sass":
            sass_1.sassLoader(loaderOption);
            break;
        case ".js":
            javascript_1.javascriptLoader(loaderOption);
            break;
        case ".less":
            less_1.lessLoader(loaderOption);
            break;
        case ".ts":
            typescript_1.typescriptLoader(loaderOption);
            break;
        case ".tsx":
            typescriptx_1.typescriptxLoader(loaderOption);
            break;
        case ".jade":
        case ".pug":
            pug_1.pugLoader(loaderOption);
            break;
        case ".styl":
            stylus_1.stylusLoader(loaderOption);
            break;
    }
});
//# sourceMappingURL=util.js.map