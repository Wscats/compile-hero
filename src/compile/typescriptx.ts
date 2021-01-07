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

export const typescriptxLoader = ({ fileName, outputPath, notificationStatus, compileOptions }: loaderOption) => {
    let config = vscode.workspace.getConfiguration("compile-hero");
    const tsxConfigPath = path.join(fileName, '../tsconfig.json');
    const isExistsTsxconfigPath = fs.existsSync(tsxConfigPath);

    if (!compileOptions.generateMinifiedJsOnly) {
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
            .pipe(uglify())
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