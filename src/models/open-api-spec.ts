
export interface SecurityScheme {
  type: string
  name?: string
  in?: string
}

export interface Response {
  description?: string
  "$ref"?: string
}

export interface OpenApiSpec {
  openapi: string
  info: {
    description: string
    title: string
    contact: {
      name: string
    }
  }
  servers: { url: string } []
  tags: { name: string }[]
  paths: Record<string, Endpoint>
  components: {
    securitySchemes: Record<string, SecurityScheme>
    responses: Record<string, Response>
    schemas: any
    parameters: any

  }
}

interface Schema {
  name: 'string'
  required: boolean
  in: string
}

interface EndpointParameter {
  name: string
  required: boolean
  schema: Schema
}

interface Ref {
  "$ref": string
}

interface Parameter {
  name: string
  required: boolean
  in: string
  schema: {
    title: string
    description: string
    example: string
    type: string
  }
}

export interface EndpointDescription {
  tags: string[]
  summary: string
  description: string
  parameters: (Ref | Parameter)[]
  
  responses: Record<string, Ref>
}

export interface Endpoint {
  get?: EndpointDescription
  post?: EndpointDescription
  put?: EndpointDescription
  patch?: EndpointDescription
  delete?: EndpointDescription
}
