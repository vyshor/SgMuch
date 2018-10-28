var path = require('path')
var webpack = require('webpack')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const UglifyJsPlugin = require("uglifyes-webpack-plugin");

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {},
          limit: 10000
          // other vue-loader options go here
        }
      },
      // {
      //   test: /\.es6$/,
      //   exclude: /node_modules/,
      //   loader: 'babel',
      //   query: {
      //     presets: ['es2015']
      //   }
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["@babel/env"]
        }
      },
      // {
      //   test: /\.js$/,
      //   exclude: '/node_modules/',
      //   loader: 'babel',
      //   query: {presets: ['es2015']},
      // },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      // 'jquery': 'materialize-css/node_modules/jquery/dist/jquery.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery'
    })
  ],
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new UglifyJsPlugin({
    //   uglifyOptions: {
    //     ecma: 8
    //   }
    // }),
    new UglifyJsPlugin({
    // new webpack.optimize.UglifyJsPlugin({
      // uglifyOptions: {
      //   ecma: 8
      // },
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
