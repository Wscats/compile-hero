/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

import { successMessage, errorMessage, loaderOption } from '../util';
import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
const ts = require("gulp-typescript");
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

export const typescriptLoader = ({ fileName, outputPath, notificationStatus, compileOptions }: loaderOption) => {
    let config = vscode.workspace.getConfiguration("compile-hero");
    const tsConfigPath = path.join(fileName, '../tsconfig.json');
    const isExistsTsconfigPath = fs.existsSync(tsConfigPath)

    if (!compileOptions.generateMinifiedJsOnly) {
        src(fileName)
            .pipe((() => {
                if (isExistsTsconfigPath) {
                    const tsConfig = ts.createProject(tsConfigPath);
                    return ts().pipe(tsConfig()).on("error", (error: any) => {
                        false && vscode.window.showErrorMessage(error.message);
                        vscode.window.setStatusBarMessage(errorMessage);
                    })
                } else {
                    return ts().on("error", (error: any) => {
                        false && vscode.window.showErrorMessage(error.message);
                        vscode.window.setStatusBarMessage(errorMessage);
                    })
                }
            })())
            .pipe(dest(() => {
                return outputPath.replace(
                    config.get("template-root-development-directory"),
                    config.get("template-destination-output-directory")
                );
            }));
    }
    if (compileOptions.generateMinifiedJs) {
        src(fileName)
            .pipe((() => {
                if (isExistsTsconfigPath) {
                    const tsConfig = ts.createProject(tsConfigPath);
                    return ts().pipe(tsConfig()).on("error", (error: any) => {
                        false && vscode.window.showErrorMessage(error.message);
                        vscode.window.setStatusBarMessage(errorMessage);
                    })
                } else {
                    return ts().on("error", (error: any) => {
                        false && vscode.window.showErrorMessage(error.message);
                        vscode.window.setStatusBarMessage(errorMessage);
                    })
                }
            })())
            .pipe(
                uglify().on("error", (error: any) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(errorMessage);
                })
            )
            .pipe((rename({ suffix: config.get("template-minified-output-suffix") })))
            .pipe(dest(() => {
                return outputPath.replace(
                    config.get("template-root-development-directory"),
                    config.get("template-destination-minified-output-directory")
                );
            }));
    }
    vscode.window.setStatusBarMessage(successMessage);
}