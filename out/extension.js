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
const child_process_1 = require("child_process");
const { compileSass, sass } = require("./sass/index");
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const babelEnv = require("@babel/preset-env");
const less = require("gulp-less");
const cssmin = require("gulp-minify-css");
const ts = require("gulp-typescript");
const jade = require("gulp-jade");
const pug = require("pug");
const open = require("open");
const through = require("through2");
const readFileContext = (path) => {
    return fs.readFileSync(path).toString();
};
const fileType = (filename) => {
    const index1 = filename.lastIndexOf(".");
    const index2 = filename.length;
    const type = filename.substring(index1, index2);
    return type;
};
const command = (cmd) => {
    return new Promise((resolve, reject) => {
        child_process_1.exec(cmd, (err, stdout, stderr) => {
            resolve(stdout);
        });
    });
};
const transformPort = (data) => {
    let port = "";
    data.split(/[\n|\r]/).forEach((item) => {
        if (item.indexOf("LISTEN") !== -1 && !port) {
            let reg = item.split(/\s+/);
            if (/\d+/.test(reg[1])) {
                port = reg[1];
            }
        }
    });
    return port;
};
const empty = function (code) {
    let stream = through.obj((file, encoding, callback) => {
        if (!file.isBuffer()) {
            return callback();
        }
        file.contents = Buffer.from(code || "");
        stream.push(file);
        callback();
    });
    return stream;
};
const readFileName = (path, fileContext) => __awaiter(void 0, void 0, void 0, function* () {
    let fileSuffix = fileType(path);
    let config = vscode.workspace.getConfiguration("compile-hero");
    let outputDirectoryPath = {
        ".js": config.get("javascript-output-directory") || "",
        ".scss": config.get("scss-output-directory") || "",
        ".sass": config.get("sass-output-directory") || "",
        ".less": config.get("less-output-directory") || "",
        ".jade": config.get("jade-output-directory") || "",
        ".ts": config.get("typescript-output-directory") || "",
        ".tsx": config.get("typescriptx-output-directory") || "",
        ".pug": config.get("pug-output-directory") || "",
    };
    let compileStatus = {
        ".js": config.get("javascript-output-toggle"),
        ".scss": config.get("scss-output-toggle"),
        ".sass": config.get("sass-output-toggle"),
        ".less": config.get("less-output-toggle"),
        ".jade": config.get("jade-output-toggle"),
        ".ts": config.get("typescript-output-toggle"),
        ".tsx": config.get("typescriptx-output-toggle"),
        ".pug": config.get("pug-output-toggle"),
    };
    if (!compileStatus[fileSuffix])
        return;
    let outputPath = p.resolve(path, "../", outputDirectoryPath[fileSuffix]);
    try {
        switch (fileSuffix) {
            case ".scss":
            case ".sass":
                let { text, status } = yield compileSass(fileContext, {
                    style: sass.style.expanded || sass.style.compressed,
                });
                if (status !== 0) {
                    vscode.window.setStatusBarMessage(`Compile failed!`);
                    return;
                }
                src(path)
                    .pipe(empty(text))
                    .pipe(rename({
                    extname: ".css",
                }))
                    .pipe(dest(outputPath))
                    .pipe(cssmin({ compatibility: "ie7" }))
                    .pipe(rename({
                    extname: ".css",
                    suffix: ".min",
                }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage(`Compile successfully!`);
                break;
            case ".js":
                if (/.dev.js|.prod.js$/g.test(path)) {
                    vscode.window.setStatusBarMessage(`The prod or dev file has been processed and will not be compiled`);
                    break;
                }
                src(path)
                    .pipe(babel({
                    presets: [babelEnv],
                }))
                    .pipe(rename({ suffix: ".dev" }))
                    .pipe(dest(outputPath));
                src(path)
                    .pipe(babel({
                    presets: [babelEnv],
                }))
                    .pipe(uglify())
                    .pipe(rename({ suffix: ".prod" }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage(`Compile successfully!`);
                break;
            case ".less":
                src(path)
                    .pipe(less())
                    .pipe(dest(outputPath))
                    .pipe(cssmin({ compatibility: "ie7" }))
                    .pipe(rename({ suffix: ".min" }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage(`Compile successfully!`);
                break;
            case ".ts":
                src(path).pipe(ts()).pipe(dest(outputPath));
                vscode.window.setStatusBarMessage(`Compile successfully!`);
                break;
            case ".tsx":
                src(path)
                    .pipe(ts({
                    jsx: "react",
                }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage(`Compile successfully!`);
                break;
            case ".jade":
                src(path)
                    .pipe(jade({
                    pretty: true,
                }))
                    .pipe(dest(outputPath));
                src(path)
                    .pipe(jade())
                    .pipe(rename({ suffix: ".min" }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage(`Compile successfully!`);
                break;
            case ".pug":
                src(path)
                    .pipe(empty(pug.render(readFileContext(path), {
                    pretty: true,
                })))
                    .pipe(rename({
                    extname: ".html",
                }))
                    .pipe(dest(outputPath))
                    .pipe(empty(pug.render(readFileContext(path))))
                    .pipe(rename({
                    suffix: ".min",
                    extname: ".html",
                }))
                    .pipe(dest(outputPath));
                vscode.window.setStatusBarMessage(`Compile successfully!`);
                break;
            default:
                console.log("Not Found!");
                break;
        }
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error);
        vscode.window.setStatusBarMessage(`Compile failed!`);
    }
});
function activate(context) {
    console.log('Congratulations, your extension "qf" is now active!');
    let openInBrowser = vscode.commands.registerCommand("extension.openInBrowser", (path) => {
        let uri = path.fsPath;
        let platform = process.platform;
        open(uri, {
            app: [
                platform === "win32"
                    ? "chrome"
                    : platform === "darwin"
                        ? "google chrome"
                        : "google-chrome",
            ],
        });
    });
    let closePort = vscode.commands.registerCommand("extension.closePort", () => __awaiter(this, void 0, void 0, function* () {
        let inputPort = yield vscode.window.showInputBox({
            placeHolder: "Enter the port you need to close?",
        });
        let info = yield command(`lsof -i :${inputPort}`);
        let port = transformPort(info);
        if (port) {
            yield command(`kill -9 ${port}`);
            vscode.window.setStatusBarMessage("Port closed successfully!");
        }
    }));
    let compileFile = vscode.commands.registerCommand("extension.compileFile", (path) => {
        let uri = path.fsPath;
        console.log(uri);
        const fileContext = readFileContext(uri);
        readFileName(uri, fileContext);
    });
    context.subscriptions.push(openInBrowser);
    context.subscriptions.push(closePort);
    context.subscriptions.push(compileFile);
    vscode.workspace.onDidSaveTextDocument((document) => {
        let config = vscode.workspace.getConfiguration("compile-hero");
        let isDisableOnDidSaveTextDocument = config.get("disable-compile-files-on-did-save-code") || "";
        console.log(isDisableOnDidSaveTextDocument);
        if (isDisableOnDidSaveTextDocument)
            return;
        const { fileName } = document;
        const fileContext = readFileContext(fileName);
        readFileName(fileName, fileContext);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map