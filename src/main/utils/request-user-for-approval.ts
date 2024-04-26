import windowSender from './window-sender';
import {Approval, ApprovalResponse, approvalResponseIsApproved} from '../../models/approval';


export async function requestUserForApproval(request: Approval, ...args: any[]): Promise<ApprovalResponse> {
  const response = await windowSender.asyncSend('approval', request, ...args);
  if (!approvalResponseIsApproved(response)) {
    throw new Error('unapproved')
  }
  return response;
}