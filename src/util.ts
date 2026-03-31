/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - Core utilities module.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import opn from './open';
import { browserConfig } from './browser';

const through = require('through2');
const minimatch = require('minimatch');

import { sassLoader } from './compile/sass';
import { javascriptLoader } from './compile/javascript';
import { lessLoader } from './compile/less';
import { typescriptLoader } from './compile/typescript';
import { typescriptxLoader } from './compile/typescriptx';
import { pugLoader } from './compile/pug';
import { stylusLoader } from './compile/stylus';

// ── Constants ────────────────────────────────────────────────────────────────

export const successMessage = '✔ Compilation Successed!';
export const errorMessage = '❌ Compilation Failed!';

// ── Language Suffix Enum ─────────────────────────────────────────────────────

export enum LANGUAGE_SUFFIX {
  JAVASCRIPT = '.js',
  SCSS = '.scss',
  SASS = '.sass',
  LESS = '.less',
  JADE = '.jade',
  TYPESCRIPT = '.ts',
  TYPESCRIPTX = '.tsx',
  PUG = '.pug',
  STYLUS = '.styl',
}

export const suffixs: readonly LANGUAGE_SUFFIX[] = [
  LANGUAGE_SUFFIX.JAVASCRIPT,
  LANGUAGE_SUFFIX.SCSS,
  LANGUAGE_SUFFIX.SASS,
  LANGUAGE_SUFFIX.LESS,
  LANGUAGE_SUFFIX.JADE,
  LANGUAGE_SUFFIX.TYPESCRIPT,
  LANGUAGE_SUFFIX.TYPESCRIPTX,
  LANGUAGE_SUFFIX.PUG,
  LANGUAGE_SUFFIX.STYLUS,
] as const;

// ── Interfaces ───────────────────────────────────────────────────────────────

export type FileSuffix = LANGUAGE_SUFFIX;

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
  generateMinifiedHtml: boolean | undefined;
  generateMinifiedHtmlOnly: boolean | undefined;
  generateMinifiedCss: boolean | undefined;
  generateMinifiedCssOnly: boolean | undefined;
  generateMinifiedJs: boolean | undefined;
  generateMinifiedJsOnly: boolean | undefined;
}

export interface LoaderOption {
  fileName: string;
  outputPath: string;
  notificationStatus: boolean | undefined;
  compileOptions: CompileOptions;
  selectedText?: string;
}

/** @deprecated Use `LoaderOption` instead. */
export type loaderOption = LoaderOption;

// ── Docker / WSL Detection ───────────────────────────────────────────────────

let isDockerCached: boolean | undefined;

/**
 * Detect whether the current environment is running inside a Docker container.
 */
export const docker = (): boolean => {
  if (isDockerCached !== undefined) {
    return isDockerCached;
  }

  const hasDockerEnv = (): boolean => {
    try {
      fs.statSync('/.dockerenv');
      return true;
    } catch {
      return false;
    }
  };

  const hasDockerCGroup = (): boolean => {
    try {
      return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
    } catch {
      return false;
    }
  };

  isDockerCached = hasDockerEnv() || hasDockerCGroup();
  return isDockerCached;
};

/**
 * Detect whether the current environment is WSL (Windows Subsystem for Linux).
 */
const detectWsl = (): boolean => {
  if (process.platform !== 'linux') {
    return false;
  }

  if (os.release().toLowerCase().includes('microsoft')) {
    return !docker();
  }

  try {
    return fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft')
      ? !docker()
      : false;
  } catch {
    return false;
  }
};

export const wsl: boolean | (() => boolean) = process.env.__IS_WSL_TEST__
  ? detectWsl
  : detectWsl();

// ── Browser Utilities ────────────────────────────────────────────────────────

/**
 * Standardize a browser name to its platform-specific executable name.
 */
export const standardizedBrowserName = (name = ''): string => {
  const normalizedName = name.toLowerCase();
  const browser = browserConfig.browsers.find(
    item => item.acceptName.indexOf(normalizedName) !== -1,
  );
  return browser ? browser.standardName : '';
};

/**
 * Get the default browser from VS Code configuration.
 */
export const defaultBrowser = (): string => {
  const config = vscode.workspace.getConfiguration(browserConfig.app);
  return config ? config.default : '';
};

/**
 * Open a path in the specified browser.
 */
export const open = (targetPath: string, browser: string | string[]): void => {
  opn(targetPath, { app: browser }).catch((_err: unknown) => {
    vscode.window.showErrorMessage(
      `Open browser failed!! Please check if you have installed the browser ${String(browser)} correctly!`,
    );
  });
};

/**
 * Open a path in the user's default browser.
 */
export const openBrowser = (targetPath: string): void => {
  const browser = standardizedBrowserName(defaultBrowser());
  open(targetPath, browser);
};

// ── File Utilities ───────────────────────────────────────────────────────────

/**
 * Read a file and return its contents as a string.
 */
export const readFileContext = (filePath: string): string => {
  return fs.readFileSync(filePath).toString();
};

/**
 * Extract the file extension (including the dot) from a filename.
 */
