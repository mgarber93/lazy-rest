/**
 * Renderer process must approve some actions. This is mediated using makeRequest
 *
 */
export interface Approval {
  type: "CallingPlan" | "SecretRequest"
}

export interface CallingPlan extends Approval {
  type: "CallingPlan"
  plan: string
}

export interface SecretRequest extends Approval {
  type: "SecretRequest"
}

export interface ApprovalResponse {
  response: "approve" | "deny"
  clientId?: string
  clientSecret?: string
}

export interface ApprovedResponse extends ApprovalResponse {
  response: "approve"
}

export function approvalResponseIsApproved(response: ApprovalResponse): response is ApprovedResponse {
  return response.response === "approve";
}