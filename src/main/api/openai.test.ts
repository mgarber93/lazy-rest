
const mockModels = [
  {id: 'gpt-3.5-turbo', object: 'model'},
  {id: 'gpt-4', object: 'model'},
  {id: 'gpt-4-turbo-preview', object: 'model'}
];

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    models: {
      list: jest.fn().mockReturnValue(Promise.resolve({data: mockModels})),
    },
  }))
});

import {OpenAiProvider} from './openai';

describe('OpenAiProvider', () => {
  it('getModels', async () => {
    const openAiProvider = new OpenAiProvider('apiKey', 'baseUrl');
    const models = await openAiProvider.getModels();
    expect(models).toEqual('gpt-3.5-turbo,gpt-4,gpt-4-turbo-preview')
  });
  it('testConnection', async () => {
    const openAiProvider = new OpenAiProvider('apiKey', 'baseUrl');
    const connection = await openAiProvider.testConnection();
    expect(connection).toEqual('gpt-3.5-turbo,gpt-4,gpt-4-turbo-preview');
  })
});
