"use strict";
/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pugLoader = void 0;
const util_1 = require("../util");
const vscode = require("vscode");
const path = require("path");
const pug = require("pug");
const { src, dest } = require("gulp");
const rename = require("gulp-rename");
exports.pugLoader = ({ fileName, outputPath, notificationStatus, compileOptions, selectedText }) => {
    try {
        const options = { pretty: true, filename: path.join(fileName) };
        const html = selectedText ? pug.compile(selectedText, options)() : pug.renderFile(fileName, options);
        src(fileName)
            .pipe(util_1.empty(html))
            .pipe(rename({ extname: ".html" }))
            .pipe(dest(outputPath));
    }
    catch (error) {
        notificationStatus && vscode.window.showErrorMessage(error.message);
        vscode.window.setStatusBarMessage(util_1.errorMessage);
    }
    if (compileOptions.generateMinifiedHtml) {
        const options = { filename: path.join(fileName) };
        const html = selectedText ? pug.compile(selectedText, options)() : pug.renderFile(fileName, options);
        src(fileName)
            .pipe(util_1.empty(html))
            .pipe(rename({ suffix: ".min", extname: ".html" }))
            .pipe(dest(outputPath));
    }
    vscode.window.setStatusBarMessage(util_1.successMessage);
};
//# sourceMappingURL=pug.js.map