export interface OpenApiSpec {
  openapi: "3.0.3"
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
    securitySchemes: any
    responses: any
    schemas: any
    parameters: any
  }
}

interface Schema {
  name: 'string';
  required: boolean;
  in: string;
}

interface EndpointParameter {
  name: string;
  required: boolean;
  schema: Schema;
}

interface Ref {
  '$ref': string;
}

export interface EndpointDescription {
  tags: string[];
  summary: string;
  description: string;
  parameters: EndpointParameter[];
  responses: Record<string, Ref>;
}

export interface Endpoint {
  get?: EndpointDescription
  post?: EndpointDescription
  put?: EndpointDescription
  patch?: EndpointDescription
  delete?: EndpointDescription
}
