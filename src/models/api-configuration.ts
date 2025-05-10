import {ClientOptions} from 'openai'


export interface ApiConfiguration {
  fileHandle: string;
  name: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface BedrockConfiguration {
  accessKey: string;
  secretAccessKey: string;
  accessToken?: string;
}

export interface ProviderConfiguration {
  openAi: ClientOptions | null;
  bedrock: BedrockConfiguration | null;
}
