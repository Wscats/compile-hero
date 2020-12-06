/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

import { successMessage, errorMessage, loaderOption, readFileContext, empty } from '../util';
import * as vscode from "vscode";
import * as path from "path";
const cssmin = require("gulp-minify-css");
const { src, dest } = require("gulp");
const less = require("less");
const rename = require("gulp-rename");

export const lessLoader = ({ fileName, outputPath, notificationStatus, compileOptions, selectedText }: loaderOption) => {
    try {
        let css = "";
        less.render(selectedText || readFileContext(fileName), {
            // 作用域，支持 @import
            paths: [path.join(fileName, '../')]
        }).then((output: any) => {
            css = output.css;

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
        }).catch((error: any) => {
            const message = error.message + ' in file ' + error.filename + ' line no. ' + error.line;
            notificationStatus && vscode.window.showErrorMessage(message);
            vscode.window.setStatusBarMessage(errorMessage);
        });
    } catch (error) {
        notificationStatus && vscode.window.showErrorMessage(error.message);
        vscode.window.setStatusBarMessage(errorMessage);
    }
}