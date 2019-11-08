const path = require('path');
module.exports = {
    mode: 'production',
    // mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    // module: {
    //     rules: [{
    //         test: /\.js$/,
    //         exclude: /(node_modules|bower_components)/,
    //         use: {
    //             loader: 'babel-loader',
    //             options: {
    //                 presets: ['@babel/preset-env']
    //             }
    //         }
    //     }]
    // }
};