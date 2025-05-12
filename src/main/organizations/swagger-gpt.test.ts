import {container} from 'tsyringe'
import {SwaggerGpt} from './swagger-gpt'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {Conversation} from '../../models/conversation'
import {ResponseFactory} from '../providers/response-factory'
import {OpenAPI} from 'openapi-types'
import {HttpRequestPlan} from '../../models/api-call-plan'

describe('SwaggerGpt', () => {
  let mockResponseFactory: jest.Mocked<ResponseFactory>
  let mockWindowSender: jest.Mocked<AsyncWindowSenderApi>
  
  beforeEach(() => {
    mockWindowSender = {
      appendContent: jest.fn(),
      loadAllOas: jest.fn(),
      getOas: jest.fn(),
    } as any
    mockResponseFactory = {
      promptAndParseJson: jest.fn(),
      prompt: jest.fn(),
    } as any
    container.registerInstance(AsyncWindowSenderApi, mockWindowSender)
    container.registerInstance(ResponseFactory, mockResponseFactory)
  })
  
  afterEach(() => {
    jest.clearAllMocks()
    container.clearInstances()
  })
  
  it('should handle start method with conversation', async () => {
    const mockConversation = {
      id: '123',
      content: [{
        message: 'Tell me the most popular songs by pink flyod',
        id: '',
        chatId: '',
        author: '',
        role: 'user',
      }],
      responder: {
        type: 'organization',
        provider: 'openai',
        model: 'gpt-4-turbo' as string,
        tools: ['123']
      },
      title: '',
      created: '',
    } satisfies Conversation
    mockWindowSender.getOas.mockResolvedValue({} as OpenAPI.Document)
    mockResponseFactory.promptAndParseJson.mockResolvedValue([] as HttpRequestPlan[])
    const sg = container.resolve(SwaggerGpt)
    await sg.start(mockConversation)
  })
})
