import {PreloadedApi} from './preload'
import './renderer/index.scss'
import './app'

declare global {
  interface Window {
    main: PreloadedApi
  }
}
