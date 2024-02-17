import {OpenAi} from './preload';


declare global {
  interface Window {
    openai: OpenAi
  }
}