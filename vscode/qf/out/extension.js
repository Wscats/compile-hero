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
const { compileSass, sass } = require('./sass/index');
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
const writeScssFileContext = (path, data) => {
    path = handleFilePath(path, 5);
    // console.log(`${path}.css`,)
    fs.writeFile(`${path}.css`, data, () => {
        vscode.window.showInformationMessage(`编译SCSS成功!`);
    });
};
const readFileName = (path, fileContext) => __awaiter(void 0, void 0, void 0, function* () {
    let fileSuffix = fileType(path);
    console.log(fileSuffix, fileContext);
    switch (fileSuffix) {
        case '.scss':
            try {
                let { text } = yield compileSass(fileContext, {
                    style: sass.style.expanded,
                });
                writeScssFileContext(path, text);
            }
            catch (error) {
                vscode.window.showErrorMessage(`编译SCSS失败: ${error}`);
            }
            try {
                let { text } = yield compileSass(fileContext, {
                    style: sass.style.compressed,
                });
                writeScssFileContext(`${path}.min`, text);
            }
            catch (error) {
                vscode.window.showErrorMessage(`编译SCSS失败: ${error}`);
            }
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
    context.subscriptions.push(disposable);
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