/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */


exports.typescriptLoader = void 0;
import { successMessage, errorMessage, loaderOption } from '../util';
import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
const ts = require("gulp-typescript");
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const sourceMaps = require("gulp-sourcemaps");

export const typescriptLoader = ({ fileName, outputPath, notificationStatus, compileOptions, rootPath }: loaderOption) => {
    const tsConfigPath = path.join(rootPath, './tsconfig.json');
    const isExistsTsconfigPath = fs.existsSync(tsConfigPath);
    let fileDirectory = path.dirname(fileName);
    let sourceMapsUse = false;

    src(fileName)
        .pipe((() => {
            if (isExistsTsconfigPath) {
                const tsConfig = ts.createProject(tsConfigPath);
                if (tsConfig.options.rootDir == fileDirectory) {
                    outputPath = tsConfig.options.outDir;
                } else {
                    outputPath = tsConfig.options.outDir + (fileDirectory.replace(tsConfig.options.rootDir, ""));
                }
                if (tsConfig.options.sourceMap) {
                    sourceMapsUse = true;
                }

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
        .pipe(dest(outputPath));
    
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
            .pipe(dest(outputPath));
    }

    if (sourceMapsUse) {
        src(fileName)
            .pipe(sourceMaps.init())
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
            .pipe(sourceMaps.write('.'))
            .pipe(dest(outputPath));
    }
    vscode.window.setStatusBarMessage(successMessage);
}