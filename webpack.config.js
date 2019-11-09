var path = require('path');
var webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'launch-hunzhongwen.js'
  },
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [
    require('webpack-node-externals')(),
    'svpng'
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: path.join(__dirname, 'node_modules'),
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'shebang-loader'
          }
        ]
      }
    ],
  },
  stats: {
    colors: true
  }
};
