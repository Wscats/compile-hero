/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */


import * as vscode from "vscode";
const { src, dest } = require("gulp");
const babel = require("gulp-babel");
const babelEnv = require("@babel/preset-env");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
import { successMessage, errorMessage, loaderOption } from '../util';

export const javascriptLoader = ({ fileName, outputPath, notificationStatus, compileOptions }: loaderOption) => {
    let config = vscode.workspace.getConfiguration("compile-hero");
    if (/.dev.js|.prod.js$/g.test(fileName)) {
        vscode.window.setStatusBarMessage(
            `The prod or dev file has been processed and will not be compiled.`
        );
        return;
    }

    if (!compileOptions.generateMinifiedJsOnly) {
        src(fileName)
            .pipe(
                babel({
                    presets: [babelEnv],
                }).on("error", (error: any) => {
                    notificationStatus && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(errorMessage);
                })
            )
            .pipe(rename({ suffix: ".dev" }))
            .pipe(dest(() => {
                return outputPath.replace(
                    config.get("template-root-development-directory"),
                    config.get("template-destination-output-directory")
                );
            }));
    }

    if (compileOptions.generateMinifiedJs) {
        src(fileName)
            .pipe(
                babel({
                    presets: [babelEnv],
                }).on("error", (error: any) => {
                    notificationStatus && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(errorMessage);
                })
            )
            .pipe(uglify())
            .pipe(rename({ suffix: config.get("template-minified-output-suffix") }))
            .pipe(dest(() => {
                return outputPath.replace(
                    config.get("template-root-development-directory"),
                    config.get("template-destination-minified-output-directory")
                );
            }));
    }
    vscode.window.setStatusBarMessage(successMessage);
}