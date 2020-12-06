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
    try {
        const css = stylus.render(selectedText || readFileContext(fileName), {
            // 作用域，支持 @import
            paths: [path.join(fileName, '../')],
        })
        src(fileName)
            .pipe(empty(css))
            .pipe(rename({ extname: ".css" }))
            .pipe(dest(outputPath))
            .on("end", () => {
                vscode.window.setStatusBarMessage(successMessage);
            });

        if (compileOptions.generateMinifiedCss) {
            src(fileName)
                .pipe(empty(css))
                .pipe(cssmin({ compatibility: "ie7" }))
                .pipe(rename({ suffix: ".min", extname: ".css" }))
                .pipe(dest(outputPath))
                .on("end", () => {
                    vscode.window.setStatusBarMessage(successMessage);
                });
        }
    } catch (error) {
        notificationStatus && vscode.window.showErrorMessage(error.message);
        vscode.window.setStatusBarMessage(errorMessage);
    }
}