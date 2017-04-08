var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require("webpack");

module.exports = {
    entry: [
        './src/app.tsx'
    ],
    output: {
        path: __dirname + '/site',
        publicPath: '',
        filename: 'app.js'
    },
    target: 'web',
    module: {
        loaders: [
            {test: /\.tsx?/, loader: 'ts-loader'},
            {test: /\.less$/, loader: "style!css!less"}
        ]
    },
    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"],
        moduleDirectories: ['src', 'node_modules']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Chrometrol 2',
            filename: 'index.html'
        }),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            'window.chrome': 'chrome'
        })
    ]
};