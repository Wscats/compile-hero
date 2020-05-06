"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const sass = require("./sass.sync.js");
const compileSass = (data, option) => {
    return new Promise((resolve, reject) => {
        sass.compile(data, Object.assign({}, option), (result) => {
            // console.log(result);
            if (result.status !== 0) {
                vscode.window.showErrorMessage(result.message, ...[result.formatted]);
            }
            resolve(result);
        });
    });
};
module.exports = {
    compileSass,
    sass,
};
//# sourceMappingURL=index.js.map