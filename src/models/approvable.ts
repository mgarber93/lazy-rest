import {EndpointCallPlan} from './endpoint'

/**
 * Renderer process must approve some actions. This is mediated using makeRequest
 *
 */
export interface Approvable {
  type: "CallingPlan" | "SecretRequest"
}

export interface CallingPlan extends Approvable {
  type: "CallingPlan"
  calls: EndpointCallPlan[]
}

export interface SecretRequest extends Approvable {
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
  return response.response === "approve"
}