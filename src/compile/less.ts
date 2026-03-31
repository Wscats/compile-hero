/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - Less compiler.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { successMessage, errorMessage, readFileContext, empty, getErrorMessage } from '../util';
import type { LoaderOption } from '../util';
const cssmin = require('gulp-minify-css');
const { src, dest } = require('gulp');
const less = require('less');
const rename = require('gulp-rename');

interface LessOutput {
  css: string;
}

interface LessError {
  message: string;
  filename?: string;
  line?: number;
}

/**
 * Compile Less files to CSS.
 * Supports selected text compilation and minified output.
 */
export const lessLoader = ({
  fileName,
  outputPath,
  notificationStatus,
  compileOptions,
  selectedText,
}: LoaderOption): void => {
  try {
    less
      .render(selectedText || readFileContext(fileName), {
        // Scope for @import support
        paths: [path.join(fileName, '../')],
      })
      .then((output: LessOutput) => {
        const css = output.css;

        if (!compileOptions.generateMinifiedCssOnly) {
          src(fileName)
            .pipe(empty(css))
            .pipe(rename({ extname: '.css' }))
            .pipe(dest(outputPath))
            .on('end', () => {
              vscode.window.setStatusBarMessage(successMessage);
            });
        }

        if (compileOptions.generateMinifiedCss) {
          src(fileName)
            .pipe(empty(css))
            .pipe(cssmin({ compatibility: 'ie7' }))
            .pipe(rename({ suffix: '.min', extname: '.css' }))
            .pipe(dest(outputPath))
            .on('end', () => {
              vscode.window.setStatusBarMessage(successMessage);
            });
        }
      })
      .catch((error: LessError) => {
        const message = `${error.message}${error.filename ? ` in file ${error.filename}` : ''}${error.line ? ` line no. ${error.line}` : ''}`;
        if (notificationStatus) {
          vscode.window.showErrorMessage(message);
        }
        vscode.window.setStatusBarMessage(errorMessage);
      });
  } catch (error: unknown) {
    if (notificationStatus) {
      vscode.window.showErrorMessage(getErrorMessage(error));
    }
    vscode.window.setStatusBarMessage(errorMessage);
  }
};