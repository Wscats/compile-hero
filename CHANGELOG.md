# Change Log

- 2017-05-12 Establish a private code repository and implement a simple compilation extension.
- 2017-12-13 Continuous optimization and improvement, only for internal commercial projects, and plan to open source.
- 2018-10-24 Start writing documents and tutorials, and adjust the code structure.
- 2019-11-03 Automatically evaluate documents and generate download links.
- 2019-11-04 Support compiling `scss` files.
- 2019-11-05 Support compiling `jade`, `typescript` and `less` files.
- 2019-11-06 Support `html` file opening in browser.
- 2019-11-07 Supports generation of `js` files in two modes of `development` and `production`.
- 2019-11-08 Support compiling `tsx` files.
- 2019-11-09 Add a variety of dynamic diagram demonstration.
- 2019-11-10 Change the style of the pop-up prompt.
- 2019-11-11 Add switch to control compilation.
- 2019-11-13 Add the function of closing the port.
- 2019-11-14 Add configure extension settings.
- 2019-11-15 Delete unused material files.
- 2019-11-21 Support compiling `jade` files.
- 2020-03-28 Add command `compileFile`.
- 2020-04-24 Add switch to control compilation.
- 2020-04-25 Add advanced extension settings - [Documentation on a per project config](https://github.com/Wscats/compile-hero/issues/6).
- 2020-05-05 Add `scss` files configure extension settings.
- 2020-05-06 Delete unused commands such as `makeRequest` - [Dubious makeRequest function](https://github.com/Wscats/compile-hero/issues/9).
- 2020-05-07 Increase `scss/sass/less` compilation error monitoring.
- 2020-05-08 Add Feature - [Feature: Output:❌Errors/ ✔Success](https://github.com/Wscats/compile-hero/issues/15).
- 2020-05-20 Fix indented syntax which it can treat code as `sass` (as opposed to `scss`) - [Bug: Using sass syntax doesn't work but scss works](https://github.com/Wscats/compile-hero/issues/17).
- 2020-05-23 Fix compilation failure due to relative path of pug - [Bug: Pug include tag not working](https://github.com/Wscats/compile-hero/issues/19).
- 2020-06-21 Add javascript, css, html minified options settings - [Feature: Minified options settings](https://github.com/Wscats/compile-hero/issues/13).
- 2020-06-27 Support to compile all files in the entire folder
- 2020-08-18 Fix compilation failure due to relative path of sass - [Bug: Do Sass partials (\_variables.scss) work](https://github.com/Wscats/compile-hero/issues/38).
- 2020-08-20 After the extension is successfully installed, it should work normally by default - [Fix: Press Ctrl+s and no css file is generated](https://github.com/Wscats/compile-hero/issues/36).
- 2020-08-23 Support to beautify `javascript`, `json`, `css`, `sass`, and `html`.
- 2020-08-29 Update detailed [Chinese documents](https://github.com/Wscats/compile-hero/blob/master/README.CN.md).
- 2020-08-30 Add or overwrite certain settings in the `tsconfig.json` file - [Feature: Hero does not seem to use all options of tsconfig.json](https://github.com/Wscats/compile-hero/issues/43).
- 2020-09-07 Typescript file is compiling successfully, but a notification appear on right bottom that says there's a compile error - [Bug: Typescript Compile Bug](https://github.com/Wscats/compile-hero/issues/55).
- 2020-09-11 Add a notification toggle option - [Feature: Pop up notification in bottom right corner should have toggle option](https://github.com/Wscats/compile-hero/issues/58).
- 2020-09-30 Support prohibiting partial compilation and formatting of specific files by `compile-hero.ignore` option - [Feature: How to ignore compile child \_xxx.scss files](https://github.com/Wscats/compile-hero/issues/56).
- 2020-11-24 Adjust the code directory structure and disassemble it into different loaders for maintenance.
- 2020-11-25 Support selected code block compilation for `jade`, `pug`, `scss` and `less`.
- 2020-11-26 Fix the problem that shortcut keys can’t be used normally, and improve the documentation.
- 2020-11-28 Fix when compiling `less`, `sass`, `jade` and `pug` files, `@import` syntax failed to find files - [Bug: @import syntax failed](https://github.com/Wscats/compile-hero/issues/80).
- 2020-11-29 Support the compilation of `stylus` and merge the `pug` and `jade` engines.

# Unreleased

- Support opening in browser and starting non security mode to solve cross domain problems.
- Support to start custom server and refresh page automatically.
- [Feature: Support autoprefixer for less, scss, scss](https://github.com/Wscats/compile-hero/issues/14).
