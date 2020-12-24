"use strict";
/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.typescriptLoader = void 0;
const util_1 = require("../util");
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const ts = require("gulp-typescript");
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
exports.typescriptLoader = ({ fileName, outputPath, notificationStatus, compileOptions }) => {
    const tsConfigPath = path.join(fileName, '../tsconfig.json');
    const isExistsTsconfigPath = fs.existsSync(tsConfigPath);
    if (!compileOptions.generateMinifiedJsOnly) {
        src(fileName)
            .pipe((() => {
            if (isExistsTsconfigPath) {
                const tsConfig = ts.createProject(tsConfigPath);
                return ts().pipe(tsConfig()).on("error", (error) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(util_1.errorMessage);
                });
            }
            else {
                return ts().on("error", (error) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(util_1.errorMessage);
                });
            }
        })())
            .pipe(dest(outputPath));
    }
    if (compileOptions.generateMinifiedJs) {
        src(fileName)
            .pipe((() => {
            if (isExistsTsconfigPath) {
                const tsConfig = ts.createProject(tsConfigPath);
                return ts().pipe(tsConfig()).on("error", (error) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(util_1.errorMessage);
                });
            }
            else {
                return ts().on("error", (error) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(util_1.errorMessage);
                });
            }
        })())
            .pipe(uglify().on("error", (error) => {
            false && vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(util_1.errorMessage);
        }))
            .pipe((rename({ suffix: ".min" })))
            .pipe(dest(outputPath));
    }
    vscode.window.setStatusBarMessage(util_1.successMessage);
};
//# sourceMappingURL=typescript.js.map