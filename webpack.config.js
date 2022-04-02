const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: './src/js/main.js',
    output: {
        filename: 'index.bundle.js',
        path: __dirname + '/dist',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.html$/i,
                loader: "html-loader"
            }
        ],
    },
    plugins: [
        // fix tepm name
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html"
        }),
        new HtmlWebpackPlugin({
            filename: "athkarok.html",
            template: "./src/athkarok.html"
        }),
        new HtmlWebpackPlugin({
            filename: "settings.html",
            template: "./src/settings.html"
        }),
        new HtmlWebpackPlugin({
            filename: "signin.html",
            template: "./src/signin.html"
        }),
        new HtmlWebpackPlugin({
            filename: "signup.html",
            template: "./src/signup.html"
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ]
};