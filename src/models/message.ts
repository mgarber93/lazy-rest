export interface Message {
  message: string;
  editable: boolean;
  author: string;
}

export function createMessage(message: string, author: string): Message {
  return {
    message,
    author,
    editable: false
  }
}