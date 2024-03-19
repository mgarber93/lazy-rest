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

export interface EndpointDescription {
  tags: string[]
  description: string
}

export interface Endpoint {
  get?: EndpointDescription
  post?: EndpointDescription
  put?: EndpointDescription
  patch?: EndpointDescription
  delete?: EndpointDescription
}
