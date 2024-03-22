export type TChannel = "message-delta" | "tool-request" | "tool-approval";

export type TSender = (eventName: string, ...args: any[]) => void;

export class WindowSender {
  private _sender: TSender | null = null;
  
  constructor(private _queue: { eventName: TChannel, args: any[] }[] = []) {
  }
  
  hasFinishedLoading(sender: TSender) {
    this._sender = sender;
    for (const message of this._queue) {
      this._sender(message.eventName, ...message.args);
    }
  }
  
  send(eventName: TChannel, ...args: any[]) {
    if (this._sender) {
      this._sender(eventName, ...args);
    } else {
      this._queue.push({eventName, args});
    }
  }
}

export default new WindowSender();