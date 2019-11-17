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
var child_process_1 = require("child_process");
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
var through = require('through2');
var readFileContext = function (path) {
    return fs.readFileSync(path).toString();
};
var fileType = function (filename) {
    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    var type = filename.substring(index1, index2);
    return type;
};
var command = function (cmd) {
    return new Promise(function (resolve, reject) {
        child_process_1.exec(cmd, function (err, stdout, stderr) {
            resolve(stdout);
        });
    });
};
var transformPort = function (data) {
    var port = '';
    data.split(/[\n|\r]/).forEach(function (item) {
        if (item.indexOf('LISTEN') !== -1 && !port) {
            var reg = item.split(/\s+/);
            if (/\d+/.test(reg[1])) {
                port = reg[1];
            }
        }
    });
    return port;
};
var empty = function (code) {
    var stream = through.obj(function (file, encoding, callback) {
        if (!file.isBuffer()) {
            return callback();
        }
        file.contents = Buffer.from(code || '');
        stream.push(file);
        callback();
    });
    return stream;
};
var readFileName = function (path, fileContext) { return __awaiter(void 0, void 0, void 0, function () {
    var fileSuffix, config, outputDirectoryPath, compileStatus, outputPath, _a, text;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fileSuffix = fileType(path);
                config = vscode.workspace.getConfiguration("compile-hero");
                outputDirectoryPath = {
                    '.js': config.get('javascript-output-directory') || '',
                    '.scss': config.get('sass-output-directory') || '',
                    '.sass': config.get('sass-output-directory') || '',
                    '.less': config.get('less-output-directory') || '',
                    '.jade': config.get('jade-output-directory') || '',
                    '.ts': config.get('typescript-output-directory') || '',
                    '.tsx': config.get('typescriptx-output-directory') || ''
                };
                compileStatus = {
                    '.js': config.get('javascript-output-toggle'),
                    '.scss': config.get('sass-output-toggle'),
                    '.sass': config.get('sass-output-toggle'),
                    '.less': config.get('less-output-toggle'),
                    '.jade': config.get('jade-output-toggle'),
                    '.ts': config.get('typescript-output-toggle'),
                    '.tsx': config.get('typescriptx-output-toggle')
                };
                if (!compileStatus[fileSuffix])
                    return [2 /*return*/];
                outputPath = p.resolve(path, '../', outputDirectoryPath[fileSuffix]);
                _a = fileSuffix;
                switch (_a) {
                    case '.scss': return [3 /*break*/, 1];
                    case '.sass': return [3 /*break*/, 1];
                    case '.js': return [3 /*break*/, 3];
                    case '.less': return [3 /*break*/, 4];
                    case '.ts': return [3 /*break*/, 5];
                    case '.tsx': return [3 /*break*/, 6];
                    case '.jade': return [3 /*break*/, 7];
                }
                return [3 /*break*/, 8];
            case 1: return [4 /*yield*/, compileSass(fileContext, {
                    style: sass.style.expanded || sass.style.compressed
                })];
            case 2:
                text = (_b.sent()).text;
                src(path)
                    .pipe(empty(text))
                    .pipe(rename({
                    extname: ".css"
                }))
                    .pipe(dest(outputPath))
                    .pipe(cssmin({ compatibility: 'ie7' }))
                    .pipe(rename({
                    extname: ".css",
                    suffix: '.min'
                }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage("Compile successfully!");
                return [3 /*break*/, 9];
            case 3:
                if (/.dev.js|.prod.js$/g.test(path)) {
                    vscode.window.setStatusBarMessage("The prod or dev file has been processed and will not be compiled");
                    return [3 /*break*/, 9];
                }
                src(path)
                    .pipe(babel({
                    presets: [babelEnv]
                }))
                    .pipe(rename({ suffix: '.dev' }))
                    .pipe(dest(outputPath));
                src(path)
                    .pipe(babel({
                    presets: [babelEnv]
                }))
                    .pipe(uglify())
                    .pipe(rename({ suffix: '.prod' }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage("Compile successfully!");
                return [3 /*break*/, 9];
            case 4:
                src(path)
                    .pipe(less())
                    .pipe(dest(outputPath))
                    .pipe(cssmin({ compatibility: 'ie7' }))
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage("Compile successfully!");
                return [3 /*break*/, 9];
            case 5:
                src(path)
                    .pipe(ts())
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage("Compile successfully!");
                return [3 /*break*/, 9];
            case 6:
                src(path)
                    .pipe(ts({
                    jsx: 'react'
                }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage("Compile successfully!");
                return [3 /*break*/, 9];
            case 7:
                src(path)
                    .pipe(jade({
                    pretty: true
                }))
                    .pipe(dest(outputPath));
                src(path)
                    .pipe(jade())
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage("Compile successfully!");
                return [3 /*break*/, 9];
            case 8:
                console.log('Not Found!');
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
function activate(context) {
    var _this = this;
    console.log('Congratulations, your extension "qf" is now active!');
    var openInBrowser = vscode.commands.registerCommand('extension.openInBrowser', function (path) {
        var uri = path.fsPath;
        var platform = process.platform;
        open(uri, {
            app: [platform === 'win32' ? 'chrome' : (platform === 'darwin'
                    ? 'google chrome'
                    : 'google-chrome')]
        });
    });
    var closePort = vscode.commands.registerCommand('extension.closePort', function () { return __awaiter(_this, void 0, void 0, function () {
        var inputPort, info, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.window.showInputBox({ placeHolder: 'Enter the port you need to close?' })];
                case 1:
                    inputPort = _a.sent();
                    return [4 /*yield*/, command("lsof -i :" + inputPort)];
                case 2:
                    info = _a.sent();
                    port = transformPort(info);
                    if (!port) return [3 /*break*/, 4];
                    return [4 /*yield*/, command("kill -9 " + port)];
                case 3:
                    _a.sent();
                    vscode.window.setStatusBarMessage('Port closed successfully!');
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    var makeRequest = vscode.commands.registerCommand('extension.makeRequest', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // let url = await vscode.window.showInputBox({ placeHolder: 'Enter the url you need to request?' });
            require('http').get('http://www.umei.cc/p/gaoqing/cn/', function (res) {
                var rawData = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) { rawData += chunk; });
                res.on('end', function () {
                    // fs.writeFileSync(`${path}.html`,rawData)
                    console.log(rawData);
                });
            });
            return [2 /*return*/];
        });
    }); });
    context.subscriptions.push(openInBrowser);
    context.subscriptions.push(closePort);
    context.subscriptions.push(makeRequest);
    vscode.workspace.onDidSaveTextDocument(function (document) {
        var fileName = document.fileName;
        var fileContext = readFileContext(fileName);
        readFileName(fileName, fileContext);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
