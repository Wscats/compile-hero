/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - Sass/SCSS compiler.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';
import * as path from 'path';
const { src, dest } = require('gulp');
const sass = require('sass');
const cssmin = require('gulp-minify-css');
const rename = require('gulp-rename');
import { empty, successMessage, errorMessage, getErrorMessage } from '../util';
import type { LoaderOption } from '../util';

/**
 * Compile Sass/SCSS files to CSS.
 * Supports selected text compilation and minified output.
 */
export const sassLoader = ({
  fileName,
  outputPath,
  notificationStatus,
  compileOptions,
  selectedText,
}: LoaderOption): void => {
  try {
    const compiledText =
      selectedText
        ? sass.renderSync({
            data: selectedText,
            // Scope for @import support
            includePaths: [path.join(fileName, '../')],
          }).css
        : undefined;

    const text = compiledText || sass.renderSync({ file: fileName }).css.toString();

    if (!compileOptions.generateMinifiedCssOnly) {
      src(fileName)
        .pipe(empty(text))
        .pipe(rename({ extname: '.css' }))
        .pipe(dest(outputPath));
    }

    if (compileOptions.generateMinifiedCss) {
      src(fileName)
        .pipe(empty(text))
        .pipe(cssmin({ compatibility: 'ie7' }))
        .pipe(rename({ extname: '.css', suffix: '.min' }))
        .pipe(dest(outputPath));
    }

    vscode.window.setStatusBarMessage(successMessage);
  } catch (error: unknown) {
    if (notificationStatus) {
      vscode.window.showErrorMessage(getErrorMessage(error));
    }
    vscode.window.setStatusBarMessage(errorMessage);
  }
};
