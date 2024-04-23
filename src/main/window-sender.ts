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
  
  send(eventName: TChannel, id: string, ...args: any[]): Promise<T> {
    if (this.promiseMap.has(id)) {
      // throw duplication error
      throw new Error(`${id} is already registered`)
    }

    return new Promise((resolve, reject) => {
      this.promiseMap.set(id, resolve);
      if (this._sender) {
        this._sender(eventName, id, ...args);
      } else {
        this._queue.push({eventName, args: [id, ...args]});
      }
    })
  }
  callback(id:string , response: T) {
    const resolve = this.promiseMap.get(id);
    if (resolve) {
      return resolve(response);
    }
  }
}

export default new WindowSender();