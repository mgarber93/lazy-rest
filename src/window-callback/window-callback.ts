
export type TWindowSenderChannel = keyof WindowCallback

export const channelAllowList: TWindowSenderChannel[] = [
  'messageDelta',
  'loadOas',
  'callback',
  'approval',
  'callingPlan',
  'respondTo',
]

export interface WindowCallback {
  messageDelta(authoredContentDelta: any): Promise<void>;
  
  loadOas(authoredContentOas: any): Promise<void>;
  
  callback(approvalCallback: any): Promise<void>;
  
  approval(approvalStatus: any): Promise<void>;
  
  callingPlan(callPlan: any): Promise<void>;
  
  respondTo(response: any): Promise<void>;
}
