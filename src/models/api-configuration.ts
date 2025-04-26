import {ClientOptions} from 'openai'
import {BedrockClient} from "@aws-sdk/client-bedrock"


export interface ApiConfiguration {
  fileHandle: string;
  name: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface File {
  fileHandle: string;
  id: string;
}

export interface ProviderConfiguration {
  openAi: ClientOptions | null;
  bedrock: ConstructorParameters<typeof BedrockClient>[0] | null;
}
