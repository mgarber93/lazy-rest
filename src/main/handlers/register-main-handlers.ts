import {container} from 'tsyringe'
import {StreamedChatHandler} from './streamed-chat'
import {ModelListHandle} from './get-models'
import {INVOKE_CHANNELS, TInvokeChannel} from '../../preloader/preloaded-api'
import {Handler} from './handler'
import {CallbackHandler} from './callback-handler'
import {HttpClient} from './http-client'
import {OperatingSystem} from './get-machine-info'
import {SummarizeResponse} from './summarize-response'


/**
 * Register dependency injectable handlers within the main process
 */
export function registerMainHandlers() {
  container.register<TInvokeChannel[]>('InvokeChannels', {useValue: INVOKE_CHANNELS})
  
  container.register<Handler<'streamedChat'>>('streamedChat', {useClass: StreamedChatHandler})
  container.register<Handler<'getMachineName'>>('getMachineName', {useClass: OperatingSystem})
  container.register<Handler<'callback'>>('callback', {useClass: CallbackHandler})
  container.register<Handler<'getModels'>>('getModels', {useClass: ModelListHandle})
  container.register<Handler<'fetch'>>('fetch', {useClass: HttpClient})
  container.register<Handler<'summarizeResponse'>>('summarizeResponse', {useClass: SummarizeResponse})
}
