/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - Browser configuration for "Open in Browser" feature.
 *
 * @author enoyao
 */

import type { QuickPickItem } from 'vscode';

// ── Types ────────────────────────────────────────────────────────────────────

interface BrowserPickItem extends QuickPickItem {
  /** Platform-specific executable name. */
  standardName: string;
  /** List of accepted name aliases (lowercase). */
  acceptName: string[];
  [propName: string]: unknown;
}

// ── Browser Definitions ──────────────────────────────────────────────────────

const platform = process.platform;

const chromeItem: BrowserPickItem = {
  description: 'Windows, Mac, Linux',
  detail: 'A fast, secure, and free web browser built for the modern web',
  label: 'Google Chrome',
  standardName:
    platform === 'win32' ? 'chrome' : platform === 'darwin' ? 'google chrome' : 'google-chrome',
  acceptName: ['chrome', 'google chrome', 'google-chrome', 'gc', '谷歌浏览器'],
};

const chromiumItem: BrowserPickItem = {
  description: 'Mac',
  detail: 'A fast, secure, and free web browser built for the modern web',
  label: 'Google Chromium',
  standardName: 'Chromium',
  acceptName: ['chromium'],
};

const firefoxItem: BrowserPickItem = {
  description: 'Windows, Mac, Linux',
  detail: 'A fast, smart and personal web browser',
  label: 'Mozilla Firefox',
  standardName: 'firefox',
  acceptName: ['firefox', 'ff', 'mozilla firefox', '火狐浏览器'],
};

const firefoxDeveloperItem: BrowserPickItem = {
  description: 'Mac',
  detail: 'A fast, smart and personal web browser',
  label: 'Mozilla Firefox Developer Edition',
  standardName: 'FirefoxDeveloperEdition',
  acceptName: ['firefox developer', 'fde', 'firefox developer edition'],
};

const ieItem: BrowserPickItem = {
  description: 'Windows',
  detail: 'A slightly outdated browser',
  label: 'Microsoft IE',
  standardName: 'iexplore',
  acceptName: ['ie', 'iexplore'],
};

const edgeItem: BrowserPickItem = {
  description: 'Windows',
  detail: 'A modern browser aiming to replace ie',
  label: 'Microsoft Edge',
  standardName: 'MicrosoftEdge',
  acceptName: ['edge', 'msedge', 'microsoftedge'],
};

const safariItem: BrowserPickItem = {
  description: 'Mac',
  detail: 'A fast, efficient browser on Mac',
  label: 'Apple Safari',
  standardName: 'safari',
  acceptName: ['safari'],
};

const operaItem: BrowserPickItem = {
  description: 'Windows, Mac',
  detail: 'A fast, secure, easy-to-use browser',
  label: 'Opera',
  standardName: 'opera',
  acceptName: ['opera'],
};

// ── Build Browser List ───────────────────────────────────────────────────────

const browsers: BrowserPickItem[] = [chromeItem, firefoxItem, operaItem];

if (platform === 'win32') {
  browsers.push(ieItem, edgeItem);
} else if (platform === 'darwin') {
  browsers.push(safariItem, chromiumItem, firefoxDeveloperItem);
}

// ── Export ────────────────────────────────────────────────────────────────────

export const browserConfig = {
  browsers,
  app: 'open-in-browser',
} as const;