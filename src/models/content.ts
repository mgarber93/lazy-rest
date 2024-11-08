import { v4 as uuidv4 } from "uuid"
import { ApiCallPlan } from "./api-call-plan"

export type Role = "system" | "assistant" | "user" | "tool"

export interface ContentDelta {
  chatId: string
  messageId: string
  delta: string
}

/**
 * Message can be initialized with an empty string, but at the end of the api call plan we should put the
 * final answer to the users query in the message string for the rest of the convo to read from
 */
export interface AuthoredContent {
  id: string
  chatId: string
  message: string
  apiCallPlan?: ApiCallPlan
  author: string
  role: Role
}

export interface ToolCall extends AuthoredContent {
  role: "tool"
  tool_call_id: string
  tool_calls: { function: string; id: string }[]
}

export function isToolCall(content: AuthoredContent): content is ToolCall {
  return (
    content.role === "tool" &&
    Object.prototype.hasOwnProperty.call(content, "tool_call_id")
  )
}

export function generateId() {
  return uuidv4()
}

export function createContent(
  message: string,
  chatId: string,
  author: string,
  role: Role,
): AuthoredContent {
  const id = generateId()
  return {
    id,
    chatId,
    message,
    author,
    role,
  }
}

export function copy(content: AuthoredContent) {
  return {
    ...content,
  }
}
