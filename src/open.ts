/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

import { promisify } from "util";
import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";
import { docker, wsl } from './util';

const pAccess = promisify(fs.access);
const pExecFile = promisify(childProcess.execFile);

const localXdgOpenPath = path.join(__dirname, 'xdg-open');

const wslToWindowsPath = async (path: string) => {
    const { stdout } = await pExecFile('wslpath', ['-w', path]);
    return stdout.trim();
};

const windowsToWslPath = async (path: string) => {
    const { stdout } = await pExecFile('wslpath', [path]);
    return stdout.trim();
};

const wslGetWindowsEnvVar = async (envVar: string) => {
    const { stdout } = await pExecFile('wslvar', [envVar]);
    return stdout.trim();
};

export default async (target: string, options: any) => {
    if (typeof target !== 'string') {
        throw new TypeError('Expected a `target`');
    }

    options = {
        wait: false,
        background: false,
        allowNonzeroExitCode: false,
        ...options
    };

    let command;
    let { app } = options;
    let appArguments = [];
    const cliArguments = [];
    const childProcessOptions: any = {};

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
    } else if (process.platform === 'win32' || (wsl && !docker())) {
        const windowsRoot = wsl ? await wslGetWindowsEnvVar('systemroot') : process.env.SYSTEMROOT;
        command = String.raw`${windowsRoot}\System32\WindowsPowerShell\v1.0\powershell${wsl ? '.exe' : ''}`;
        cliArguments.push(
            '-NoProfile',
            '-NonInteractive',
            '–ExecutionPolicy',
            'Bypass',
            '-EncodedCommand'
        );

        if (wsl) {
            command = await windowsToWslPath(command);
        } else {
            childProcessOptions.windowsVerbatimArguments = true;
        }

        const encodedArguments = ['Start'];

        if (options.wait) {
            encodedArguments.push('-Wait');
        }

        if (app) {
            if (wsl && app.startsWith('/mnt/')) {
                const windowsPath = await wslToWindowsPath(app);
                app = windowsPath;
            }

            encodedArguments.push(`"\`"${app}\`""`, '-ArgumentList');
            appArguments.unshift(target);
        } else {
            encodedArguments.push(`"\`"${target}\`""`);
        }

        if (appArguments.length > 0) {
            appArguments = appArguments.map(arg => `"\`"${arg}\`""`);
            encodedArguments.push(appArguments.join(','));
        }

        target = Buffer.from(encodedArguments.join(' '), 'utf16le').toString('base64');
    } else {
        if (app) {
            command = app;
        } else {
            const isBundled = !__dirname || __dirname === '/';

            let exeLocalXdgOpen = false;
            try {
                await pAccess(localXdgOpenPath, fs.constants.X_OK);
                exeLocalXdgOpen = true;
            } catch (_) { }

            const useSystemXdgOpen = (process.versions as any).electron ||
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

            subprocess.once('close', (exitCode: number) => {
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
};