export const fileType = (filename: string): FileSuffix => {
  const dotIndex = filename.lastIndexOf('.');
  const ext = filename.substring(dotIndex);
  return ext as FileSuffix;
};

// ── Shell Utilities ──────────────────────────────────────────────────────────

/**
 * Execute a shell command and return its stdout.
 *
 * @param cmd - The command to execute.
 * @returns A promise that resolves with the command's stdout.
 */
export const command = (cmd: string): Promise<string> => {
  return new Promise<string>((resolve, _reject) => {
    exec(cmd, (_err, stdout, _stderr) => {
      resolve(stdout);
    });
  });
};

/**
 * Extract the PID of a process listening on a port from `lsof` output.
 */
export const transformPort = (data: string): string => {
  let port = '';
  const lines = data.split(/[\n|\r]/);
  for (const item of lines) {
    if (item.indexOf('LISTEN') !== -1 && !port) {
      const parts = item.split(/\s+/);
      if (parts[1] && /\d+/.test(parts[1])) {
        port = parts[1];
        break;
      }
    }
  }
  return port;
};

// ── Gulp Stream Utilities ────────────────────────────────────────────────────

interface GulpFile {
  isBuffer(): boolean;
  contents: Buffer;
}

/**
 * Create a through2 stream that replaces file contents with the given code.
 */
export const empty = (code: string) => {
  const stream = through.obj((file: GulpFile, _encoding: string, callback: Function) => {
    if (!file.isBuffer()) {
      return callback();
    }
    file.contents = Buffer.from(code || '');
    stream.push(file);
    callback();
  });
  return stream;
};

// ── Compile Utilities ────────────────────────────────────────────────────────

/**
 * Compile a single file based on its extension.
 */
export const complieFile = (uri: string): void => {
  readFileName({ fileName: uri });
};

/**
 * Recursively compile all files in a directory.
 */
export const complieDir = (uri: string): void => {
  const files = fs.readdirSync(uri);
  for (const filename of files) {
    const fileUrl = path.join(uri, filename);
    const fileStats = fs.statSync(fileUrl);
    if (fileStats.isDirectory()) {
      complieDir(fileUrl);
    } else {
      complieFile(fileUrl);
    }
  }
};

// ── Editor Utilities ─────────────────────────────────────────────────────────

/**
 * Get the currently selected text in the active editor.
 */
export const getSelectedText = (): string => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return '';
  }

  const documentText = editor.document.getText();
  const activeSelection = editor.selection;

  if (activeSelection.isEmpty) {
    return '';
  }

  const selectStartOffset = editor.document.offsetAt(activeSelection.start);
  const selectEndOffset = editor.document.offsetAt(activeSelection.end);

  let selectedText = documentText.slice(selectStartOffset, selectEndOffset).trim();
  selectedText = selectedText.replace(/\s\s+/g, ' ');
  return selectedText;
};

/**
 * Get the workspace root path for a given document.
 */
export const getWorkspaceRoot = (doc: vscode.TextDocument): string | undefined => {
  if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
    return undefined;
  }
  if (!doc || doc.isUntitled) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
  if (!folder) {
    return undefined;
  }
  return folder.uri.fsPath;
};

// ── Core: Read File Name & Dispatch Compilation ──────────────────────────────

/**
 * Extract an error message from an unknown error value.
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

/**
 * Read a file name, determine its type, and dispatch to the appropriate compiler.
 */
