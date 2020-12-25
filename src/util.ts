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

export enum LANGUAGE_SUFFIX {
    JAVASCRIPT = ".js",
    SCSS = ".scss",
    SASS = ".sass",
    LESS = ".less",
    JADE = ".jade",
    TYPESCRIPT = ".ts",
    TYPESCRIPTX = ".tsx",
    PUG = ".pug",
    STYLUS = ".styl"
}

export const suffixs = [
    LANGUAGE_SUFFIX.JAVASCRIPT,
    LANGUAGE_SUFFIX.SCSS,
    LANGUAGE_SUFFIX.SASS,
    LANGUAGE_SUFFIX.LESS,
    LANGUAGE_SUFFIX.JADE,
    LANGUAGE_SUFFIX.TYPESCRIPT,
    LANGUAGE_SUFFIX.TYPESCRIPTX,
    LANGUAGE_SUFFIX.PUG,
    LANGUAGE_SUFFIX.STYLUS
];

export interface OutputDirectoryPath {
    [LANGUAGE_SUFFIX.JAVASCRIPT]: string;
    [LANGUAGE_SUFFIX.SCSS]: string;
    [LANGUAGE_SUFFIX.SASS]: string;
    [LANGUAGE_SUFFIX.LESS]: string;
    [LANGUAGE_SUFFIX.JADE]: string;
    [LANGUAGE_SUFFIX.TYPESCRIPT]: string;
    [LANGUAGE_SUFFIX.TYPESCRIPTX]: string;
    [LANGUAGE_SUFFIX.PUG]: string;
    [LANGUAGE_SUFFIX.STYLUS]: string;
}

export interface CompileStatus {
    [LANGUAGE_SUFFIX.JAVASCRIPT]: boolean | undefined;
    [LANGUAGE_SUFFIX.SCSS]: boolean | undefined;
    [LANGUAGE_SUFFIX.SASS]: boolean | undefined;
    [LANGUAGE_SUFFIX.LESS]: boolean | undefined;
    [LANGUAGE_SUFFIX.JADE]: boolean | undefined;
    [LANGUAGE_SUFFIX.TYPESCRIPT]: boolean | undefined;
    [LANGUAGE_SUFFIX.TYPESCRIPTX]: boolean | undefined;
    [LANGUAGE_SUFFIX.PUG]: boolean | undefined;
    [LANGUAGE_SUFFIX.STYLUS]: boolean | undefined;
}

