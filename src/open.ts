/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - Cross-platform "open" utility.
 * Opens files/URLs in the default application or a specified browser.
 *
 * @author enoyao
 */

import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import { docker, wsl } from './util';

const pAccess = promisify(fs.access);
const pExecFile = promisify(childProcess.execFile);

const localXdgOpenPath = path.join(__dirname, 'xdg-open');

// ── WSL Path Conversion Helpers ──────────────────────────────────────────────

const wslToWindowsPath = async (wslPath: string): Promise<string> => {
  const { stdout } = await pExecFile('wslpath', ['-w', wslPath]);
  return stdout.trim();
};

const windowsToWslPath = async (winPath: string): Promise<string> => {
  const { stdout } = await pExecFile('wslpath', [winPath]);
  return stdout.trim();
};

const wslGetWindowsEnvVar = async (envVar: string): Promise<string> => {
  const { stdout } = await pExecFile('wslvar', [envVar]);
  return stdout.trim();
};

// ── Options Interface ────────────────────────────────────────────────────────

interface OpenOptions {
  /** Wait for the opened application to close. */
  wait?: boolean;
  /** Open in background (macOS only). */
  background?: boolean;
  /** Reject on non-zero exit code. */
  allowNonzeroExitCode?: boolean;
  /** Application to open with. Can be a string or [app, ...args]. */
  app?: string | string[];
}

interface ChildProcessOptions {
  stdio?: string;
  detached?: boolean;
  windowsVerbatimArguments?: boolean;
}

// ── Main Open Function ───────────────────────────────────────────────────────

/**
 * Open a target (file path or URL) using the system default application
 * or a specified browser/application.
 *
 * @param target - The file path or URL to open.
 * @param options - Configuration options.
 * @returns The spawned child process, or a Promise if `wait` is true.
 */
export default async (
  target: string,
  options?: OpenOptions,
): Promise<childProcess.ChildProcess> => {
  if (typeof target !== 'string') {
    throw new TypeError('Expected a `target`');
  }

  const opts: Required<Pick<OpenOptions, 'wait' | 'background' | 'allowNonzeroExitCode'>> & {
    app?: string | string[];
  } = {
    wait: false,
    background: false,
    allowNonzeroExitCode: false,
    ...options,
  };

  let command: string | undefined;
  let app = opts.app;
  let appArguments: string[] = [];
  const cliArguments: string[] = [];
  const childProcessOptions: ChildProcessOptions = {};

  if (Array.isArray(app)) {
    appArguments = app.slice(1);
    app = app[0];
  }

  if (process.platform === 'darwin') {
    // ── macOS ──────────────────────────────────────────────────────────────
    command = 'open';

    if (opts.wait) {
      cliArguments.push('--wait-apps');
    }

    if (opts.background) {
      cliArguments.push('--background');
    }

    if (app) {
      cliArguments.push('-a', app);
    }
  } else if (process.platform === 'win32' || (wsl && !docker())) {
    // ── Windows / WSL ──────────────────────────────────────────────────────
    const windowsRoot = wsl
      ? await wslGetWindowsEnvVar('systemroot')
      : process.env.SYSTEMROOT;

    command = String.raw`${windowsRoot}\System32\WindowsPowerShell\v1.0\powershell${wsl ? '.exe' : ''}`;
    cliArguments.push(
      '-NoProfile',
      '-NonInteractive',
      '–ExecutionPolicy',
      'Bypass',
      '-EncodedCommand',
    );

    if (wsl) {
      command = await windowsToWslPath(command);
    } else {
      childProcessOptions.windowsVerbatimArguments = true;
    }

    const encodedArguments = ['Start'];

    if (opts.wait) {
      encodedArguments.push('-Wait');
    }

    if (app) {
      if (wsl && app.startsWith('/mnt/')) {
        app = await wslToWindowsPath(app);
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
    // ── Linux ──────────────────────────────────────────────────────────────
    if (app) {
      command = app;
    } else {
      const isBundled = !__dirname || __dirname === '/';

      let exeLocalXdgOpen = false;
      try {
        await pAccess(localXdgOpenPath, fs.constants.X_OK);
        exeLocalXdgOpen = true;
      } catch {
        // xdg-open not available locally
      }

      const useSystemXdgOpen =
        (process.versions as Record<string, string | undefined>).electron ||
        process.platform === 'android' ||
        isBundled ||
        !exeLocalXdgOpen;
      command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
    }

    if (appArguments.length > 0) {
      cliArguments.push(...appArguments);
    }

    if (!opts.wait) {
      childProcessOptions.stdio = 'ignore';
      childProcessOptions.detached = true;
    }
  }

  cliArguments.push(target);

  if (process.platform === 'darwin' && appArguments.length > 0) {
    cliArguments.push('--args', ...appArguments);
  }

  const subprocess = childProcess.spawn(
    command!,
    cliArguments,
    childProcessOptions as childProcess.SpawnOptions,
  );

  if (opts.wait) {
    return new Promise((resolve, reject) => {
      subprocess.once('error', reject);

      subprocess.once('close', (exitCode: number) => {
        if (opts.allowNonzeroExitCode && exitCode > 0) {
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