import * as vscode from "vscode";
const sass = require("./sass.sync.js");
interface Result {
  // status 0 means everything is ok,
  // any other value means an error occurred
  status: number;
  text: string;
  map: object;
  files: [];
  // error information:
  line: number;
  column: number;
  message: string;
  formatted: string;
}
const compileSass = (data: string, option: Object) => {
  return new Promise((resolve, reject) => {
    sass.compile(
      data,
      {
        ...option,
        // style: sass.style.compressed,
        // style: sass.style.compact,
        // style: sass.style.expanded,
        // style: sass.style.nested,
      },
      (result: Result) => {
        // console.log(result);
        if (result.status !== 0) {
          vscode.window.showErrorMessage(result.message, ...[result.formatted]);
        }
        resolve(result);
      }
    );
  });
};
module.exports = {
  compileSass,
  sass,
};
