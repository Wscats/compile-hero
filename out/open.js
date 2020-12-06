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
const util_1 = require("util");
const path = require("path");
const fs = require("fs");
const childProcess = require("child_process");
const util_2 = require("./util");
const pAccess = util_1.promisify(fs.access);
const pExecFile = util_1.promisify(childProcess.execFile);
const localXdgOpenPath = path.join(__dirname, 'xdg-open');
const wslToWindowsPath = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield pExecFile('wslpath', ['-w', path]);
    return stdout.trim();
});
const windowsToWslPath = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield pExecFile('wslpath', [path]);
    return stdout.trim();
});
const wslGetWindowsEnvVar = (envVar) => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield pExecFile('wslvar', [envVar]);
    return stdout.trim();
});
exports.default = (target, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof target !== 'string') {
        throw new TypeError('Expected a `target`');
    }
    options = Object.assign({ wait: false, background: false, allowNonzeroExitCode: false }, options);
    let command;
    let { app } = options;
    let appArguments = [];
    const cliArguments = [];
    const childProcessOptions = {};
    if (Array.isArray(app)) {
        appArguments = app.slice(1);
        app = app[0];
    }
    if (process.platform === 'darwin') {
        command = 'open';
        if (options.wait) {
            cliArguments.push('--wait-apps');
        }
        if (options.background) {
            cliArguments.push('--background');
        }
        if (app) {
            cliArguments.push('-a', app);
        }
    }
    else if (process.platform === 'win32' || (util_2.wsl && !util_2.docker())) {
        const windowsRoot = util_2.wsl ? yield wslGetWindowsEnvVar('systemroot') : process.env.SYSTEMROOT;
        command = String.raw `${windowsRoot}\System32\WindowsPowerShell\v1.0\powershell${util_2.wsl ? '.exe' : ''}`;
        cliArguments.push('-NoProfile', '-NonInteractive', '–ExecutionPolicy', 'Bypass', '-EncodedCommand');
        if (util_2.wsl) {
            command = yield windowsToWslPath(command);
        }
        else {
            childProcessOptions.windowsVerbatimArguments = true;
        }
        const encodedArguments = ['Start'];
        if (options.wait) {
            encodedArguments.push('-Wait');
        }
        if (app) {
            if (util_2.wsl && app.startsWith('/mnt/')) {
                const windowsPath = yield wslToWindowsPath(app);
                app = windowsPath;
            }
            encodedArguments.push(`"\`"${app}\`""`, '-ArgumentList');
            appArguments.unshift(target);
        }
        else {
            encodedArguments.push(`"\`"${target}\`""`);
        }
        if (appArguments.length > 0) {
            appArguments = appArguments.map(arg => `"\`"${arg}\`""`);
            encodedArguments.push(appArguments.join(','));
        }
        target = Buffer.from(encodedArguments.join(' '), 'utf16le').toString('base64');
    }
    else {
        if (app) {
            command = app;
        }
        else {
            const isBundled = !__dirname || __dirname === '/';
            let exeLocalXdgOpen = false;
            try {
                yield pAccess(localXdgOpenPath, fs.constants.X_OK);
                exeLocalXdgOpen = true;
            }
            catch (_) { }
            const useSystemXdgOpen = process.versions.electron ||
                process.platform === 'android' || isBundled || !exeLocalXdgOpen;
            command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
        }
        if (appArguments.length > 0) {
            cliArguments.push(...appArguments);
        }
        if (!options.wait) {
            childProcessOptions.stdio = 'ignore';
            childProcessOptions.detached = true;
        }
    }
    cliArguments.push(target);
    if (process.platform === 'darwin' && appArguments.length > 0) {
        cliArguments.push('--args', ...appArguments);
    }
    const subprocess = childProcess.spawn(command, cliArguments, childProcessOptions);
    if (options.wait) {
        return new Promise((resolve, reject) => {
            subprocess.once('error', reject);
            subprocess.once('close', (exitCode) => {
                if (options.allowNonzeroExitCode && exitCode > 0) {
                    reject(new Error(`Exited with code ${exitCode}`));
                    return;
                }
                resolve(subprocess);
            });
        });
    }
    subprocess.unref();
    return subprocess;
});
//# sourceMappingURL=open.js.map