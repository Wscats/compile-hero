/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - Status bar UI management.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';

/**
 * Manages the Compile Hero status bar item in VS Code.
 * Provides visual feedback for compilation state (watching, not watching, working, success, error).
 */
export class StatusBarUi {
  private static _statusBarItem: vscode.StatusBarItem;

  private static get statusBarItem(): vscode.StatusBarItem {
    if (!StatusBarUi._statusBarItem) {
      StatusBarUi._statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        200,
      );
      StatusBarUi._statusBarItem.show();
    }
    return StatusBarUi._statusBarItem;
  }

  static show(): void {
    this.statusBarItem.show();
  }

  static hide(): void {
    this.statusBarItem.hide();
  }

  /**
   * Initialize the status bar with the current compile-on-save state.
   *
   * @param disableCompileFilesOnDidSaveCode - Whether auto-compilation is disabled.
   */
  static init(disableCompileFilesOnDidSaveCode: boolean | string): void {
    StatusBarUi.working('Starting...');
    setTimeout(() => {
      if (disableCompileFilesOnDidSaveCode) {
        StatusBarUi.notWatching();
      } else {
        StatusBarUi.watching();
      }
    }, 1000);
  }

  /** Set status bar to "watching" (auto-compile enabled). */
  static watching(): void {
    StatusBarUi.statusBarItem.text = '$(eye) Compile Hero: On';
    StatusBarUi.statusBarItem.color = 'inherit';
    StatusBarUi.statusBarItem.command = 'compile-hero.compileHeroOn';
    StatusBarUi.statusBarItem.tooltip = 'Stop live compilation';
  }

  /** Set status bar to "not watching" (auto-compile disabled). */
  static notWatching(): void {
    StatusBarUi.statusBarItem.text = '$(eye-closed) Compile Hero: Off';
    StatusBarUi.statusBarItem.color = 'inherit';
    StatusBarUi.statusBarItem.command = 'compile-hero.compileHeroOff';
    StatusBarUi.statusBarItem.tooltip = 'Enable live compilation';
  }

  /** Set status bar to "working" state with a custom message. */
  static working(workingMsg = 'Working on it...'): void {
    StatusBarUi.statusBarItem.text = `$(pulse) ${workingMsg}`;
    StatusBarUi.statusBarItem.tooltip =
      'In case if it takes long time, Show output window and report.';
    StatusBarUi.statusBarItem.command = undefined;
  }

  /** Set status bar to "compilation success" state. */
  static compilationSuccess(isWatching: boolean): void {
    StatusBarUi.statusBarItem.text = '$(check) Success';
    StatusBarUi.statusBarItem.color = '#33ff00';
    StatusBarUi.statusBarItem.command = undefined;

    if (isWatching) {
      setTimeout(() => {
        StatusBarUi.statusBarItem.color = 'inherit';
        StatusBarUi.watching();
      }, 4500);
    } else {
      StatusBarUi.notWatching();
    }
  }

  /** Set status bar to "compilation error" state. */
  static compilationError(isWatching: boolean): void {
    StatusBarUi.statusBarItem.text = '$(x) Error';
    StatusBarUi.statusBarItem.color = '#ff0033';
    StatusBarUi.statusBarItem.command = undefined;

    if (isWatching) {
      setTimeout(() => {
        StatusBarUi.statusBarItem.color = 'inherit';
        StatusBarUi.watching();
      }, 4500);
    } else {
      StatusBarUi.notWatching();
    }
  }

  /** Dispose the status bar item. */
  static dispose(): void {
    StatusBarUi.statusBarItem.dispose();
  }
}