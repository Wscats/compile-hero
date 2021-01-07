/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */


import * as vscode from "vscode";
import * as path from "path";
const { src, dest } = require("gulp");
const sass = require("sass");
const cssmin = require("gulp-minify-css");
const rename = require("gulp-rename");
import { empty, successMessage, errorMessage, loaderOption } from '../util';

export const sassLoader = ({ fileName, outputPath, notificationStatus, compileOptions, selectedText }: loaderOption) => {
    let config = vscode.workspace.getConfiguration("compile-hero");
    try {
        selectedText = selectedText && sass.renderSync({
            data: selectedText,
            // 作用域，支持 @import
            includePaths: [path.join(fileName, '../')]
        }).css;
        const text = selectedText || sass.renderSync({ file: fileName }).css.toString();

        if (!compileOptions.generateMinifiedCssOnly) {
            src(fileName)
                .pipe(empty(text))
                .pipe(
                    rename({
                        extname: ".css",
                    })
                )
                .pipe(dest(() => {
                    return outputPath.replace(
                        config.get("template-root-development-directory"),
                        config.get("template-destination-output-directory")
                    );
                }))
        }

        if (compileOptions.generateMinifiedCss) {
            src(fileName)
                .pipe(empty(text))
                .pipe(cssmin({ compatibility: "ie7" }))
                .pipe(
                    rename({
                        extname: ".css",
                        suffix: config.get("template-minified-output-suffix"),
                    })
                )
                .pipe(dest(() => {
                    return outputPath.replace(
                        config.get("template-root-development-directory"),
                        config.get("template-destination-minified-output-directory")
                    );
                }));
        }
        vscode.window.setStatusBarMessage(successMessage);
    } catch (error) {
        notificationStatus && vscode.window.showErrorMessage(error.message);
        vscode.window.setStatusBarMessage(errorMessage);
    }
}
