jest.mock('../agents/planner-factory', () => {
  return {
    PlannerFactory: jest.fn().mockImplementation(() => {
      return {
        createAndPrompt: jest.fn().mockReturnValue(Promise.resolve('Mocked planner')),
      }
    }),
  }
})

import {container} from 'tsyringe'
import {SwaggerGpt} from './swagger-gpt'
import {Conversation, createConversation} from '../../models/conversation'

describe('SwaggerGpt', () => {
  let swaggerGpt: SwaggerGpt
  const conversation = {
    "id": "1c7f59b6-4128-455b-b82c-cf9dd5d8391f",
    "content": [
      {
        "id": "70ca8dbd-e0c0-4769-998b-a833f83c1cce",
        "chatId": "1c7f59b6-4128-455b-b82c-cf9dd5d8391f",
        "message": "tell me songs by mariah carrey",
        "author": "matt",
        "role": "user",
      },
    ],
    "title": "new",
    "created": "Mon Jul 15 2024 02:26:23 GMT-0400 (Eastern Daylight Time)",
    "responder": {
      "type": "organization",
      "provider": "openai",
      "model": "gpt-4o",
      "orgId": "SwaggerGpt",
    },
  } satisfies Conversation
  beforeEach(() => {
    swaggerGpt = container.resolve(SwaggerGpt)
  })
  it('continue throws if no conversation exists', async () => {
    return expect(swaggerGpt.continue(createConversation()))
      .rejects
      .toThrow('')
  })
  it('continue creates a plan and invokes planner with it', () => {
    return expect(swaggerGpt.continue(conversation))
      .resolves
      .toBeUndefined()
  })
})