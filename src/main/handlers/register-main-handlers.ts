import {container} from 'tsyringe'
import {StreamedChatHandler} from './streamed-chat'
import {OperatingSystem} from './user'
import {ModelListHandle} from './get-models'
import {INVOKE_CHANNELS, TInvokeChannel} from '../../preloader/preloaded-api'
import {Handler} from './handler'
import {CallDetailer} from './call-detailer'
import {ResultInterpreter} from './result-interpreter'
import {OpenAiConfigHandler} from './open-ai-config-handler'
import {CallbackHandler} from './callback-handler'
import {HttpHandler} from './http-handler'


/**
 * Register dependency injectable handlers within the main process
 */
export function registerMainHandlers() {
  container.register<TInvokeChannel[]>('InvokeChannels', {useValue: INVOKE_CHANNELS})
  
  container.register<Handler<'streamedChat'>>('streamedChat', {useClass: StreamedChatHandler})
  container.register<Handler<'getMachineName'>>('getMachineName', {useClass: OperatingSystem})
  container.register<Handler<'httpCall'>>('httpCall', {useClass: HttpHandler})
  container.register<Handler<'detailCallInPlan'>>('detailCallInPlan', {useClass: CallDetailer})
  container.register<Handler<'callback'>>('callback', {useClass: CallbackHandler})
  container.register<Handler<'setOpenAiConfiguration'>>('setOpenAiConfiguration', {useClass: OpenAiConfigHandler})
  container.register<Handler<'getModels'>>('getModels', {useClass: ModelListHandle})
  container.register<Handler<'interpretResult'>>('interpretResult', {useClass: ResultInterpreter})
}
