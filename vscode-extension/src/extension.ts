import * as vscode from 'vscode';
import * as fs from 'fs';
import * as p from 'path';
import { exec } from 'child_process';
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
		vscode.window.showInformationMessage(`Compile failed`);
	});
}
const command = (cmd: string) => {
	return new Promise<string>((resolve, reject) => {
		exec(cmd, (err, stdout, stderr) => {
			resolve(stdout);
		})
	})
}
const transformPort = (data: string): string => {
	let port: string = '';
	data.split(/[\n|\r]/).forEach(item => {
		if (item.indexOf('LISTEN') !== -1 && !port) {
			let reg = item.split(/\s+/)
			if (/\d+/.test(reg[1])) {
				port = reg[1]
			}
		}
	})
	return port
}
const readFileName = async (path: string, fileContext: string) => {
	let fileSuffix = fileType(path);
	let outputPath = p.resolve(path, '../');
	console.log(path, fileSuffix, fileContext)
	switch (fileSuffix) {
		case '.scss':
		case '.sass':
			try {
				let { text } = await compileSass(fileContext, {
					style: sass.style.expanded,
				});
				writeScssFileContext(path, text, true);
			} catch (error) {
				vscode.window.showErrorMessage(`Compile failed: ${error}`);
			}
			try {
				let { text } = await compileSass(fileContext, {
					style: sass.style.compressed,
				});
				writeScssFileContext(path, text, false);
			} catch (error) {
				vscode.window.showErrorMessage(`Compile failed: ${error}`);
			}
			break;
		case '.js':
			if (/.dev.js|.prod.js$/g.test(path)) {
				vscode.window.showInformationMessage(`The prod or dev file has been processed and will not be compiled`);
				break;
			}
			try {
				src(path)
					.pipe(babel({
						presets: [babelEnv]
					}))
					.pipe(rename({ suffix: '.dev' }))
					.pipe(dest(outputPath));
				vscode.window.showInformationMessage(`Compile successfully!`);
			} catch (error) {
				vscode.window.showErrorMessage(`Compile failed: ${error}`);
			}
			try {
				src(path)
					.pipe(babel({
						presets: [babelEnv]
					}))
					.pipe(uglify())
					.pipe(rename({ suffix: '.prod' }))
					.pipe(dest(outputPath));
				vscode.window.showInformationMessage(`Compile successfully!`);
			} catch (error) {
				vscode.window.showErrorMessage(`Compile failed: ${error}`);
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
			vscode.window.showInformationMessage(`Compile successfully!`);
			break;
		case '.ts':
			src(path)
				.pipe(ts())
				.pipe(dest(outputPath));
			vscode.window.showInformationMessage(`Compile successfully!`);
			break;
		case '.tsx':
			src(path)
				.pipe(ts({
					jsx: 'react'
				}))
				.pipe(dest(outputPath));
			vscode.window.showInformationMessage(`Compile successfully!`);
			break;
		case '.jade':
			src(path)
				.pipe(jade())
				.pipe(dest(outputPath));
			vscode.window.showInformationMessage(`Compile successfully!`);
			break;
		default:
			console.log('Not Found!');
			break;
	}
}
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "qf" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});
	let openInBrowser = vscode.commands.registerCommand('extension.openInBrowser', (path) => {
		let uri = path.fsPath;
		let platform = process.platform;
		open(uri, {
			app: [platform === 'win32' ? 'chrome' : (
				platform === 'darwin'
					? 'google chrome'
					: 'google-chrome'
			)]
		});
	});
	let closePort = vscode.commands.registerCommand('extension.closePort', async (path) => {
		// const panel = vscode.window.createWebviewPanel(
		// 	'testWelcome', // viewType
		// 	"Welcome to Eno Snippets", // 视图标题
		// 	vscode.ViewColumn.One, // 显示在编辑器的哪个部位
		// 	{
		// 		enableScripts: true, // 启用JS，默认禁用
		// 		retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
		// 	}
		// );
		// panel.webview.html = `
		// 	<p>hello world</p>
		// 	<style>p{color:red}</style>
		// `
		let inputPort = await vscode.window.showInputBox({ placeHolder: 'Enter the port you need to close?' });
		let info = await command(`lsof -i :${inputPort}`);
		let port = transformPort(info);
		if (port) {
			await command(`kill -9 ${port}`);
			vscode.window.showInformationMessage('Port closed successfully!');
		}
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(openInBrowser);
	context.subscriptions.push(closePort);
	vscode.workspace.onDidSaveTextDocument((document) => {
		const {
			fileName
		} = document
		const fileContext: string = readFileContext(fileName);
		readFileName(fileName, fileContext);
	});

}
export function deactivate() { }
