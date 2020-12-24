"use strict";
/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.javascriptLoader = void 0;
const vscode = require("vscode");
const { src, dest } = require("gulp");
const babel = require("gulp-babel");
const babelEnv = require("@babel/preset-env");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const util_1 = require("../util");
exports.javascriptLoader = ({ fileName, outputPath, notificationStatus, compileOptions }) => {
    if (/.dev.js|.prod.js$/g.test(fileName)) {
        vscode.window.setStatusBarMessage(`The prod or dev file has been processed and will not be compiled.`);
        return;
    }
    if (!compileOptions.generateMinifiedJsOnly) {
        src(fileName)
            .pipe(babel({
            presets: [babelEnv],
        }).on("error", (error) => {
            notificationStatus && vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(util_1.errorMessage);
        }))
            .pipe(rename({ suffix: ".dev" }))
            .pipe(dest(outputPath));
    }
    if (compileOptions.generateMinifiedJs) {
        src(fileName)
            .pipe(babel({
            presets: [babelEnv],
        }).on("error", (error) => {
            notificationStatus && vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(util_1.errorMessage);
        }))
            .pipe(uglify())
            .pipe(rename({ suffix: ".prod" }))
            .pipe(dest(outputPath));
    }
    vscode.window.setStatusBarMessage(util_1.successMessage);
};
//# sourceMappingURL=javascript.js.map