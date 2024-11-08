import "reflect-metadata"
import { mapAuthoredContentToChatCompletion } from "../providers/openai"
import { describe, expect, it } from "@jest/globals"
import { ChatCompletionMessageParam } from "openai/resources"
import { AuthoredContent } from "../../models/content"

describe("mapAuthoredContentToChatCompletion function", () => {
  it("should transform system role content correctly", () => {
    const content: AuthoredContent = {
      id: "1",
      chatId: "chat1",
      message: "System message",
      author: "System",
      role: "system"
    }
    const expected: ChatCompletionMessageParam = {
      role: "system",
      content: "System message"
    }
    expect(mapAuthoredContentToChatCompletion(content)).toStrictEqual(expected)
  })

  it("should transform assistant role content correctly", () => {
    const content: AuthoredContent = {
      id: "2",
      chatId: "chat2",
      message: "Assistant message",
      author: "Assistant",
      role: "assistant"
    }
    const expected: ChatCompletionMessageParam = {
      role: "assistant",
      content: "Assistant message"
    }
    expect(mapAuthoredContentToChatCompletion(content)).toStrictEqual(expected)
  })

  it("should transform user role content correctly", () => {
    const content: AuthoredContent = {
      id: "3",
      chatId: "chat3",
      message: "User message",
      author: "User",
      role: "user"
    }
    const expected: ChatCompletionMessageParam = {
      role: "user",
      content: "User message"
    }
    expect(mapAuthoredContentToChatCompletion(content)).toStrictEqual(expected)
  })

  it("should throw an error when invalid tool role content is provided", () => {
    const content = {
      id: "4",
      chatId: "chat4",
      message: "Tool message",
      author: "Tool",
      role: "tool" // incorrect type
    }
    expect(() =>
      mapAuthoredContentToChatCompletion(content as AuthoredContent),
    ).toThrow()
  })

  it("should transform valid tool role content correctly", () => {
    const content: AuthoredContent & { tool_call_id: string } = {
      id: "5",
      chatId: "chat5",
      message: "Tool call message",
      author: "Tool",
      role: "tool",
      tool_call_id: "tool1"
    }
    const expected: ChatCompletionMessageParam & { tool_call_id: string } = {
      role: "tool",
      content: "Tool call message",
      tool_call_id: "tool1"
    }
    expect(mapAuthoredContentToChatCompletion(content)).toStrictEqual(expected)
  })
})
