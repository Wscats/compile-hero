/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

import * as vscode from "vscode";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import opn from './open';
import { browserConfig } from './browser';

const through = require("through2");
const minimatch = require('minimatch');

import { sassLoader } from './compile/sass';
import { javascriptLoader } from './compile/javascript';
import { lessLoader } from './compile/less';
import { typescriptLoader } from './compile/typescript';
import { typescriptxLoader } from './compile/typescriptx';
import { pugLoader } from './compile/pug';
import { stylusLoader } from './compile/stylus';

export const successMessage = "✔ Compilation Successed!";
export const errorMessage = "❌ Compilation Failed!";

export interface OutputDirectoryPath {
    ".js": string;
    ".scss": string;
    ".sass": string;
    ".less": string;
    ".jade": string;
    ".ts": string;
    ".tsx": string;
    ".pug": string;
    ".styl": string;
}

export interface CompileStatus {
    ".js": boolean | undefined;
    ".scss": boolean | undefined;
    ".sass": boolean | undefined;
    ".less": boolean | undefined;
    ".jade": boolean | undefined;
    ".ts": boolean | undefined;
    ".tsx": boolean | undefined;
    ".pug": boolean | undefined;
    ".styl": boolean | undefined;
}

export interface CompileOptions {
    generateMinifiedHtml: boolean | undefined;
    generateMinifiedCss: boolean | undefined;
    generateMinifiedJs: boolean | undefined;
}

export interface loaderOption {
    fileName: string
    outputPath: string;
    notificationStatus: boolean | undefined;
    compileOptions: CompileOptions;
    selectedText?: string;
}

let isDocker: boolean;
export const docker = () => {
    const hasDockerEnv = () => {
        try {
            fs.statSync('/.dockerenv');
            return true;
        } catch (_) {
            return false;
        }
    }
    const hasDockerCGroup = () => {
        try {
            return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
        } catch (_) {
            return false;
        }
    }
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
        if (docker()) {
            return false;
        }
        return true;
    }
    try {
        return fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft') ?
            !docker() : false;
    } catch (_) {
        return false;
    }
};

export const wsl = process.env.__IS_WSL_TEST__ ? wsll : wsll();

export const standardizedBrowserName = (name: string = ''): string => {
    let _name = name.toLowerCase();
    const browser = browserConfig.browsers.find(item => {
        return item.acceptName.indexOf(_name) !== -1;
    });
    return browser ? browser.standardName : '';
};

export const defaultBrowser = (): string => {
    const config = vscode.workspace.getConfiguration(browserConfig.app);
    return config ? config.default : '';
};

export const open = (path: string, browser: string | string[]) => {
    opn(path, { app: browser }).catch((err: any) => {
        vscode.window.showErrorMessage(`Open browser failed!! Please check if you have installed the browser ${browser} correctly!`);
    });
};

export const openBrowser = (path: any): void => {
    const browser = standardizedBrowserName(defaultBrowser());
    open(path, browser);
};


export type FileSuffix =
    | ".js"
    | ".scss"
    | ".sass"
    | ".less"
    | ".jade"
    | ".ts"
    | ".tsx"
    | ".pug"
    | ".styl";

export const readFileContext = (path: string): string => {
    return fs.readFileSync(path).toString();
};

export const fileType = (filename: string) => {
    const index1 = filename.lastIndexOf(".");
    const index2 = filename.length;
    const type = filename.substring(index1, index2);
    return type as FileSuffix;
};

export const command = (cmd: string) => {
    return new Promise<string>((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            resolve(stdout);
        });
    });
};

