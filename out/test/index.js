"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const glob_1 = require("glob");
const Mocha = require("mocha");
const path = require("path");
function run() {
    const testDir = __dirname;
    const mocha = new Mocha({ ui: "tdd" });
    return new Promise((resolve, reject) => {
        glob_1.glob("**/*.test.js", { cwd: testDir }, (error, matches) => {
            if (error) {
                reject(error);
            }
            else {
                matches.forEach(file => mocha.addFile(path.resolve(testDir, file)));
                try {
                    mocha.run(failures => {
                        if (failures > 0) {
                            reject(new Error(`${failures} test${failures > 1 ? "s" : ""} failed.`));
                        }
                        else {
                            resolve();
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    });
}
exports.run = run;
//# sourceMappingURL=index.js.map