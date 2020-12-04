import * as path from 'path'
import * as webpack from 'webpack'

const config: webpack.Configuration = {
  entry: './src/index-cli.ts',
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index-cli.js',
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/\/yargs\//, (data: any) => {
      const d = data
      delete d.dependencies[0].critical
      return d
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    mainFields: ['main'],
  },
}

export default config
