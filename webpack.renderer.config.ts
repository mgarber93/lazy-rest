import type {Configuration} from 'webpack'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'

import {rules} from './webpack.rules'
import {plugins} from './webpack.plugins'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new CopyPlugin({
      patterns: [
        { from: 'src/renderer/index.html', to: '.' }
      ],
    }),
    new MonacoWebpackPlugin({
      languages: ['javascript', 'typescript', 'css', 'html', 'json'],
      filename: 'worker/[name].worker.js',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'],
  },
  output: {
    publicPath: '',
  },
}

