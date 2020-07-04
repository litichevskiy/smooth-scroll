const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";

const defaultSettings = {

  devtool: IS_PRODUCTION ? 'none' : 'source-map',

  watch: !IS_PRODUCTION,

  resolve: { extensions: [' ', '.js', '.scss', 'css'] },

  plugins: [
    new ExtractTextPlugin('../css/bundle.css'),
    new webpack.DefinePlugin ({
      'process.env.NODE_ENV': JSON.stringify ( NODE_ENV )
    })
  ],

  module: {

    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /\/node_modules\//,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-runtime'
            ]
          },
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        exclude: /\/node_modules\//,
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {sourceMap: !IS_PRODUCTION, minimize:  !IS_PRODUCTION}
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer({browsers:['last 5 version']})],
                sourceMap: !IS_PRODUCTION
              }
            },
            {
              loader: 'sass-loader',
              options: {sourceMap: !IS_PRODUCTION}
            },
          ]
        })
      }
    ]
  }
};

module.exports = [
  {
    entry: {
      bundle: ['./src/js/index-demo.js'],
      css: ['./src/style/index.scss']
    },
    output: {
      path: path.resolve(__dirname, './dist/js'),
      filename: '[name].js',
      chunkFilename: '[name].bundle.js',
      publicPath: './dist/js/'
    },
  },
  {
    entry: {
      'smooth-scroll.min': ['./src/js/index.js']
    },
    output: {
      path: path.resolve(__dirname, './dist/js'),
      publicPath: './dist/js/',
      filename: '[name].js',
    },
  },
  {
    entry: {
      'smooth-scroll-polyfill.min': ['./src/js/index.polyfill.js']
    },
    output: {
      path: path.resolve(__dirname, './dist/js'),
      publicPath: './dist/js/',
      filename: '[name].js',
    },
  },
];

module.exports.forEach( item => {
  item.devtool = defaultSettings.devtool;
  item.resolve = defaultSettings.resolve;
  item.watch = defaultSettings.watch;
  item.plugins = defaultSettings.plugins;
  item.module = defaultSettings.module;
});

if( IS_PRODUCTION ) {

  module.exports.forEach( item => {
    item.plugins.push( new UglifyJsPlugin({ uglifyOptions:{ minimize: true }}) );
  });
};