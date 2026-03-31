/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - Pug/Jade template compiler.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { successMessage, errorMessage, empty, getErrorMessage } from '../util';
import type { LoaderOption } from '../util';
const pug = require('pug');
const { src, dest } = require('gulp');
const rename = require('gulp-rename');

/**
 * Compile Pug/Jade template files to HTML.
 * Supports selected text compilation and minified output.
 */
export const pugLoader = ({
  fileName,
  outputPath,
  notificationStatus,
  compileOptions,
  selectedText,
}: LoaderOption): void => {
  try {
    // Normal (pretty-printed) HTML output
    if (!compileOptions.generateMinifiedHtmlOnly) {
      const options = { pretty: true, filename: path.join(fileName) };
      const html = selectedText
        ? pug.compile(selectedText, options)()
        : pug.renderFile(fileName, options);
      src(fileName)
        .pipe(empty(html))
        .pipe(rename({ extname: '.html' }))
        .pipe(dest(outputPath));
    }

    // Minified HTML output
    if (compileOptions.generateMinifiedHtml) {
      const options = { filename: path.join(fileName) };
      const html = selectedText
        ? pug.compile(selectedText, options)()
        : pug.renderFile(fileName, options);
      src(fileName)
        .pipe(empty(html))
        .pipe(rename({ suffix: '.min', extname: '.html' }))
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