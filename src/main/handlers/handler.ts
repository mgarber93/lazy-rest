import { PreloadedApi } from "../../preloader/preloaded-api"

export interface Handler<T extends keyof PreloadedApi> {
  handle: PreloadedApi[T]
}
