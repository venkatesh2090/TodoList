const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
	mode: 'development',
	target: 'node',
	entry: {
		server: './server/bin/www.js'
	},
	devtool: 'inline-source-map',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../dist')
	},
	externals: [ 
		nodeExternals()
	],
	module: {
		rules: [
			{
				test: /\.(sql)/,
				use: [
					{
						loader: 'file-loader'
					}
				]
			}
		]
	},
	plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })
	],
	node: {
		__dirname: false
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};
