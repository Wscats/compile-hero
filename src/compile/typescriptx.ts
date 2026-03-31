/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * Compile Hero - TypeScript JSX (TSX) compiler.
 *
 * @author enoyao
 */

import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { successMessage, errorMessage } from '../util';
import type { LoaderOption } from '../util';
const ts = require('gulp-typescript');
const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

/** Default TSX compiler options (React JSX transform). */
const TSX_OPTIONS: Record<string, unknown> = { jsx: 'react' };

/**
 * Create a TypeScript JSX compilation pipeline, optionally using a local tsconfig.json.
 */
function createTsxPipeline(tsConfigPath: string | null): NodeJS.ReadWriteStream {
  const handleError = (_error: unknown): void => {
    vscode.window.setStatusBarMessage(errorMessage);
  };

  if (tsConfigPath && fs.existsSync(tsConfigPath)) {
    const tsxConfig = ts.createProject(tsConfigPath);
    return ts(TSX_OPTIONS).pipe(tsxConfig()).on('error', handleError);
  }
  return ts(TSX_OPTIONS).on('error', handleError);
}

/**
 * Compile TypeScript JSX (.tsx) files to JavaScript.
 * Supports both normal and minified output.
 */
export const typescriptxLoader = ({
  fileName,
  outputPath,
  notificationStatus: _notificationStatus,
  compileOptions,
}: LoaderOption): void => {
  const tsxConfigPath = path.join(fileName, '../tsconfig.json');

  if (!compileOptions.generateMinifiedJsOnly) {
    src(fileName)
      .pipe(createTsxPipeline(tsxConfigPath))
      .pipe(dest(outputPath));
  }

  if (compileOptions.generateMinifiedJs) {
    src(fileName)
      .pipe(createTsxPipeline(tsxConfigPath))
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(outputPath));
  }

  vscode.window.setStatusBarMessage(successMessage);
};