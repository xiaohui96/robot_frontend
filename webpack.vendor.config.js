const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const vendors = [
  'react',
  'react-dom',
  'antd',
  'antd/lib',
  'core-js',
  'reflux',
  'react-router',
  'react-router-dom',
  'react-intl-universal'
];

module.exports = ({analyze}={}) => {
  const config = {
    output: {
      path: path.resolve(__dirname, 'dist/vendor'),
      filename: '[name].[chunkhash:8].dll.js',
      library: '[name]_[chunkhash:8]',
    },
    entry: {
      vendor: vendors,
    },
    plugins: [
      new CleanWebpackPlugin(['dist/vendor']),
      new webpack.DllPlugin({
        path: path.resolve(__dirname, 'dist/vendor/manifest.json'),
        name: '[name]_[chunkhash:8]',
        context: __dirname,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin(),
      // new BundleAnalyzerPlugin()
    ]
  }
  if(analyze) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }
  return config;
};
