const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pug = require('pug');
module.exports = {
  mode: 'development',
  entry: {
    client: './public/test/index.jsx'
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
					test: /\.pug$/,
					use: [
						{
							loader: 'apply-loader',
							options: {
								obj: {
									title: 'React'
								}
							}
						},
						{
							loader: 'pug-loader',
						}
					]
				},
				{
					test: /\.jsx$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [ '@babel/preset-react' ]
						}
					}
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
			template: 'public/test/index.pug',
			title: 'Retry'
    })
  ],
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};
