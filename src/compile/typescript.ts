/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - TypeScript compiler.
 *
 * @author enoyao
 */

import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { successMessage, errorMessage, getErrorMessage } from '../util';
import type { LoaderOption } from '../util';
const ts = require('gulp-typescript');
const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

/**
 * Create a TypeScript compilation pipeline, optionally using a local tsconfig.json.
 *
 * @param tsConfigPath - Path to the tsconfig.json file.
 * @param tsOptions - Additional TypeScript compiler options.
 */
function createTsPipeline(
  tsConfigPath: string | null,
  tsOptions: Record<string, unknown> = {},
): NodeJS.ReadWriteStream {
  const handleError = (error: unknown): void => {
    // Silently handle TS errors (shown in status bar instead)
    vscode.window.setStatusBarMessage(errorMessage);
  };

  if (tsConfigPath && fs.existsSync(tsConfigPath)) {
    const tsConfig = ts.createProject(tsConfigPath);
    return ts(tsOptions).pipe(tsConfig()).on('error', handleError);
  }
  return ts(tsOptions).on('error', handleError);
}

/**
 * Compile TypeScript (.ts) files to JavaScript.
 * Supports both normal and minified output.
 */
export const typescriptLoader = ({
  fileName,
  outputPath,
  notificationStatus: _notificationStatus,
  compileOptions,
}: LoaderOption): void => {
  const tsConfigPath = path.join(fileName, '../tsconfig.json');

  if (!compileOptions.generateMinifiedJsOnly) {
    src(fileName)
      .pipe(createTsPipeline(tsConfigPath))
      .pipe(dest(outputPath));
  }

  if (compileOptions.generateMinifiedJs) {
    src(fileName)
      .pipe(createTsPipeline(tsConfigPath))
      .pipe(
        uglify().on('error', (error: unknown) => {
          vscode.window.setStatusBarMessage(errorMessage);
        }),
      )
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(outputPath));
  }

  vscode.window.setStatusBarMessage(successMessage);
};