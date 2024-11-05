export interface ToolParameter {
  type: "object" | "string" | "number"
  enum: string[]
  description: string
}

export interface ObjectParameter extends ToolParameter {
  type: "object"
  required: string[]
}

export interface Tool {
  name: string
  description: string
  parameters: Record<string, ToolParameter>
}
