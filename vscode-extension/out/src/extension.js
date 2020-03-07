"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const p = require("path");
const { compileSass, sass } = require('./sass/index');
const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const babelEnv = require('@babel/preset-env');
const less = require('gulp-less');
const cssmin = require('gulp-minify-css');
const ts = require('gulp-typescript');
const jade = require('gulp-jade');
const open = require('open');
const readFileContext = (path) => {
    return fs.readFileSync(path).toString();
};
const fileType = (filename) => {
    const index1 = filename.lastIndexOf(".");
    const index2 = filename.length;
    const type = filename.substring(index1, index2);
    return type;
};
const handleFilePath = (path, length) => {
    return path = path.substring(0, path.length - length);
};
const writeScssFileContext = (path, data, isExpanded) => {
    path = handleFilePath(path, 5);
    fs.writeFile(isExpanded ? `${path}.css` : `${path}.min.css`, data, () => {
        vscode.window.showInformationMessage(`编译SCSS成功!`);
    });
};
const readFileName = (path, fileContext) => __awaiter(void 0, void 0, void 0, function* () {
    let fileSuffix = fileType(path);
    let outputPath = p.resolve(path, '../');
    console.log(path, fileSuffix, fileContext);
    switch (fileSuffix) {
        case '.scss':
            try {
                let { text } = yield compileSass(fileContext, {
                    style: sass.style.expanded,
                });
                writeScssFileContext(path, text, true);
            }
            catch (error) {
                vscode.window.showErrorMessage(`编译SCSS失败: ${error}`);
            }
            try {
                let { text } = yield compileSass(fileContext, {
                    style: sass.style.compressed,
                });
                writeScssFileContext(path, text, false);
            }
            catch (error) {
                vscode.window.showErrorMessage(`编译SCSS失败: ${error}`);
            }
            break;
        case '.js':
            try {
                src(path)
                    .pipe(babel({
                    presets: [babelEnv]
                }))
                    .pipe(rename({ suffix: '.es5' }))
                    .pipe(dest(outputPath));
                vscode.window.showInformationMessage(`编译JS成功!`);
            }
            catch (error) {
                vscode.window.showErrorMessage(`编译JS失败: ${error}`);
            }
            try {
                src(path)
                    .pipe(babel({
                    presets: [babelEnv]
                }))
                    .pipe(uglify())
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(dest(outputPath));
                vscode.window.showInformationMessage(`编译JS成功!`);
            }
            catch (error) {
                vscode.window.showErrorMessage(`编译JS失败: ${error}`);
            }
            break;
        case '.less':
            src(path)
                .pipe(less())
                .pipe(dest(outputPath));
            src(path)
                .pipe(less())
                .pipe(cssmin({ compatibility: 'ie7' }))
                .pipe(rename({ suffix: '.min' }))
                .pipe(dest(outputPath));
            break;
        case '.ts':
            src(path)
                .pipe(ts())
                .pipe(dest(outputPath));
            break;
        case '.tsx':
            src(path)
                .pipe(ts({
                jsx: 'react'
            }))
                .pipe(dest(outputPath));
            break;
        case '.jade':
            src(path)
                .pipe(jade())
                .pipe(dest(outputPath));
            break;
        default:
            console.log('没找到对应的文件');
            break;
    }
});
function activate(context) {
    console.log('Congratulations, your extension "qf" is now active!');
    let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World!');
    });
    let openInBrowser = vscode.commands.registerCommand('extension.openInBrowser', (path) => {
        let uri = path.fsPath;
        open(uri, { app: ['google chrome'] });
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(openInBrowser);
    vscode.workspace.onDidSaveTextDocument((document) => {
        const { fileName } = document;
        const fileContext = readFileContext(fileName);
        readFileName(fileName, fileContext);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map