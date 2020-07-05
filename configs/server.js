const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
	mode: 'development',
	target: 'node',
	entry: {
		server: './server/bin/www.js'
	},
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
	node: {
		__dirname: false
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};
