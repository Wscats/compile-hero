/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - JavaScript (ES6+) compiler via Babel.
 *
 * @author enoyao
 */

import * as vscode from 'vscode';
import { successMessage, errorMessage, getErrorMessage } from '../util';
import type { LoaderOption } from '../util';
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const babelEnv = require('@babel/preset-env');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

/** Pattern to detect already-compiled dev/prod files. */
const COMPILED_FILE_PATTERN = /\.dev\.js|\.prod\.js$/;

/**
 * Compile JavaScript (ES6+) files to ES5 using Babel.
 * Supports both development (readable) and production (minified) output.
 */
export const javascriptLoader = ({
  fileName,
  outputPath,
  notificationStatus,
  compileOptions,
}: LoaderOption): void => {
  if (COMPILED_FILE_PATTERN.test(fileName)) {
    vscode.window.setStatusBarMessage(
      'The prod or dev file has been processed and will not be compiled.',
    );
    return;
  }

  const handleBabelError = (error: unknown): void => {
    if (notificationStatus) {
      vscode.window.showErrorMessage(getErrorMessage(error));
    }
    vscode.window.setStatusBarMessage(errorMessage);
  };

  if (!compileOptions.generateMinifiedJsOnly) {
    src(fileName)
      .pipe(
        babel({ presets: [babelEnv] }).on('error', handleBabelError),
      )
      .pipe(rename({ suffix: '.dev' }))
      .pipe(dest(outputPath));
  }

  if (compileOptions.generateMinifiedJs) {
    src(fileName)
      .pipe(
        babel({ presets: [babelEnv] }).on('error', handleBabelError),
      )
      .pipe(uglify())
      .pipe(rename({ suffix: '.prod' }))
      .pipe(dest(outputPath));
  }

  vscode.window.setStatusBarMessage(successMessage);
};