"use strict";
/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 *
 * @author enoyao
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.typescriptxLoader = void 0;
const util_1 = require("../util");
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const ts = require("gulp-typescript");
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
exports.typescriptxLoader = ({ fileName, outputPath, notificationStatus, compileOptions }) => {
    const tsxConfigPath = path.join(fileName, '../tsconfig.json');
    const isExistsTsxconfigPath = fs.existsSync(tsxConfigPath);
    src(fileName)
        .pipe((() => {
        if (isExistsTsxconfigPath) {
            const tsxConfig = ts.createProject(tsxConfigPath);
            return ts({
                jsx: "react",
            }).pipe(tsxConfig()).on("error", (error) => {
                false && vscode.window.showErrorMessage(error.message);
                vscode.window.setStatusBarMessage(util_1.errorMessage);
            });
        }
        else {
            return ts({
                jsx: "react",
            }).on("error", (error) => {
                false && vscode.window.showErrorMessage(error.message);
                vscode.window.setStatusBarMessage(util_1.errorMessage);
            });
        }
    })())
        .pipe(dest(outputPath));
    if (compileOptions.generateMinifiedJs) {
        src(fileName)
            .pipe((() => {
            if (isExistsTsxconfigPath) {
                const tsxConfig = ts.createProject(tsxConfigPath);
                return ts({
                    jsx: "react",
                }).pipe(tsxConfig()).on("error", (error) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(util_1.errorMessage);
                });
            }
            else {
                return ts({
                    jsx: "react",
                }).on("error", (error) => {
                    false && vscode.window.showErrorMessage(error.message);
                    vscode.window.setStatusBarMessage(util_1.errorMessage);
                });
            }
        })())
            .pipe(uglify())
            .pipe(dest(outputPath));
    }
    vscode.window.setStatusBarMessage(util_1.successMessage);
};
//# sourceMappingURL=typescriptx.js.map