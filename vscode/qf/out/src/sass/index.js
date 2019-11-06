"use strict";
const sass = require('./sass.sync.js');
const compileSass = (data, option) => {
    return new Promise((resolve, reject) => {
        sass.compile(data, Object.assign({}, option), (result) => {
            // console.log(result)
            resolve(result);
        });
    });
};
module.exports = {
    compileSass,
    sass
};
//# sourceMappingURL=index.js.map