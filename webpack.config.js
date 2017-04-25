const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// add any new plugins here
let myPlugins = [
  new ExtractTextPlugin('style.css'),
  new HtmlWebpackPlugin({
    inject: true,
    template: path.join(__dirname, 'assets/templates/pages/index.pug'),
    filename: 'index.html'
  })
];

// read pages directory and add new pages with the html webpack plugin
let files = fs.readdirSync(path.join(__dirname, 'assets/templates/pages/'));
for (let i = 0; i < files.length; i++) {
  let fileWithExt = String(files[i]),
      fileWithoutExt = String(files[i].split('.').shift());

  if (fileWithoutExt !== 'index') {
    myPlugins.push(
      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(__dirname, `assets/templates/pages/${fileWithExt}`),
        filename: `${fileWithoutExt}/index.html`
      })
    );
  }
}

module.exports = {
  entry: {
    site: './assets/index.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: false,
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader'
        }
      }
    ]
  },
  plugins: myPlugins
}
