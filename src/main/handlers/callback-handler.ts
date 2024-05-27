import {container, singleton} from 'tsyringe'
import {Handler} from './handler'
import {MainWindowCallbackConsumer} from '../main-window-callback-consumer'

@singleton()
export class CallbackHandler implements Handler<'callback'> {
  private mainWindowCallbackConsumer = container.resolve(MainWindowCallbackConsumer)
  
  async handle(id: string, arg: never) {
    return this.mainWindowCallbackConsumer.callback(id, arg)
  }
}
