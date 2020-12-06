/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

import { QuickPickItem } from "vscode";

interface PickItem extends QuickPickItem {
  [propName: string]: any;
}

const platform = process.platform;

const chromeItem: PickItem = {
  description: "Windows, Mac, Linux",
  detail: "A fast, secure, and free web browser built for the modern web",
  label: "Google Chrome",
  standardName: platform === 'win32'
    ? 'chrome'
    : (
      platform === 'darwin'
        ? 'google chrome'
        : 'google-chrome'
    ),
  acceptName: ['chrome', 'google chrome', 'google-chrome', 'gc', '谷歌浏览器']
};

const chromiumItem: PickItem = {
  description: "Mac",
  detail: "A fast, secure, and free web browser built for the modern web",
  label: "Google Chromium",
  standardName: "Chromium",
  acceptName: ['chromium']
};
const firefoxItem: PickItem = {
  description: "Windows, Mac, Linux",
  detail: "A fast, smart and personal web browser",
  label: "Mozilla Firefox",
  standardName: "firefox",
  acceptName: ['firefox', 'ff', 'mozilla firefox', '火狐浏览器']
};
const firefoxDeveloperItem: PickItem = {
  description: "Mac",
  detail: "A fast, smart and personal web browser",
  label: "Mozilla Firefox Developer Edition",
  standardName: "FirefoxDeveloperEdition",
  acceptName: ['firefox developer', 'fde', 'firefox developer edition']
};

const ieItem: PickItem = {
  description: "Windows",
  detail: "A slightly outdated browser",
  label: "Microsoft IE",
  standardName: "iexplore",
  acceptName: ['ie', 'iexplore']
};
const edgeItem: PickItem = {
  description: "Windows",
  detail: "A modern browser aiming to replace ie",
  label: "Microsoft Edge",
  standardName: "MicrosoftEdge",
  acceptName: ['edge', 'msedge', 'microsoftedge']
};

const safariItem: PickItem = {
  description: "Mac",
  detail: "A fast, efficient browser on Mac",
  label: "Apple Safari",
  standardName: "safari",
  acceptName: ['safari']
};

const operaItem: PickItem = {
  description: "Windows, Mac",
  detail: 'A fast, secure, easy-to-use browser',
  label: 'Opera',
  standardName: 'opera',
  acceptName: ['opera']
};

const browsers = [chromeItem, firefoxItem, operaItem];

if (process.platform === 'win32') {
  browsers.push(ieItem);
  browsers.push(edgeItem);
} else if (process.platform === 'darwin') {
  browsers.push(safariItem);
  browsers.push(chromiumItem);
  browsers.push(firefoxDeveloperItem);
}

export const browserConfig = {
  browsers: browsers,
  app: 'open-in-browser'
};