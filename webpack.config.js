const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const pug = require('pug');
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
            {
              loader: 'apply-loader',
              options: {
                obj: {
				  title: 'Pug',
				  users: [
					'venkatesh',
					'harish'
				  ]
                }
              }
            },
            {
              loader: 'pug-loader'
            }
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
      template: './public/test.pug',
      filename: 'index.html'
    })
  ]
};
