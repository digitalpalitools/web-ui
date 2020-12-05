/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path'
import * as webpack from 'webpack'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

delete process.env.TS_NODE_PROJECT

export const config: webpack.Configuration = {
  entry: './src/index-cli.ts',
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.cli.json'),
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index-cli.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    mainFields: ['main'],
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: path.resolve(__dirname, '.'),
        configFile: path.resolve(__dirname, './tsconfig.cli.json'),
      }),
    ],
  },
}

export default config