export const transformPort = (data: string): string => {
    let port: string = "";
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

export const empty = function (code: string) {
    let stream = through.obj((file: any, encoding: any, callback: Function) => {
        if (!file.isBuffer()) {
            return callback();
        }
        file.contents = Buffer.from(code || "");
        stream.push(file);
        callback();
    });
    return stream;
};

export const complieFile = (uri: string) => {
    readFileName({ fileName: uri });
};

export const complieDir = (uri: string) => {
    const files = fs.readdirSync(uri);
    files.forEach((filename) => {
        const fileUrl = path.join(uri, filename);
        const fileStats = fs.statSync(fileUrl);
        if (fileStats.isDirectory()) {
            complieDir(fileUrl);
        } else {
            complieFile(fileUrl);
        }
    });
};

// 获取当前选中的文本
export const getSelectedText = () => {
    const documentText = vscode.window.activeTextEditor?.document.getText();
    if (!documentText) {
        return "";
    }
    const activeSelection = vscode.window.activeTextEditor?.selection;
    if (activeSelection?.isEmpty) {
        return "";
    }
    const selectStartOffset = vscode.window.activeTextEditor?.document.offsetAt(
        activeSelection?.start as vscode.Position
    );
    const selectEndOffset = vscode.window.activeTextEditor?.document.offsetAt(
        activeSelection?.end as vscode.Position
    );

    let selectedText = documentText.slice(selectStartOffset, selectEndOffset).trim();
    selectedText = selectedText.replace(/\s\s+/g, " ");
    return selectedText;
}

// 获取工作区位置
export const getWorkspaceRoot = (doc: vscode.TextDocument) => {
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) return;
    if (!doc || doc.isUntitled) return vscode.workspace.workspaceFolders[0].uri.fsPath;

    const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
    if (!folder) return;
    return folder.uri.fsPath;
};

export const readFileName = async ({ fileName, selectedText }: { fileName: string; selectedText?: string }) => {
    let workspaceRootPath = vscode.workspace.rootPath;
    let fileSuffix: FileSuffix = fileType(fileName);
    let config = vscode.workspace.getConfiguration("compile-hero");
    let outputDirectoryPath: OutputDirectoryPath = {
        ".js": config.get<string>("javascript-output-directory") || "",
        ".scss": config.get<string>("scss-output-directory") || "",
        ".sass": config.get<string>("sass-output-directory") || "",
        ".less": config.get<string>("less-output-directory") || "",
        ".jade": config.get<string>("jade-output-directory") || "",
        ".ts": config.get<string>("typescript-output-directory") || "",
        ".tsx": config.get<string>("typescriptx-output-directory") || "",
        ".pug": config.get<string>("pug-output-directory") || "",
        ".styl": config.get<string>("stylus-output-directory") || "",
    };
    let compileStatus: CompileStatus = {
        ".js": config.get<boolean>("javascript-output-toggle"),
        ".scss": config.get<boolean>("scss-output-toggle"),
        ".sass": config.get<boolean>("sass-output-toggle"),
        ".less": config.get<boolean>("less-output-toggle"),
        ".jade": config.get<boolean>("jade-output-toggle"),
        ".ts": config.get<boolean>("typescript-output-toggle"),
        ".tsx": config.get<boolean>("typescriptx-output-toggle"),
        ".pug": config.get<boolean>("pug-output-toggle"),
        ".styl": config.get<boolean>("stylus-output-toggle"),
    };
    let ignore = config.get<string[] | string>("ignore") || [];

    if (workspaceRootPath && fileName.startsWith(workspaceRootPath)) {
        let relativePath = path.relative(workspaceRootPath, fileName);
        if (!Array.isArray(ignore)) { ignore = [ignore] };
        if (ignore.some(glob => minimatch(relativePath, glob))) return;
    };

    let notificationStatus: boolean | undefined = config.get<boolean>("notification-toggle");

    let compileOptions: CompileOptions = {
        generateMinifiedHtml: config.get<boolean>("generate-minified-html"),
        generateMinifiedCss: config.get<boolean>("generate-minified-css"),
        generateMinifiedJs: config.get<boolean>("generate-minified-javascript"),
    };

    if (!compileStatus[fileSuffix]) return;
    let outputPath = path.resolve(fileName, "../", outputDirectoryPath[fileSuffix]);
    let loaderOption: loaderOption = { fileName, outputPath, notificationStatus, compileOptions, selectedText };
    switch (fileSuffix) {
        case ".scss":
        case ".sass":
            sassLoader(loaderOption);
            break;
        case ".js":
            javascriptLoader(loaderOption);
            break;
        case ".less":
            lessLoader(loaderOption);
            break;
        case ".ts":
            typescriptLoader(loaderOption);
            break;
        case ".tsx":
            typescriptxLoader(loaderOption);
            break;
        case ".jade":
        case ".pug":
            pugLoader(loaderOption);
            break;
        case ".styl":
            stylusLoader(loaderOption);
            break;
    }
};