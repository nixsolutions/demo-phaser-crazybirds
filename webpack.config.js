const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');
const box2d = require.resolve('./src/lib/box2d-plugin-full.js')

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ]
  },
  // devtool: 'source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: 'bundle.js'
  },
  watch: true,
  plugins: [
    new CleanPlugin(['build']),
    definePlugin,
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      open: false,
      server: {
        baseDir: ['./', './build']
      }
    }),
    new webpackUglifyJsPlugin({
      cacheFolder: path.resolve(__dirname, 'public/cached_uglify/'),
      debug: true,
      minimize: true,
      sourceMap: false,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    }),
    new JavaScriptObfuscator({
      rotateUnicodeArray: true
    }, ['name.js'])
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src')
    }, {
      test: /pixi\.js/,
      loader: 'expose?PIXI'
    }, {
      test: /phaser-split\.js$/,
      loader: 'expose?Phaser'
    }, {
      test: /p2\.js/,
      loader: 'expose?p2'
    }, {
      test: box2d,
      loader: 'imports?this=>window'
    }, {
      test: /\.(png|jpe?g|gif)$/,
      loader: 'file?name=img/[name].[ext]'
    }]
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
      'box2d': box2d
    }
  }
};
