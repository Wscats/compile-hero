/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

exports.typescriptxLoader = void 0;
import { successMessage, errorMessage, loaderOption } from '../util';
import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
const ts = require("gulp-typescript");
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const sourceMaps = require("gulp-sourcemaps");

export const typescriptxLoader = ({ fileName, outputPath, notificationStatus, compileOptions, rootPath }: loaderOption) => {
    const tsxConfigPath = path.join(rootPath, './tsconfig.json');
    const isExistsTsxconfigPath = fs.existsSync(tsxConfigPath);
    let fileDirectory = path.dirname(fileName);
    let sourceMapsUse = false;

    src(fileName)
        .pipe((() => {
            if (isExistsTsxconfigPath) {
                const tsxConfig = ts.createProject(tsxConfigPath);
                if (tsxConfig.options.rootDir == fileDirectory) {
                    outputPath = tsxConfig.options.outDir;
                } else {
                    outputPath = tsxConfig.options.outDir + (fileDirectory.replace(tsxConfig.options.rootDir, ""));
                }
                if (tsxConfig.options.sourceMap) {
                    sourceMapsUse = true;
                }
                return ts({
                    jsx: "react",
                }).pipe(tsxConfig()).on("error", (error: any) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(errorMessage);
                })
            } else {
                return ts({
                    jsx: "react",
                }).on("error", (error: any) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(errorMessage);
                })
            }
        })())
        .pipe(dest(outputPath));

    if (compileOptions.generateMinifiedJs) {
        src(fileName)
            .pipe((() => {
                if (isExistsTsxconfigPath) {
                    const tsxConfig = ts.createProject(tsxConfigPath);
                    return ts({
                        jsx: "react",
                    }).pipe(tsxConfig()).on("error", (error: any) => {
                        false && vscode.window.showErrorMessage(error.message);
                        vscode.window.setStatusBarMessage(errorMessage);
                    })
                } else {
                    return ts({
                        jsx: "react",
                    }).on("error", (error: any) => {
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
                if (isExistsTsxconfigPath) {
                    const tsConfig = ts.createProject(tsxConfigPath);
                    return ts({
                        jsx: "react",
                    }).pipe(tsConfig()).on("error", (error: any) => {
                        false && vscode.window.showErrorMessage(error.message);
                        vscode.window.setStatusBarMessage(errorMessage);
                    })
                } else {
                    return ts({
                        jsx: "react",
                    }).on("error", (error: any) => {
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