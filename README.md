<a href="https://marketplace.visualstudio.com/items?itemName=Wscats.eno"><img src="https://img.shields.io/badge/Download-3M+-orange" alt="Download" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=Wscats.eno"><img src="https://img.shields.io/badge/Macketplace-v2.00-brightgreen" alt="Macketplace" /></a>
<a href="https://github.com/Wscats/compile-hero"><img src="https://img.shields.io/badge/Github Page-Wscats-yellow" alt="Github Page" /></a>
<a href="https://github.com/Wscats"><img src="https://img.shields.io/badge/Author-Eno Yao-blueviolet" alt="Eno Yao" /></a>
<a href="https://github.com/Wscats"><img src="https://api.netlify.com/api/v1/badges/b652768b-1673-42cd-98dd-3fd807b2ebca/deploy-status" alt="Status" /></a>

<!-- [English](https://github.com/Wscats/compile-hero/blob/master/README.md) | [中文](https://github.com/Wscats/compile-hero/blob/master/README.CN.md) -->

# Features

Easily work with `less, sass, scss, typescript, jade, pug and jsx` files in Visual Studio Code.

Compile on save `(ctrl+s)` or select `Compile File(s)` on right-click menu item for `less, sass, scss, typescript, jade, pug and jsx` files without using a build task.

<img src="https://wscats.github.io/compile-hero/screenshots/1.gif" />

<br/>

<img src="https://wscats.github.io/compile-hero/screenshots/3.gif" />

<br/>

- Compile `less, sass, scss, typescript, jade, pug and jsx` on save.
- Support autoprefixer for `less, scss, scss`.
- Support to open `html` files to preview in browser.
- minify `.js` and `.css` files.

| Before Compile | After Compile |
| -------------- | ------------- |
| .pug           | .html         |
| .jade          | .html         |
| .scss(sass)    | .css          |
| .less          | .css          |
| .ts/.tsx       | .js(JSX)      |
| .js(ES6)       | .js(ES5)      |

Easy to use. When you writing a file, press save `ctrl+s` to generate the compiled file in the same directory. I hope you can get rid of the constraint of `gulp` or `webpack`😁

# Extension Settings

Click to open the extension management interface `Configure Extension Settings`.

- You can change the output path of the project compilation directory.
- Toggle the compile switch of different language.
- Or disable automatic compilation on save `(ctrl+s)`.

| Whether the configuration is automatically compiled after saving`(ctrl+s)` | Default Value |
| -------------------------------------------------------------------------- | ------------- |
| disable-compile-files-on-did-save-code                                     | false         |

| Output Path Configuration    | Default Value | Compile Switch Status     | Default Value |
| ---------------------------- | ------------- | ------------------------- | ------------- |
| javascript-output-directory  | ./dist        | javascript-output-toggle  | true          |
| sass-output-directory        | ./dist        | sass-output-toggle        | true          |
| scss-output-directory        | ./dist        | scss-output-toggle        | true          |
| less-output-directory        | ./dist        | less-output-toggle        | true          |
| jade-output-directory        | ./dist        | jade-output-toggle        | true          |
| typescript-output-directory  | ./dist        | typescript-output-toggle  | true          |
| typescriptx-output-directory | ./dist        | typescriptx-output-toggle | true          |
| pug-output-directory         | ./dist        | pug-output-toggle         | true          |
| generate-minified-html       | false         |
| generate-minified-css        | false         |
| generate-minified-javascript | false         |

<br>
<img src="https://wscats.github.io/compile-hero/screenshots/5.gif" />

Advanced Extension Settings:

- Project-wide settings are configured using the standard `settings.json` file (i.e. Workspace Settings).
- `settings.json` must exist in the .vscode directory at the root level of your project.
- Alternatively, settings can go in User Settings for global defaults.
- Use the `compile-hero` key.

Here Example settings.json file:

```json
{
  "compile-hero": {
    "disable-compile-files-on-did-save-code": false,
    "javascript-output-directory": "./out",
    "javascript-output-toggle": false,
    "sass-output-directory": "./out",
    "sass-output-toggle": true
  }
}
```

# Open In Browser

Right click the `html` file in the directory menu, and the `open in browser` option will appear. You can preview the page in the browser.

<img src="https://wscats.github.io/compile-hero/screenshots/2.gif" />

# Compile File Menu Item

Sometimes you may not need to automatically compile the file every time you save the file, at this time you can disable the automatic compilation. And use the `Compile File(s)` menu item to replace.

<img src="https://wscats.github.io/compile-hero/screenshots/6.gif" />

# Close Port Command(MAC)

At some point, you may be using ports for some services. You can use the `Close Port` command to close, but now only supported on mac.

<img src="https://wscats.github.io/compile-hero/screenshots/4.gif" />

# Thanks

| [<img src="https://avatars1.githubusercontent.com/u/17243165?s=460&v=4" width="60px;"/><br /><sub>Eno Yao</sub>](https://github.com/Wscats) | [<img src="https://avatars2.githubusercontent.com/u/5805270?s=460&v=4" width="60px;"/><br /><sub>Aaron Xie</sub>](https://github.com/aaron-xie) | [<img src="https://avatars3.githubusercontent.com/u/12515367?s=460&v=4" width="60px;"/><br /><sub>DK Lan</sub>](https://github.com/dk-lan) | [<img src="https://avatars1.githubusercontent.com/u/30917929?s=460&v=4" width="60px;"/><br /><sub>Yong</sub>](https://github.com/flowerField) | [<img src="https://avatars3.githubusercontent.com/u/33544236?s=460&v=4" width="60px;"/><br /><sub>Li Ting</sub>](https://github.com/Liting1) | <img src="https://wscats.github.io/omi-snippets/images/xin.jpg" width="60px;"/><br /><sub>Xin</sub> | [<img src="https://wscats.github.io/omi-snippets/images/lemon.jpg" width="60px;"/><br /><sub>Lemon</sub>](https://github.com/lemonyyye) | [<img src="https://wscats.github.io/omi-snippets/images/jing.jpg" width="60px;"/><br /><sub>Jing</sub>](https://github.com/vickySC) | [<img src="https://wscats.github.io/omi-snippets/images/lin.jpg" width="60px;"/><br /><sub>Lin</sub>](https://github.com/shirley3790) | [<img src="https://avatars2.githubusercontent.com/u/23230108?s=460&v=4" width="60px;"/><br /><sub>Tian Fly</sub>](https://github.com/tiantengfly) |
| - | - | - | - | - | - | - | - | - | - |


If you enjoy front end, you should have it! xie, yao, yong, ting, jing, lin, tian, xin, xia, dk and lemon ~ Waiting for you in our heart！

If you think it's useful, you can leave us a [message and like it](https://marketplace.visualstudio.com/items?itemName=Wscats.qf&ssr=false#review-details), Your support is our driving force😀

# License

Compile Hero is released under the [MIT](http://opensource.org/licenses/MIT).
