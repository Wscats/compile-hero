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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var vscode = require("vscode");
var fs = require("fs");
var p = require("path");
var _a = require('./sass/index'), compileSass = _a.compileSass, sass = _a.sass;
var _b = require('gulp'), src = _b.src, dest = _b.dest;
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var babelEnv = require('@babel/preset-env');
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');
var ts = require('gulp-typescript');
var jade = require('gulp-jade');
var open = require('open');
var readFileContext = function (path) {
    return fs.readFileSync(path).toString();
};
var fileType = function (filename) {
    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    var type = filename.substring(index1, index2);
    return type;
};
var handleFilePath = function (path, length) {
    return path = path.substring(0, path.length - length);
};
var writeScssFileContext = function (path, data, isExpanded) {
    path = handleFilePath(path, 5);
    fs.writeFile(isExpanded ? path + ".css" : path + ".min.css", data, function () {
        vscode.window.showInformationMessage("\u7F16\u8BD1SCSS\u6210\u529F!");
    });
};
var readFileName = function (path, fileContext) { return __awaiter(void 0, void 0, void 0, function () {
    var fileSuffix, outputPath, _a, text, error_1, text, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fileSuffix = fileType(path);
                outputPath = p.resolve(path, '../');
                console.log(path, fileSuffix, fileContext);
                _a = fileSuffix;
                switch (_a) {
                    case '.scss': return [3 /*break*/, 1];
                    case '.js': return [3 /*break*/, 8];
                    case '.less': return [3 /*break*/, 9];
                    case '.ts': return [3 /*break*/, 10];
                    case '.tsx': return [3 /*break*/, 11];
                    case '.jade': return [3 /*break*/, 12];
                }
                return [3 /*break*/, 13];
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, compileSass(fileContext, {
                        style: sass.style.expanded
                    })];
            case 2:
                text = (_b.sent()).text;
                writeScssFileContext(path, text, true);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                vscode.window.showErrorMessage("\u7F16\u8BD1SCSS\u5931\u8D25: " + error_1);
                return [3 /*break*/, 4];
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, compileSass(fileContext, {
                        style: sass.style.compressed
                    })];
            case 5:
                text = (_b.sent()).text;
                writeScssFileContext(path, text, false);
                return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                vscode.window.showErrorMessage("\u7F16\u8BD1SCSS\u5931\u8D25: " + error_2);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 14];
            case 8:
                try {
                    src(path)
                        .pipe(babel({
                        presets: [babelEnv]
                    }))
                        .pipe(rename({ suffix: '.es5' }))
                        .pipe(dest(outputPath));
                    vscode.window.showInformationMessage("\u7F16\u8BD1JS\u6210\u529F!");
                }
                catch (error) {
                    vscode.window.showErrorMessage("\u7F16\u8BD1JS\u5931\u8D25: " + error);
                }
                try {
                    src(path)
                        .pipe(babel({
                        presets: [babelEnv]
                    }))
                        .pipe(uglify())
                        .pipe(rename({ suffix: '.min' }))
                        .pipe(dest(outputPath));
                    vscode.window.showInformationMessage("\u7F16\u8BD1JS\u6210\u529F!");
                }
                catch (error) {
                    vscode.window.showErrorMessage("\u7F16\u8BD1JS\u5931\u8D25: " + error);
                }
                return [3 /*break*/, 14];
            case 9:
                src(path)
                    .pipe(less())
                    .pipe(dest(outputPath));
                src(path)
                    .pipe(less())
                    .pipe(cssmin({ compatibility: 'ie7' }))
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(dest(outputPath));
                return [3 /*break*/, 14];
            case 10:
                src(path)
                    .pipe(ts())
                    .pipe(dest(outputPath));
                return [3 /*break*/, 14];
            case 11:
                src(path)
                    .pipe(ts({
                    jsx: 'react'
                }))
                    .pipe(dest(outputPath));
                return [3 /*break*/, 14];
            case 12:
                src(path)
                    .pipe(jade())
                    .pipe(dest(outputPath));
                return [3 /*break*/, 14];
            case 13:
                console.log('没找到对应的文件');
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
function activate(context) {
    console.log('Congratulations, your extension "qf" is now active!');
    var disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World!');
    });
    var openInBrowser = vscode.commands.registerCommand('extension.openInBrowser', function (path) {
        var uri = path.fsPath;
        open(uri, { app: ['google chrome'] });
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(openInBrowser);
    vscode.workspace.onDidSaveTextDocument(function (document) {
        var fileName = document.fileName;
        var fileContext = readFileContext(fileName);
        readFileName(fileName, fileContext);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
