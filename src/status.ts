/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';

export class StatusBarUi {
    private static _statusBarItem: vscode.StatusBarItem;
    private static get statusBarItem() {
        if (!StatusBarUi._statusBarItem) {
            StatusBarUi._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
            this.statusBarItem.show();
        }
        return StatusBarUi._statusBarItem;
    }

    static init(disableCompileFilesOnDidSaveCode: string) {
        StatusBarUi.working("Starting...");
        setTimeout(function () {
            disableCompileFilesOnDidSaveCode ? StatusBarUi.notWatching() : StatusBarUi.watching();
        }, 1000);
    }

    static watching() {
        StatusBarUi.statusBarItem.text = `$(eye) Compile Hero: On`;
        StatusBarUi.statusBarItem.color = 'inherit';
        StatusBarUi.statusBarItem.command = 'compile-hero.compileHeroOn';
        StatusBarUi.statusBarItem.tooltip = 'Stop live compilation';
    }

    static notWatching() {
        StatusBarUi.statusBarItem.text = `$(eye-closed) Compile Hero: Off`;
        StatusBarUi.statusBarItem.color = 'inherit';
        StatusBarUi.statusBarItem.command = 'compile-hero.compileHeroOff';
        StatusBarUi.statusBarItem.tooltip = 'live compilation';
    }

    static working(workingMsg: string = "Working on it...") {
        StatusBarUi.statusBarItem.text = `$(pulse) ${workingMsg}`;
        StatusBarUi.statusBarItem.tooltip = 'In case if it takes long time, Show output window and report.';
        StatusBarUi.statusBarItem.command = undefined;
    }

    static compilationSuccess(isWatching: boolean) {
        StatusBarUi.statusBarItem.text = `$(check) Success`;
        StatusBarUi.statusBarItem.color = '#33ff00';
        StatusBarUi.statusBarItem.command = undefined;
        if (isWatching) {
            setTimeout(function () {
                StatusBarUi.statusBarItem.color = 'inherit';
                StatusBarUi.watching();
            }, 4500);
        }
        else {
            StatusBarUi.notWatching();
        }
    }
    static compilationError(isWatching: boolean) {
        StatusBarUi.statusBarItem.text = `$(x) Error`;
        StatusBarUi.statusBarItem.color = '#ff0033';
        StatusBarUi.statusBarItem.command = undefined;
        if (isWatching) {
            setTimeout(function () {
                StatusBarUi.statusBarItem.color = 'inherit';
                StatusBarUi.watching();
            }, 4500);
        }
        else {
            StatusBarUi.notWatching();
        }
    }

    static dispose() {
        StatusBarUi.statusBarItem.dispose();
    }
}