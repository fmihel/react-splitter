const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ServerConfig = require('./server/config');
const { PageReloadPlugin } = require('page-reload-webpack-plugin');

const SOURCE_PATH = './app/';
const PUBLIC_PATH = ServerConfig.public;
const TEMPLATE_PATH = './app/template/';
const MEDIA_PATH = './app/media/';

module.exports = {
    entry: `${SOURCE_PATH}index.js`,
    output: {
        path: path.resolve(__dirname, PUBLIC_PATH),
        filename: '[name].[contenthash].js',
    },
    resolve: {
        alias: {
            Com: path.resolve(__dirname, 'app/source/components/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: PUBLIC_PATH,
        port: ServerConfig.port,
        liveReload: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new HtmlWebPackPlugin({
            template: `${TEMPLATE_PATH}index.html`,
            filename: './index.html',
        }),
        new CopyWebpackPlugin([
            { from: `${MEDIA_PATH}favicon.ico` },
        ]),
        new PageReloadPlugin({port:ServerConfig.port,enable:true}),
    ],
};
