export type TWindowSenderChannel =
  "message-delta"
  | "load-oas"
  | 'callback'
  | 'approval'
  | 'calling-plan'
  | 'respond-to'
// allow list enforced at runtime
export const channelAllowList: TWindowSenderChannel[] = ['message-delta', 'load-oas', 'callback', 'approval', 'calling-plan', 'respond-to']