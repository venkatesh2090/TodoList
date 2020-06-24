const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
	mode: 'development',
	entry: {
		app: './public/script.js'
  },
  output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  module: {
	rules: 
		[
			{
				test: /\.pug$/,
				use: [ 
					'pug-loader',
					'apply-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
  },
  plugins: [
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
		new HtmlWebpackPlugin({
			title: 'Pug'
		})
  ]
};
