export type TChannel = "message-delta" | "tool-request" | "tool-approval" | "load-oas";

// first id is id for co-ordination
export type TSender = (eventName: string, ...args: any[]) => void;

export class WindowSender<T = any> {
  private _sender: TSender | null = null;
  private promiseMap = new Map<string, (value: unknown) => void>();
  constructor(private _queue: { eventName: TChannel, args: any[] }[] = []) {
  }
  hasFinishedLoading(sender: TSender) {
    this._sender = sender;
    for (const message of this._queue) {
      this._sender(message.eventName, ...message.args);
    }
  }
  /**
   * Internal detail to window sender that it uses a queue
   */
  private sendOrQueue(eventName: TChannel, args: any[]) {
    if (this._sender) {
      this._sender(eventName, ...args);
    } else {
      this._queue.push({eventName, args: [...args]});
    }
  }
  send(eventName: TChannel, ...args: any[]): void {
    return this.sendOrQueue(eventName, args);
  }
  asyncSend(eventName: TChannel, id: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.promiseMap.has(id)) {
        // throw duplication error
        throw new Error(`${id} is already registered`)
      }
      this.promiseMap.set(id, resolve);

      const nextArgs = [id, ...args];
      if (this._sender) {
        // we're resolving right away
         this._sender(eventName, ...nextArgs);
      } else {
        this._queue.push({eventName, args: nextArgs});
      }
    });
  }
  callback(id:string , response: T) {
    const resolve = this.promiseMap.get(id);
    if (resolve) {
      this.promiseMap.delete(id);
      return resolve(response);
    }
  }
}

export default new WindowSender();