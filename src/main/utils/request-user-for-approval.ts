import windowSender from './window-sender'
import {Approvable, ApprovalResponse, approvalResponseIsApproved} from '../../models/approvable'


export async function requestUserForApproval(request: Approvable, ...args: any[]): Promise<ApprovalResponse> {
  const response = await windowSender.asyncSend('approval', request, ...args)
  if (!approvalResponseIsApproved(response)) {
    throw new Error('unapproved')
  }
  return response
}