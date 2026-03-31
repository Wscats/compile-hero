/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - Stylus compiler.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { successMessage, errorMessage, readFileContext, empty, getErrorMessage } from '../util';
import type { LoaderOption } from '../util';
const { src, dest } = require('gulp');
const stylus = require('stylus');
const cssmin = require('gulp-minify-css');
const rename = require('gulp-rename');

/**
 * Compile Stylus files to CSS.
 * Supports selected text compilation and minified output.
 */
export const stylusLoader = ({
  fileName,
  outputPath,
  notificationStatus,
  compileOptions,
  selectedText,
}: LoaderOption): void => {
  try {
    const css = stylus.render(selectedText || readFileContext(fileName), {
      // Scope for @import support
      paths: [path.join(fileName, '../')],
    });

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
  } catch (error: unknown) {
    if (notificationStatus) {
      vscode.window.showErrorMessage(getErrorMessage(error));
    }
    vscode.window.setStatusBarMessage(errorMessage);
  }
};