const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: [
		path.resolve(__dirname, 'example', 'index.js'),
		path.resolve(__dirname, 'example', 'index.css')
	],
	output: {
		path: path.join(__dirname, 'example', 'dist'),
		filename: '[name].bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'example', 'index.html'),
			inject: 'head',
			xhtml: true
		}),
		new CopyPlugin({
			patterns: [
				{from: './example/data*.json', flatten: true}
			],
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.png$/,
				use: [
					'file-loader',
				]
			},
		]
	},
	devServer: {
		contentBase: path.join(__dirname, 'example', 'dist'),
		port: 9000,
		host: '0.0.0.0'
	}
};
