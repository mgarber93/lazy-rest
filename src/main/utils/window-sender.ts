import {v4} from 'uuid'
import {TWindowSenderChannel} from '../../window-callback/window-callback-api'
import {singleton} from 'tsyringe'

export type TSender = (eventName: string, ...args: never[]) => void

@singleton()
export class WindowSender  {
  private _sender: TSender | null = null
  private promiseMap = new Map<string, (value: unknown) => void>()
  
  constructor(private _queue: { eventName: TWindowSenderChannel, args: never[] }[] = []) {
  }
  
  hasFinishedLoading(sender: TSender) {
    this._sender = sender
    for (const message of this._queue) {
      this._sender(message.eventName, ...message.args)
    }
  }
  
  send(eventName: TWindowSenderChannel, ...args: never[]): void {
    return this.sendOrQueue(eventName, args)
  }
  
  /**
   * Async send allows the renderer process (received by sender fxn) to complete some async process and then return
   * value of type T using the callback method defined on this class.
   * @param eventName
   * @param args
   */
  asyncSend<T = never>(eventName: TWindowSenderChannel, ...args: any[]): Promise<T> {
    const promiseId = v4()
    return new Promise((resolve, reject) => {
      if (this.promiseMap.has(promiseId)) {
        throw new Error(`${promiseId} is already registered (do we need to set a random seed?)`)
      }
      this.promiseMap.set(promiseId, resolve)
      
      const nextArgs = [promiseId, ...args] as never[]
      if (this._sender) {
        this._sender(eventName, ...nextArgs)
      } else {
        this._queue.push({eventName, args: nextArgs})
      }
    })
  }
  
  private sendOrQueue(eventName: TWindowSenderChannel, args: never[]) {
    if (this._sender) {
      this._sender(eventName, ...args)
    } else {
      this._queue.push({eventName, args: [...args]})
    }
  }
  
  callback(promiseId: string, response: never) {
    const resolve = this.promiseMap.get(promiseId)
    if (resolve) {
      this.promiseMap.delete(promiseId)
      return resolve(response)
    } else {
      throw new Error(`No promise found for id: ${promiseId}`)
    }
  }
}
