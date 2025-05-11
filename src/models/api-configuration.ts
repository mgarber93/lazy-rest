import {ClientOptions} from 'openai'


export interface ApiConfiguration {
  fileHandle: string;
  name: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface BedrockConfiguration {
  region: string
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export interface ProviderConfiguration {
  openAi: ClientOptions | null;
  bedrock: BedrockConfiguration | null;
}
