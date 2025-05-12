import {container} from 'tsyringe'
import {SwaggerGpt} from './swagger-gpt'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {Conversation} from '../../models/conversation'
import {ResponseFactory} from '../providers/response-factory'

describe('SwaggerGpt', () => {
  let mockResponseFactory: ResponseFactory
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
      content: [],
      responder: {
        type: 'organization',
        provider: 'openai',
        model: 'gpt-4-turbo' as string,
      },
      title: 'foo',
      created: '',
    } satisfies Conversation
    const sg = container.resolve(SwaggerGpt)
    await sg.start(mockConversation)
    expect(mockResponseFactory.promptAndParseJson).toHaveBeenCalledWith(mockConversation)
  })
})
