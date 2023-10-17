const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { merge } = require('webpack-merge');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index.ts'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  module: { rules: [
    { test: /\.ts$/i, use: 'ts-loader' },
    {
      test: /\.html$/,
      loader: 'html-loader',
      options: { minimize: true },
    },
    {
		  test: /^((?!module).)*(\.(sc|sa|c)ss)$/i,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'sass-resources-loader',
          options: { resources: [
            path.resolve(__dirname, 'src', 'styles', 'vars.scss'),
            path.resolve(__dirname, 'src', 'styles', 'mixins.scss'),
            path.resolve(__dirname, 'src', 'styles', 'typography.scss'),
          ]},
        },
      ],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'assets/images/[name][ext]',
      },
    },
    {
      test: /\.(woff2?|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'assets/fonts/[name][ext]',
      },
    },
    {
      test: /\.(wav|mp3)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'audio/[name][ext]',
      },
    },
  ]},
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'template.html'),
      filename: 'index.html',
    }),
    new FileManagerPlugin({
      events: {
        onStart: { delete: ['dist'] },
        onEnd: { copy: [
          { source: path.join('public'), destination: path.join('dist') },
        ] },
      },
    }),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config.js');

  return merge(baseConfig, envConfig);
};