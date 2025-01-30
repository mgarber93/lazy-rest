import type {Configuration} from 'webpack'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'

import {rules} from './webpack.rules'
import {plugins} from './webpack.plugins'


export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new MonacoWebpackPlugin({
      languages: ['javascript', 'typescript', 'css', 'html', 'json'],
      filename: 'worker/[name].worker.js',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  output: {
    publicPath: '',
  },
}
