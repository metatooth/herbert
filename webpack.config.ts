import path from 'path';
import { Configuration } from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import cssnano from 'cssnano';

import { SERVER_PORT, IS_DEV, WEBPACK_PORT } from './src/server/config';

const plugins = [
    new WebpackManifestPlugin(),
    new VueLoaderPlugin(),
    new HTMLWebpackPlugin({
        title: 'Hello Herbert!',
        template: path.resolve(__dirname, "./assets/index.html"),
        favicon: path.resolve(__dirname, "./assets/favicon.png"),
        inject: 'body',
    }),
    new CleanWebpackPlugin(),
];

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// plugins.push(new BundleAnalyzerPlugin());

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const targets = IS_DEV ? { chrome: '79', firefox: '72' } : '> 0.25%, not dead';

const config: Configuration = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'inline-source-map' : false,
  context: __dirname,
  entry: './src/client/main.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `[name]-[chunkhash]-bundle.js`,
    chunkFilename: `[name]-[chunkhash]-bundle.js`,
  },
  optimization: {
    minimize: !IS_DEV,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
loader: 'babel-loader',
            options: {
                "plugins": [ 
                    [ 
                        "@babel/plugin-proposal-decorators", { "legacy": true } 
                    ] 
                ]
            }
        }
      },
      {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
              loader: 'ts-loader'
          }
      },
      {
        test: /\.vue$/,
        use: {
            loader: 'vue-loader',
        },
      },
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader!css-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localsConvention: 'camelCase',
              sourceMap: IS_DEV,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IS_DEV,
              plugins: IS_DEV ? [cssnano()] : [],
            },
          },
        ],
      },
      {
        test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
        use: 'file-loader',
      },   
 ],
  },
  resolve: {
    extensions: ['*', '.ts', '.js', '.vue', '.json'],
    alias: {
      Client: path.resolve(__dirname, '/src/client'),
      Components: path.resolve(__dirname, '/src/client/components')
    }
  },
  devServer: {
    port: WEBPACK_PORT,
    overlay: IS_DEV,
    open: IS_DEV,
    openPage: `http://localhost:${WEBPACK_PORT}`,
    publicPath: '/',
    contentBase: './dist',
  },
  plugins,
};

export default config;
