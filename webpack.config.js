//
// Webpack config
//

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// add any new plugins here
let myPlugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    Tether: "tether",
    "window.Tether": "tether",
    Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
    Button: "exports-loader?Button!bootstrap/js/dist/button",
    Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
    Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
    Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
    Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
    Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
    Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
    Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
    Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
    Util: "exports-loader?Util!bootstrap/js/dist/util"
  }),
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
        test: require.resolve('jquery'),
        use: {
          loader: 'imports-loader?jQuery=jquery,$=jquery,this=>window'
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
