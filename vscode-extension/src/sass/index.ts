const sass = require('./sass.sync.js')
const compileSass = (data: string, option: Object) => {
    return new Promise((resolve, reject) => {
        sass.compile(data, {
            ...option,
            // style: sass.style.compressed,
            // style: sass.style.compact,
            // style: sass.style.expanded,
            // style: sass.style.nested,
        }, (result: string) => {
            // console.log(result)
            resolve(result)
        });
    })
}
module.exports = {
    compileSass,
    sass
}