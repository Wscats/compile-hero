/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */


import { successMessage, errorMessage, loaderOption, readFileContext, empty } from '../util';
import * as path from "path";
import * as vscode from "vscode";
const { src, dest } = require("gulp");
const stylus = require("stylus");
const cssmin = require("gulp-minify-css");
const rename = require("gulp-rename");

export const stylusLoader = ({ fileName, outputPath, notificationStatus, compileOptions, selectedText }: loaderOption) => {
    let config = vscode.workspace.getConfiguration("compile-hero");
    try {
        const css = stylus.render(selectedText || readFileContext(fileName), {
            // 作用域，支持 @import
            paths: [path.join(fileName, '../')],
        })
        if (!compileOptions.generateMinifiedCssOnly) {
            src(fileName)
                .pipe(empty(css))
                .pipe(rename({ extname: ".css" }))
                .pipe(dest(() => {
                    return outputPath.replace(
                        config.get("template-root-development-directory"),
                        config.get("template-destination-output-directory")
                    );
                }))
                .on("end", () => {
                    vscode.window.setStatusBarMessage(successMessage);
                });
        }

        if (compileOptions.generateMinifiedCss) {
            src(fileName)
                .pipe(empty(css))
                .pipe(cssmin({ compatibility: "ie7" }))
                .pipe(rename({ suffix: config.get("template-minified-output-suffix"), extname: ".css" }))
                .pipe(dest(() => {
                    return outputPath.replace(
                        config.get("template-root-development-directory"),
                        config.get("template-destination-minified-output-directory")
                    );
                }))
                .on("end", () => {
                    vscode.window.setStatusBarMessage(successMessage);
                });
        }
    } catch (error) {
        notificationStatus && vscode.window.showErrorMessage(error.message);
        vscode.window.setStatusBarMessage(errorMessage);
    }
}