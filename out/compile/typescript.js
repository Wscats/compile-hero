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
const sourceMaps = require("gulp-sourcemaps");
exports.typescriptLoader = ({ fileName, outputPath, notificationStatus, compileOptions, rootPath }) => {
    const tsConfigPath = path.join(rootPath, './tsconfig.json');
    const isExistsTsconfigPath = fs.existsSync(tsConfigPath);
    let fileDirectory = path.dirname(fileName);
    let sourceMapsUse = false;
    src(fileName)
        .pipe((() => {
        if (isExistsTsconfigPath) {
            const tsConfig = ts.createProject(tsConfigPath);
            if (tsConfig.options.rootDir == fileDirectory) {
                outputPath = tsConfig.options.outDir;
            }
            else {
                outputPath = tsConfig.options.outDir + (fileDirectory.replace(tsConfig.options.rootDir, ""));
            }
            if (tsConfig.options.sourceMap) {
                sourceMapsUse = true;
            }
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
            .pipe(dest(outputPath));
    }
    if (sourceMapsUse) {
        src(fileName)
            .pipe(sourceMaps.init())
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
            .pipe(sourceMaps.write('.'))
            .pipe(dest(outputPath));
    }
    vscode.window.setStatusBarMessage(util_1.successMessage);
};
//# sourceMappingURL=typescript.js.map