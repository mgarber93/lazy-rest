export interface OpenApiSpec {
  openapi: "3.0.3"
  info: {
    description: string
    title: string
  }
  servers: { url: string } []
  tags: { name: string }[]
  paths: Record<string, Endpoint>
  components: {
    securitySchemes: any
    responses: any
    schemas: any
    parameters: any
  }
}

export interface Endpoint {
  get?: {
    tags: string[]
    description: string
  }
  post?: {
    tags: string[]
    description: string
  }
  put?: {
    tags: string[]
    description: string
  }
  delete?: {
    tags: string[]
    description: string
  }
}
