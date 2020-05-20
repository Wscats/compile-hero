import * as vscode from "vscode";
import * as fs from "fs";
import * as p from "path";
import { exec } from "child_process";
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
const successMessage = "✔ Compilation Successed!";
const errorMessage = "❌ Compilation Failed!";
const readFileContext = (path: string): string => {
  return fs.readFileSync(path).toString();
};
const fileType = (filename: string) => {
  const index1 = filename.lastIndexOf(".");
  const index2 = filename.length;
  const type = filename.substring(index1, index2);
  return type;
};
const command = (cmd: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      resolve(stdout);
    });
  });
};
const transformPort = (data: string): string => {
  let port: string = "";
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
const empty = function (code: string) {
  let stream = through.obj((file: any, encoding: any, callback: any) => {
    if (!file.isBuffer()) {
      return callback();
    }
    file.contents = Buffer.from(code || "");
    stream.push(file);
    callback();
  });
  return stream;
};
const readFileName = async (path: string, fileContext: string) => {
  let fileSuffix = fileType(path);
  let config = vscode.workspace.getConfiguration("compile-hero");
  let outputDirectoryPath: any = {
    ".js": config.get<string>("javascript-output-directory") || "",
    ".scss": config.get<string>("scss-output-directory") || "",
    ".sass": config.get<string>("sass-output-directory") || "",
    ".less": config.get<string>("less-output-directory") || "",
    ".jade": config.get<string>("jade-output-directory") || "",
    ".ts": config.get<string>("typescript-output-directory") || "",
    ".tsx": config.get<string>("typescriptx-output-directory") || "",
    ".pug": config.get<string>("pug-output-directory") || "",
  };
  let compileStatus: any = {
    ".js": config.get<boolean>("javascript-output-toggle"),
    ".scss": config.get<boolean>("scss-output-toggle"),
    ".sass": config.get<boolean>("sass-output-toggle"),
    ".less": config.get<boolean>("less-output-toggle"),
    ".jade": config.get<boolean>("jade-output-toggle"),
    ".ts": config.get<boolean>("typescript-output-toggle"),
    ".tsx": config.get<boolean>("typescriptx-output-toggle"),
    ".pug": config.get<boolean>("pug-output-toggle"),
  };
  if (!compileStatus[fileSuffix]) return;
  let outputPath = p.resolve(path, "../", outputDirectoryPath[fileSuffix]);
  // console.log(fileSuffix);
  switch (fileSuffix) {
    case ".scss":
    case ".sass":
      let { text, status } = await compileSass(fileContext, {
        style: sass.style.expanded || sass.style.compressed,
        indentedSyntax: fileSuffix === ".sass" ? true : false,
      });
      if (status !== 0) {
        vscode.window.setStatusBarMessage(errorMessage);
        return;
      }
      src(path)
        .pipe(empty(text))
        .pipe(
          rename({
            extname: ".css",
          })
        )
        .pipe(dest(outputPath))
        .pipe(cssmin({ compatibility: "ie7" }))
        .pipe(
          rename({
            extname: ".css",
            suffix: ".min",
          })
        )
        .pipe(dest(outputPath));
      vscode.window.setStatusBarMessage(successMessage);
      break;
    case ".js":
      if (/.dev.js|.prod.js$/g.test(path)) {
        vscode.window.setStatusBarMessage(
          `The prod or dev file has been processed and will not be compiled`
        );
        break;
      }
      src(path)
        .pipe(
          babel({
            presets: [babelEnv],
          }).on("error", (error: any) => {
            vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(errorMessage);
          })
        )
        .pipe(rename({ suffix: ".dev" }))
        .pipe(dest(outputPath));
      src(path)
        .pipe(
          babel({
            presets: [babelEnv],
          }).on("error", (error: any) => {
            vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(errorMessage);
          })
        )
        .pipe(uglify())
        .pipe(rename({ suffix: ".prod" }))
        .pipe(dest(outputPath));
      vscode.window.setStatusBarMessage(successMessage);
      break;
    case ".less":
      src(path)
        .pipe(
          less().on("error", (error: any) => {
            vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(errorMessage);
          })
        )
        .pipe(dest(outputPath))
        .pipe(cssmin({ compatibility: "ie7" }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(outputPath))
        .on("end", () => {
          vscode.window.setStatusBarMessage(successMessage);
        });
      break;
    case ".ts":
      src(path)
        .pipe(
          ts().on("error", (error: any) => {
            vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(errorMessage);
          })
        )
        .pipe(dest(outputPath));
      vscode.window.setStatusBarMessage(successMessage);
      break;
    case ".tsx":
      src(path)
        .pipe(
          ts({
            jsx: "react",
          }).on("error", (error: any) => {
            vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(errorMessage);
          })
        )
        .pipe(dest(outputPath));
      vscode.window.setStatusBarMessage(successMessage);
      break;
    case ".jade":
      src(path)
        .pipe(
          jade({
            pretty: true,
          }).on("error", (error: any) => {
            console.log(error);
            vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(errorMessage);
          })
        )
        .pipe(dest(outputPath));
      src(path)
        .pipe(
          jade().on("error", (error: any) => {
            vscode.window.showErrorMessage(error.message);
            vscode.window.setStatusBarMessage(errorMessage);
          })
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(outputPath));
      vscode.window.setStatusBarMessage(successMessage);
      break;
    case ".pug":
      let html = "";
      try {
        html = pug.render(readFileContext(path), {
          pretty: true,
        });
      } catch (error) {
        vscode.window.showErrorMessage(error.message);
        vscode.window.setStatusBarMessage(errorMessage);
      }
      src(path)
        .pipe(empty(html))
        .pipe(
          rename({
            extname: ".html",
          })
        )
        .pipe(dest(outputPath))
        .pipe(empty(pug.render(readFileContext(path))))
        .pipe(
          rename({
            suffix: ".min",
            extname: ".html",
          })
        )
        .pipe(dest(outputPath));
      vscode.window.setStatusBarMessage(successMessage);
      break;
    default:
      console.log("Not Found!");
      break;
  }
};
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "qf" is now active!');
  let openInBrowser = vscode.commands.registerCommand(
    "extension.openInBrowser",
    (path) => {
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
    }
  );
  let closePort = vscode.commands.registerCommand(
    "extension.closePort",
    async () => {
      let inputPort = await vscode.window.showInputBox({
        placeHolder: "Enter the port you need to close?",
      });
      let info = await command(`lsof -i :${inputPort}`);
      let port = transformPort(info);
      if (port) {
        await command(`kill -9 ${port}`);
        vscode.window.setStatusBarMessage("Port closed successfully!");
      }
    }
  );

  let compileFile = vscode.commands.registerCommand(
    "extension.compileFile",
    (path) => {
      let uri = path.fsPath;
      console.log(uri);
      const fileContext: string = readFileContext(uri);
      readFileName(uri, fileContext);
    }
  );

  context.subscriptions.push(openInBrowser);
  context.subscriptions.push(closePort);
  context.subscriptions.push(compileFile);
  vscode.workspace.onDidSaveTextDocument((document) => {
    let config = vscode.workspace.getConfiguration("compile-hero");
    let isDisableOnDidSaveTextDocument =
      config.get<string>("disable-compile-files-on-did-save-code") || "";
    console.log(isDisableOnDidSaveTextDocument);
    if (isDisableOnDidSaveTextDocument) return;
    const { fileName } = document;
    const fileContext: string = readFileContext(fileName);
    readFileName(fileName, fileContext);
  });
}
export function deactivate() {}
