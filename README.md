<a href="https://github.com/Wscats/compile-hero"><img src="https://img.shields.io/badge/Github Page-Wscats-yellow" alt="Github Page" /></a>
<a href="https://github.com/Wscats"><img src="https://img.shields.io/badge/Author-Eno Yao-blueviolet" alt="Eno Yao" /></a>
![badge version](https://vsmarketplacebadge.apphb.com/version-short/wscats.eno.svg?color=blue&style=flat-square)
![badge install](https://vsmarketplacebadge.apphb.com/installs-short/wscats.eno.svg?color=brightgreen&style=flat-square)

[English](https://github.com/Wscats/compile-hero/blob/master/README.md) | [中文](https://gitee.com/wscats/compile-hero/blob/master/README.CN.md)

# Features

<!-- Easily work with `less, sass, scss, stylus, typescript, jade, pug and jsx` files in Visual Studio Code. -->

> 1.Open the `less, sass, scss, styl, ts, tsx, jade, pug or js` file.

> 2.`Compile Hero: On/Off` will appear in the status bar at the bottom right corner, please turn on the `Compile Hero: On` switch when using ↓

<!-- ![9](https://user-images.githubusercontent.com/17243165/100497845-f3341980-3198-11eb-83bc-c551e17b0b84.png) -->

![11](https://user-images.githubusercontent.com/17243165/103136646-1cdf5280-46fd-11eb-94a3-f78534835427.png)

> 3.Compile on save `(ctrl+s)` ↓

Or select `Compile Files` on right-click menu item, it will automatically compile the files to the `dist` directory.

<!-- for `less, sass, scss, stylus, typescript, jade, pug and jsx` files without using a build task. -->

![1](https://user-images.githubusercontent.com/17243165/100497832-e1eb0d00-3198-11eb-967e-78d6736e5b6e.gif)
![3](https://user-images.githubusercontent.com/17243165/100497822-d7307800-3198-11eb-9a06-7b96c0862767.gif)

You can also select part of the code and use the `Compile Selected` menu item or shortcut key `(ctrl+shift+s)` to perform partial compilation of the code block.

![10](https://user-images.githubusercontent.com/17243165/100497811-c253e480-3198-11eb-894d-e0b28d84905a.gif)

> 4.Beautify on save `(alt+shift+f)` or select `Format Document` on right-click menu item for `javascript, json, css, sass and html`.

![8](https://user-images.githubusercontent.com/17243165/100497793-ae0fe780-3198-11eb-8b69-9c621a0cc9c6.gif)

- Compile `less, sass, scss, stylus, typescript, typescriptreact, jade, pug and javascript` on save.
- Support autoprefixer for `less, scss, scss`.
- Support to open `html` files to preview in browser.
- minify `javascript` and `css` files.
- Beautify `javascript`, `json`, `css`, `sass`, and `html`.

| Before Compile | After Compile |
| -------------- | ------------- |
| .pug           | .html         |
| .jade          | .html         |
| .scss(sass)    | .css          |
| .less          | .css          |
| .styl          | .css          |
| .ts/.tsx       | .js(JSX)      |
| .js(ES6)       | .js(ES5)      |

Easy to use. When you writing a file, press save `ctrl+s` to generate the compiled file in the same directory. I hope you can get rid of the constraint of `gulp` or `webpack`😁

# Extension Settings

Click to open the extension management interface `Configure Extension Settings`.

![5](https://user-images.githubusercontent.com/17243165/100497777-92a4dc80-3198-11eb-86cf-e2dda4b4967f.gif)

- You can change the output path of the project compilation directory.
- Toggle the compile switch of different language.
- Or disable automatic compilation on save `(ctrl+s)`.

| Whether the configuration is automatically compiled after saving`(ctrl+s)` | Default Value |
| -------------------------------------------------------------------------- | ------------- |
| disable-compile-files-on-did-save-code                                     | false         |

![7](https://user-images.githubusercontent.com/17243165/100497765-81f46680-3198-11eb-9597-bbcdc1e7726e.gif)

| Switch to control the notification | Default Value |
| ---------------------------------- | ------------- |
| notification-toggle                | true          |

| Switch to control compilation and formatting of specific files | Default Value |
| -------------------------------------------------------------- | ------------- |
| ignore                                                         | null          |

| Output Path Configuration    | Default Value | Compile Switch Status             | Default Value |
| ---------------------------- | ------------- | --------------------------------- | ------------- |
| javascript-output-directory  | ./dist        | javascript-output-toggle          | true          |
| sass-output-directory        | ./dist        | sass-output-toggle                | true          |
| scss-output-directory        | ./dist        | scss-output-toggle                | true          |
| less-output-directory        | ./dist        | less-output-toggle                | true          |
| jade-output-directory        | ./dist        | jade-output-toggle                | true          |
| typescript-output-directory  | ./dist        | typescript-output-toggle          | true          |
| typescriptx-output-directory | ./dist        | typescriptx-output-toggle         | true          |
| pug-output-directory         | ./dist        | pug-output-toggle                 | true          |
| stylus-output-directory      | ./dist        | stylus-output-toggle              | true          |
| generate-minified-html       | false         | generate-minified-html-only       | false         |
| generate-minified-css        | false         | generate-minified-css-only        | false         |
| generate-minified-javascript | false         | generate-minified-javascript-only | false         |

## Using `settings.json`

Advanced Extension Settings:

- Project-wide settings are configured using the standard `settings.json` file (i.e. Workspace Settings).
- `settings.json` must exist in the .vscode directory at the root level of your project.
- Alternatively, settings can go in User Settings for global defaults.
- Use the `compile-hero` key.
- Prohibit partial compilation and formatting of specific files `compile-hero.ignore`.
- Use `compile-hero.watch` to monitor partial files - You can turn this on -> `Compile Hero: On` when using.

Here Example `settings.json` file:

```json
{
  "compile-hero": {
    "disable-compile-files-on-did-save-code": false,
    "notification-toggle": false,
    "javascript-output-directory": "./out",
    "javascript-output-toggle": false,
    "sass-output-directory": "./out",
    "sass-output-toggle": true,
    "ignore": ["src/test.js", "*/test.scss", "**/spec/*", "**/src/**/*"],
    "watch": ["sass/test.sass", "**/less/**/*"]
  }
}
```

## Using `tsconfig.json`

If you want to add or overwrite certain settings in the `tsconfig.json` file, you can create a new `tsconfig.json` in the same directory of your `.ts` file.

Here Example `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "alwaysStrict": true,
    "importHelpers": false
  }
}
```

# Open In Browser

Right click the `html` file in the directory menu, and the `open in browser` option will appear. You can preview the page in the browser.

![2](https://user-images.githubusercontent.com/17243165/100497736-596c6c80-3198-11eb-8bac-3006d381b7a2.gif)

# Compile File Menu Item

Sometimes you may not need to automatically compile the file every time you save the file, at this time you can disable the automatic compilation. And use the `Compile File(s)` menu item to replace.

![6](https://user-images.githubusercontent.com/17243165/100497686-1611fe00-3198-11eb-9b9c-9142901ac2dc.gif)

# Close Port Command(MAC)

At some point, you may be using ports for some services. You can use the `Close Port` command to close, but now only supported on mac.

![4](https://user-images.githubusercontent.com/17243165/100497713-422d7f00-3198-11eb-8e63-53573a71e62b.gif)

# Simple template for development
Description|Screenshot
-|-
1\. Let's create a variant of the project structure.<br>_App - our root directory.<br>Build - files after compilation.<br>Dev - files before compilation (our working files).<br>Resources - application resources (images, etc.)_|![Template_01](https://user-images.githubusercontent.com/5076458/103905709-03cc9d80-5110-11eb-9ca6-93484ae2629f.jpg)
2\. Let's create structures and several files in the Dev folder to work on.|![Template_02](https://user-images.githubusercontent.com/5076458/103905711-04653400-5110-11eb-8578-f6b9c4347ff5.jpg)
3\. Let's clear **all** the default settings for specifying the output directories of our compiled files.|![Template_03](https://user-images.githubusercontent.com/5076458/103905720-062ef780-5110-11eb-9bc3-d91a92dee284.jpg)
4\. Now let's set up the directory of our compiled files (just in the file path, the _\Dev_ directory will be replaced with _\Build_ to write the compiled file).|![Template_04](https://user-images.githubusercontent.com/5076458/103905723-06c78e00-5110-11eb-9098-0acea6b53b7d.jpg)
5\. We are working on our project. When saving files, their compiled version will automatically appear in our _\Build_ directory for compiled versions, while maintaining the specified folder structure.|![Template_05](https://user-images.githubusercontent.com/5076458/103905724-07602480-5110-11eb-8c40-6dde74ae99c9.jpg)
6\. We can also configure the receipt of the minified version of our files (the _\Mini_ folder in this case), and, if necessary, the suffix in the name of the minified version (in this case _.mini_)|![Template_06](https://user-images.githubusercontent.com/5076458/103905727-0929e800-5110-11eb-88d5-21857a515c88.jpg)
7\. Also have to make settings to get minified version of files.|![Template_07](https://user-images.githubusercontent.com/5076458/103905736-0a5b1500-5110-11eb-8186-c04e061c0278.jpg)
8\. As a result, our project will look like this.|![Template_08](https://user-images.githubusercontent.com/5076458/103905743-0af3ab80-5110-11eb-81fa-d0a2b569d14c.jpg)
9\. Alternatively, if we are not interested in the intermediate compilation result, but only in the source code and its compiled already minified version, we can easily configure this by enabling obtaining only the minified version of our files (with _\Mini_, but without _\Build_).|![Template_09](https://user-images.githubusercontent.com/5076458/103905747-0b8c4200-5110-11eb-958d-bd10dabf390a.jpg)

After development, we can upload the _\Build_ (or _\Mini_) folder with the _\Resources_ folder to the server 😎

# Thanks

<!-- <details><summary><b>Tencent Alloyteam Team && Qian Feng Team</b></summary> -->

👪 Tencent Alloyteam Team And Qian Feng Team：

| [<img src="https://avatars1.githubusercontent.com/u/17243165?s=460&v=4" width="60px;"/><br /><sub>Eno Yao</sub>](https://github.com/Wscats) | [<img src="https://avatars2.githubusercontent.com/u/5805270?s=460&v=4" width="60px;"/><br /><sub>Aaron Xie</sub>](https://github.com/aaron-xie) | [<img src="https://avatars3.githubusercontent.com/u/12515367?s=460&v=4" width="60px;"/><br /><sub>DK Lan</sub>](https://github.com/dk-lan) | [<img src="https://avatars1.githubusercontent.com/u/30917929?s=460&v=4" width="60px;"/><br /><sub>Yong</sub>](https://github.com/flowerField) | [<img src="https://avatars3.githubusercontent.com/u/33544236?s=460&v=4" width="60px;"/><br /><sub>Li Ting</sub>](https://github.com/Liting1) | <img src="https://avatars2.githubusercontent.com/u/50255537?s=400&u=cfd51a5f46862d14e92e032a5b7ec073b67a904b&v=4" width="60px;"/><br /><sub>Xin</sub> | [<img src="https://avatars0.githubusercontent.com/u/39754159?s=400&v=4" width="60px;"/><br /><sub>Lemon</sub>](https://github.com/lemonyyye) | [<img src="https://avatars3.githubusercontent.com/u/31915459?s=400&u=11ea9bc9baa62784208a29dddcd0a77789e9620f&v=4" width="60px;"/><br /><sub>Jing</sub>](https://github.com/vickySC) | [<img src="https://avatars2.githubusercontent.com/u/24653988?s=400&u=76227871dea8d4b57162093fde63b7d52910145d&v=4" width="60px;"/><br /><sub>Lin</sub>](https://github.com/shirley3790) | [<img src="https://avatars2.githubusercontent.com/u/23230108?s=460&v=4" width="60px;"/><br /><sub>Tian Fly</sub>](https://github.com/tiantengfly) |
| - | - | - | - | - | - | - | - | - | - |

<!-- If you enjoy front end, you should have it! Xie, Yao, Yong, Ting, Jing, Lin, Tian, Xin, Xia, DK and Lemon, thanks to my team for their efforts ~ Waiting for you in our heart！ -->

<!-- </details> -->

If you think it's useful, hope you can leave us a [message and like it](https://marketplace.visualstudio.com/items?itemName=Wscats.eno&ssr=false#review-details)💝, your support is our driving force😀

<!-- # Inspired By -->

<!-- I will translate some previous articles one after another in the future, you can read it if you are interested: -->

<!-- <details><summary><b>I will translate some previous articles one after another in the future, you can read it if you are interested.</b></summary>

- [How do I use the simplest front end technology to reveal the principles behind those gray industries](https://github.com/Wscats/articles/issues/91)
- [How do I use front-end technology to get the VIP of XXOO website](https://github.com/Wscats/articles/issues/62)
- [How do I realize the WeChat mini game jump one jump plugin](https://github.com/Wscats/wechat-jump-game)
- ...
</details> -->

# License

Compile Hero is released under the [MIT](http://opensource.org/licenses/MIT).

<!-- ![badge rate](https://vsmarketplacebadge.apphb.com/rating-short/wscats.eno.svg?color=red&style=flat-square) -->
<!-- ![badge download](https://vsmarketplacebadge.apphb.com/downloads-short/wscats.eno.svg?color=orange&style=flat-square) -->
<!-- <a href="https://marketplace.visualstudio.com/items?itemName=Wscats.eno"><img src="https://img.shields.io/badge/Macketplace-v2.00-brightgreen" alt="Macketplace" /></a> -->
<!-- <a href="https://marketplace.visualstudio.com/items?itemName=Wscats.eno"><img src="https://img.shields.io/badge/Download-3M+-orange" alt="Download" /></a> -->