export interface CompileOptions {
    generateMinifiedHtml: boolean | undefined,
    generateMinifiedHtmlOnly: boolean | undefined,
    generateMinifiedCss: boolean | undefined,
    generateMinifiedCssOnly: boolean | undefined,
    generateMinifiedJs: boolean | undefined,
    generateMinifiedJsOnly: boolean | undefined,
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
    | LANGUAGE_SUFFIX.JAVASCRIPT
    | LANGUAGE_SUFFIX.SCSS
    | LANGUAGE_SUFFIX.SASS
    | LANGUAGE_SUFFIX.LESS
    | LANGUAGE_SUFFIX.JADE
    | LANGUAGE_SUFFIX.TYPESCRIPT
    | LANGUAGE_SUFFIX.TYPESCRIPTX
    | LANGUAGE_SUFFIX.PUG
    | LANGUAGE_SUFFIX.STYLUS;

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
        [LANGUAGE_SUFFIX.JAVASCRIPT]: config.get<string>("javascript-output-directory") || "",
        [LANGUAGE_SUFFIX.SCSS]: config.get<string>("scss-output-directory") || "",
        [LANGUAGE_SUFFIX.SASS]: config.get<string>("sass-output-directory") || "",
        [LANGUAGE_SUFFIX.LESS]: config.get<string>("less-output-directory") || "",
        [LANGUAGE_SUFFIX.JADE]: config.get<string>("jade-output-directory") || "",
        [LANGUAGE_SUFFIX.TYPESCRIPT]: config.get<string>("typescript-output-directory") || "",
        [LANGUAGE_SUFFIX.TYPESCRIPTX]: config.get<string>("typescriptx-output-directory") || "",
        [LANGUAGE_SUFFIX.PUG]: config.get<string>("pug-output-directory") || "",
        [LANGUAGE_SUFFIX.STYLUS]: config.get<string>("stylus-output-directory") || "",
    };
    let compileStatus: CompileStatus = {
        [LANGUAGE_SUFFIX.JAVASCRIPT]: config.get<boolean>("javascript-output-toggle"),
        [LANGUAGE_SUFFIX.SCSS]: config.get<boolean>("scss-output-toggle"),
        [LANGUAGE_SUFFIX.SASS]: config.get<boolean>("sass-output-toggle"),
        [LANGUAGE_SUFFIX.LESS]: config.get<boolean>("less-output-toggle"),
        [LANGUAGE_SUFFIX.JADE]: config.get<boolean>("jade-output-toggle"),
        [LANGUAGE_SUFFIX.TYPESCRIPT]: config.get<boolean>("typescript-output-toggle"),
        [LANGUAGE_SUFFIX.TYPESCRIPTX]: config.get<boolean>("typescriptx-output-toggle"),
        [LANGUAGE_SUFFIX.PUG]: config.get<boolean>("pug-output-toggle"),
        [LANGUAGE_SUFFIX.STYLUS]: config.get<boolean>("stylus-output-toggle"),
    };
    let ignore = config.get<string[] | string>("ignore") || [];
    let watch = config.get<string[] | string>("watch") || [];

    if (workspaceRootPath && fileName.startsWith(workspaceRootPath)) {
        let relativePath = path.relative(workspaceRootPath, fileName);
        if (!Array.isArray(ignore)) { ignore = [ignore] };
        if (ignore.some(glob => minimatch(relativePath, glob))) return;

        // 如果设置了 watch，则监听保存的文件路径是否符合，如果不设置，则所有文件都会被监听
        if (!Array.isArray(watch)) { watch = [watch] };
        if (watch.length > 0 && !watch.some(glob => minimatch(relativePath, glob))) return;
    };

    let notificationStatus: boolean | undefined = config.get<boolean>("notification-toggle");

    let compileOptions: CompileOptions = {
        generateMinifiedHtml: config.get<boolean>("generate-minified-html"),
        generateMinifiedHtmlOnly: config.get<boolean>("generate-minified-html-only"),
        generateMinifiedCss: config.get<boolean>("generate-minified-css"),
        generateMinifiedCssOnly: config.get<boolean>("generate-minified-css-only"),
        generateMinifiedJs: config.get<boolean>("generate-minified-javascript"),
        generateMinifiedJsOnly: config.get<boolean>("generate-minified-javascript-only"),
    };

    if (!compileStatus[fileSuffix]) return;
    let outputPath = path.resolve(fileName, "../", outputDirectoryPath[fileSuffix]);
    let loaderOption: loaderOption = { fileName, outputPath, notificationStatus, compileOptions, selectedText };
    switch (fileSuffix) {
        case LANGUAGE_SUFFIX.SCSS:
        case LANGUAGE_SUFFIX.SASS:
            sassLoader(loaderOption);
            break;
        case LANGUAGE_SUFFIX.JAVASCRIPT:
            javascriptLoader(loaderOption);
            break;
        case LANGUAGE_SUFFIX.LESS:
            lessLoader(loaderOption);
            break;
        case LANGUAGE_SUFFIX.TYPESCRIPT:
            typescriptLoader(loaderOption);
            break;
        case LANGUAGE_SUFFIX.TYPESCRIPTX:
            typescriptxLoader(loaderOption);
            break;
        case LANGUAGE_SUFFIX.JADE:
        case LANGUAGE_SUFFIX.PUG:
            pugLoader(loaderOption);
            break;
        case LANGUAGE_SUFFIX.STYLUS:
            stylusLoader(loaderOption);
            break;
    }
};

export function veriableCheck(uri: string, fileSuffix: string, workspaceRootPath: string) {
    let veriableError: string;

    if ((uri.indexOf("}/") < 0) &&
        ((uri.length - uri.indexOf("}")) > 1) &&
        (uri.indexOf("$") >= 0)) {
        veriableError = fileSuffix +
            "; '/' must be used at the end of the variable or '}' must be the last character.";
        vscode.window.showErrorMessage(veriableError);
        return false;
    } else if (uri.indexOf("${workspaceFolder}") >= 0) {
        uri = uri.replace("${workspaceFolder}", String(workspaceRootPath));
    } else if (uri.indexOf("${folderPath}") >= 0) {
        uri = uri.replace("${folderPath}", String(workspaceRootPath));
    } else if (uri.indexOf("$") >= 0) {
        let findStartNumber: number = uri.indexOf("$");
        let findEndNumber: number;
        if (uri.indexOf("}") < 0) {
            if (uri.indexOf("/") < 0) {
                findEndNumber = uri.length;
            } else {
                findEndNumber = uri.indexOf("/");
            }
        } else {
            findEndNumber = uri.indexOf("}");
        }
        findEndNumber++;
        veriableError = fileSuffix + "; Output directory unsupported variable: " +
            uri.slice(findStartNumber, findEndNumber);
        vscode.window.showErrorMessage(veriableError);
        return false;
    }
    return uri;
};