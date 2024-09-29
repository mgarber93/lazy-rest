import {ClientOptions} from 'openai'

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
  anthropic: object | null;
}
