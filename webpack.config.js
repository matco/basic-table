import * as path from 'path';
import {fileURLToPath} from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**@type {import('webpack').Configuration}*/
export default {
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
				{from: './example/data*.json', to: '[name].json'}
			]
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
				type: 'asset/resource'
			}
		]
	},
	devServer: {
		port: 9000,
		host: '0.0.0.0'
	}
};
