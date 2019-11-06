import * as vscode from 'vscode';
import * as fs from 'fs';
const {
	compileSass,
	sass
} = require('./sass/index');

const readFileContext = (path: string) => {
	return fs.readFileSync(path).toString();
}
const fileType = (filename: string) => {
	const index1 = filename.lastIndexOf(".");
	const index2 = filename.length;
	const type = filename.substring(index1, index2);
	return type;
}
const handleFilePath = (path: string, length: number) => {
	return path = path.substring(0, path.length - length);
}
const writeScssFileContext = (path: string, data: string, isExpanded: boolean) => {
	path = handleFilePath(path, 5);
	fs.writeFile(isExpanded ? `${path}.css` : `${path}.min.css`, data, () => {
		vscode.window.showInformationMessage(`编译SCSS成功!`);
	});
}
const readFileName = async (path: string, fileContext: string) => {
	let fileSuffix = fileType(path);
	// console.log(fileSuffix, fileContext)
	switch (fileSuffix) {
		case '.scss':
			try {
				let { text } = await compileSass(fileContext, {
					style: sass.style.expanded,
				});
				writeScssFileContext(path, text, true);
			} catch (error) {
				vscode.window.showErrorMessage(`编译SCSS失败: ${error}`);
			}
			try {
				let { text } = await compileSass(fileContext, {
					style: sass.style.compressed,
				});
				writeScssFileContext(path, text, false);
			} catch (error) {
				vscode.window.showErrorMessage(`编译SCSS失败: ${error}`);
			}
			break;
		default:
			console.log('没找到对应的文件');
			break;
	}
}
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "qf" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});
	context.subscriptions.push(disposable);
	vscode.workspace.onDidSaveTextDocument((document) => {
		const {
			fileName
		} = document
		const fileContext: string = readFileContext(fileName);
		readFileName(fileName, fileContext);
	});
}
export function deactivate() { }
