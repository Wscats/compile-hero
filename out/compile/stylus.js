"use strict";
/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stylusLoader = void 0;
const util_1 = require("../util");
const path = require("path");
const vscode = require("vscode");
const { src, dest } = require("gulp");
const stylus = require("stylus");
const cssmin = require("gulp-minify-css");
const rename = require("gulp-rename");
exports.stylusLoader = ({ fileName, outputPath, notificationStatus, compileOptions, selectedText }) => {
    try {
        const css = stylus.render(selectedText || util_1.readFileContext(fileName), {
            // 作用域，支持 @import
            paths: [path.join(fileName, '../')],
        });
        src(fileName)
            .pipe(util_1.empty(css))
            .pipe(rename({ extname: ".css" }))
            .pipe(dest(outputPath))
            .on("end", () => {
            vscode.window.setStatusBarMessage(util_1.successMessage);
        });
        if (compileOptions.generateMinifiedCss) {
            src(fileName)
                .pipe(util_1.empty(css))
                .pipe(cssmin({ compatibility: "ie7" }))
                .pipe(rename({ suffix: ".min", extname: ".css" }))
                .pipe(dest(outputPath))
                .on("end", () => {
                vscode.window.setStatusBarMessage(util_1.successMessage);
            });
        }
    }
    catch (error) {
        notificationStatus && vscode.window.showErrorMessage(error.message);
        vscode.window.setStatusBarMessage(util_1.errorMessage);
    }
};
//# sourceMappingURL=stylus.js.map