export const readFileName = async ({
  fileName,
  selectedText,
}: {
  fileName: string;
  selectedText?: string;
}): Promise<void> => {
  const workspaceRootPath = vscode.workspace.rootPath;
  const fileSuffix: FileSuffix = fileType(fileName);
  const config = vscode.workspace.getConfiguration('compile-hero');

  const outputDirectoryPath: OutputDirectoryPath = {
    [LANGUAGE_SUFFIX.JAVASCRIPT]: config.get<string>('javascript-output-directory') || '',
    [LANGUAGE_SUFFIX.SCSS]: config.get<string>('scss-output-directory') || '',
    [LANGUAGE_SUFFIX.SASS]: config.get<string>('sass-output-directory') || '',
    [LANGUAGE_SUFFIX.LESS]: config.get<string>('less-output-directory') || '',
    [LANGUAGE_SUFFIX.JADE]: config.get<string>('jade-output-directory') || '',
    [LANGUAGE_SUFFIX.TYPESCRIPT]: config.get<string>('typescript-output-directory') || '',
    [LANGUAGE_SUFFIX.TYPESCRIPTX]: config.get<string>('typescriptx-output-directory') || '',
    [LANGUAGE_SUFFIX.PUG]: config.get<string>('pug-output-directory') || '',
    [LANGUAGE_SUFFIX.STYLUS]: config.get<string>('stylus-output-directory') || '',
  };

  const compileStatus: CompileStatus = {
    [LANGUAGE_SUFFIX.JAVASCRIPT]: config.get<boolean>('javascript-output-toggle'),
    [LANGUAGE_SUFFIX.SCSS]: config.get<boolean>('scss-output-toggle'),
    [LANGUAGE_SUFFIX.SASS]: config.get<boolean>('sass-output-toggle'),
    [LANGUAGE_SUFFIX.LESS]: config.get<boolean>('less-output-toggle'),
    [LANGUAGE_SUFFIX.JADE]: config.get<boolean>('jade-output-toggle'),
    [LANGUAGE_SUFFIX.TYPESCRIPT]: config.get<boolean>('typescript-output-toggle'),
    [LANGUAGE_SUFFIX.TYPESCRIPTX]: config.get<boolean>('typescriptx-output-toggle'),
    [LANGUAGE_SUFFIX.PUG]: config.get<boolean>('pug-output-toggle'),
    [LANGUAGE_SUFFIX.STYLUS]: config.get<boolean>('stylus-output-toggle'),
  };

  let ignore = config.get<string[] | string>('ignore') || [];
  let watch = config.get<string[] | string>('watch') || [];

  // Check ignore/watch glob patterns
  if (workspaceRootPath && fileName.startsWith(workspaceRootPath)) {
    const relativePath = path.relative(workspaceRootPath, fileName);

    if (!Array.isArray(ignore)) {
      ignore = [ignore];
    }
    if (ignore.some(glob => minimatch(relativePath, glob))) {
      return;
    }

    // If watch patterns are set, only compile matching files
    if (!Array.isArray(watch)) {
      watch = [watch];
    }
    if (watch.length > 0 && !watch.some(glob => minimatch(relativePath, glob))) {
      return;
    }
  }

  const notificationStatus = config.get<boolean>('notification-toggle');

  const compileOptions: CompileOptions = {
    generateMinifiedHtml: config.get<boolean>('generate-minified-html'),
    generateMinifiedHtmlOnly: config.get<boolean>('generate-minified-html-only'),
    generateMinifiedCss: config.get<boolean>('generate-minified-css'),
    generateMinifiedCssOnly: config.get<boolean>('generate-minified-css-only'),
    generateMinifiedJs: config.get<boolean>('generate-minified-javascript'),
    generateMinifiedJsOnly: config.get<boolean>('generate-minified-javascript-only'),
  };

  if (!compileStatus[fileSuffix]) {
    return;
  }

  const outputPath = path.resolve(fileName, '../', outputDirectoryPath[fileSuffix]);
  const loaderOpt: LoaderOption = {
    fileName,
    outputPath,
    notificationStatus,
    compileOptions,
    selectedText,
  };

  // Dispatch to the appropriate compiler based on file suffix
  const loaderMap: Partial<Record<LANGUAGE_SUFFIX, (opt: LoaderOption) => void>> = {
    [LANGUAGE_SUFFIX.SCSS]: sassLoader,
    [LANGUAGE_SUFFIX.SASS]: sassLoader,
    [LANGUAGE_SUFFIX.JAVASCRIPT]: javascriptLoader,
    [LANGUAGE_SUFFIX.LESS]: lessLoader,
    [LANGUAGE_SUFFIX.TYPESCRIPT]: typescriptLoader,
    [LANGUAGE_SUFFIX.TYPESCRIPTX]: typescriptxLoader,
    [LANGUAGE_SUFFIX.JADE]: pugLoader,
    [LANGUAGE_SUFFIX.PUG]: pugLoader,
    [LANGUAGE_SUFFIX.STYLUS]: stylusLoader,
  };

  const loader = loaderMap[fileSuffix];
  if (loader) {
    loader(loaderOpt);
  }
};

// ── Variable Check ───────────────────────────────────────────────────────────

/**
 * Validate output directory path variables (e.g., `${workspaceFolder}`).
 *
 * @returns The resolved URI string, or `false` if validation fails.
 */
export function veriableCheck(
  uri: string,
  fileSuffix: string,
  workspaceRootPath: string,
): string | false {
  if (
    uri.indexOf('}/') < 0 &&
    uri.length - uri.indexOf('}') > 1 &&
    uri.indexOf('$') >= 0
  ) {
    const veriableError =
      fileSuffix +
      "; '/' must be used at the end of the variable or '}' must be the last character.";
    vscode.window.showErrorMessage(veriableError);
    return false;
  }

  if (uri.indexOf('${workspaceFolder}') >= 0) {
    return uri.replace('${workspaceFolder}', String(workspaceRootPath));
  }

  if (uri.indexOf('${folderPath}') >= 0) {
    return uri.replace('${folderPath}', String(workspaceRootPath));
  }

  if (uri.indexOf('$') >= 0) {
    const findStartNumber = uri.indexOf('$');
    let findEndNumber: number;
    if (uri.indexOf('}') < 0) {
      findEndNumber = uri.indexOf('/') < 0 ? uri.length : uri.indexOf('/');
    } else {
      findEndNumber = uri.indexOf('}');
    }
    findEndNumber++;
    const veriableError =
      fileSuffix +
      '; Output directory unsupported variable: ' +
      uri.slice(findStartNumber, findEndNumber);
    vscode.window.showErrorMessage(veriableError);
    return false;
  }

  return uri;
}