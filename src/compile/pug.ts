/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */

import { successMessage, errorMessage, empty, loaderOption } from '../util';
import * as vscode from "vscode";
import * as path from "path";
const pug = require("pug");
const { src, dest } = require("gulp");
const rename = require("gulp-rename");

export const pugLoader = ({ fileName, outputPath, notificationStatus, compileOptions, selectedText }: loaderOption) => {
    try {
        const options = { pretty: true, filename: path.join(fileName) };
        const html = selectedText ? pug.compile(selectedText, options)() : pug.renderFile(fileName, options);
        src(fileName)
            .pipe(empty(html))
            .pipe(rename({ extname: ".html" }))
            .pipe(dest(outputPath));
    } catch (error) {
        notificationStatus && vscode.window.showErrorMessage(error.message);
        vscode.window.setStatusBarMessage(errorMessage);
    }

    if (compileOptions.generateMinifiedHtml) {
        const options = { filename: path.join(fileName) };
        const html = selectedText ? pug.compile(selectedText, options)() : pug.renderFile(fileName, options);
        src(fileName)
            .pipe(empty(html))
            .pipe(rename({ suffix: ".min", extname: ".html" }))
            .pipe(dest(outputPath));
    }
    vscode.window.setStatusBarMessage(successMessage);
}