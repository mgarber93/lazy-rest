import {v4} from 'uuid'

export type TChannel = "message-delta" | "load-oas" | 'callback' | 'approval'

export type TSender = (eventName: string, ...args: any[]) => void

export class WindowSender {
  private _sender: TSender | null = null
  private promiseMap = new Map<string, (value: unknown) => void>()
  constructor(private _queue: { eventName: TChannel, args: any[] }[] = []) {
  }
  hasFinishedLoading(sender: TSender) {
    this._sender = sender
    for (const message of this._queue) {
      this._sender(message.eventName, ...message.args)
    }
  }
  private sendOrQueue(eventName: TChannel, args: any[]) {
    if (this._sender) {
      this._sender(eventName, ...args)
    } else {
      this._queue.push({eventName, args: [...args]})
    }
  }
  send(eventName: TChannel, ...args: any[]): void {
    return this.sendOrQueue(eventName, args)
  }

  /**
   * Async send allows the renderer process (received by sender fxn) to complete some async process and then return
   * value of type T using the callback method defined on this class.
   * @param eventName
   * @param args
   */
  asyncSend<T = any>(eventName: TChannel, ...args: any[]): Promise<T> {
    const id = v4()
    return new Promise((resolve, reject) => {
      if (this.promiseMap.has(id)) {
        throw new Error(`${id} is already registered (do we need to set a random seed?)`)
      }
      this.promiseMap.set(id, resolve)

      const nextArgs = [id, ...args]
      if (this._sender) {
         this._sender(eventName, ...nextArgs)
      } else {
        this._queue.push({eventName, args: nextArgs})
      }
    })
  }
  callback(id:string, response: any) {
    const resolve = this.promiseMap.get(id)
    if (resolve) {
      this.promiseMap.delete(id)
      return resolve(response)
    } else {
      throw new Error(`No promise found for id: ${id}`)
    }
  }
}

export default new WindowSender()