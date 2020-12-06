"use strict";
const { src, dest } = require("gulp");
const sass = require("sass");
try {
    const { css } = sass.renderSync({ file: fileName });
    const text = css.toString();
    src(fileName)
        .pipe(empty(text))
        .pipe(rename({
        extname: ".css",
    }))
        .pipe(dest(outputPath))
        .pipe(dest(outputPath));
    if (compileOptions.generateMinifiedCss) {
        src(fileName)
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
    }
    vscode.window.setStatusBarMessage(successMessage);
}
catch (error) {
    notificationStatus && vscode.window.showErrorMessage(error.message);
    vscode.window.setStatusBarMessage(errorMessage);
}
//# sourceMappingURL=compile.js.map