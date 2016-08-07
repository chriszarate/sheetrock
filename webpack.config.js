const webpack = require('webpack');

module.exports = {
  entry: './src',
  output: {
    filename: './dist/sheetrock.min.js',
    library: 'sheetrock',
    libraryTarget: 'umd',
    sourceMapFilename: './dist/sheetrock.min.js.map',
    umdNamedDefine: true,
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.NormalModuleReplacementPlugin(
      /\.\/lib\/transport/,
      require.resolve('./src/lib/transport-browser')
    ),
  ],
  resolve: {
    extensions: ['', '.js'],
  },
};
