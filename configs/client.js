const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const pug = require('pug');
module.exports = {
  mode: 'development',
  entry: {
    client: './public/test/script.js'
  },
  output: {
		filename: '[name].[contentHash].bundle.js',
    path: path.resolve(__dirname, '../dist'),
		publicPath: 'static'
  },
  devtool: 'inline-source-map',
  module: {
    rules:
      [
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
      filename: 'index.html',
			title: 'Retry'
    })
  ],
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};
