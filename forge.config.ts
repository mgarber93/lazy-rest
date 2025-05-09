import type {ForgeConfig} from '@electron-forge/shared-types'
import {MakerSquirrel} from '@electron-forge/maker-squirrel'
import {MakerZIP} from '@electron-forge/maker-zip'
import {MakerDeb} from '@electron-forge/maker-deb'
import {MakerRpm} from '@electron-forge/maker-rpm'
import {AutoUnpackNativesPlugin} from '@electron-forge/plugin-auto-unpack-natives'
import {WebpackPlugin} from '@electron-forge/plugin-webpack'

import {mainConfig} from './webpack.main.config'
import {rendererConfig} from './webpack.renderer.config'
import * as path from 'path'

const config: ForgeConfig = {
  packagerConfig: {
    name: "LazyRest",
    asar: true,
    icon: path.join(__dirname, 'src', 'assets', 'icon.ico'),
    osxSign: {
      identity: "Developer ID Application: Matthew Garber (CSDC2P5KTW)"
    },
    osxNotarize: {
      keychainProfile: 'LazyRest',
    }
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: path.join(__dirname, 'src', 'assets', 'icon.ico'),
      name: "lazy-rest",
    }),
    new MakerZIP({}, ['darwin', 'win32']),
    new MakerRpm({}),
    new MakerDeb({})
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data: https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net blob:; worker-src 'self' blob:;`,
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
  publishers: [
  ],
}

export default config
