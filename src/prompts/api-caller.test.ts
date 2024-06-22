import OpenAPIParser from '@readme/openapi-parser'
import {OpenAPI} from 'openapi-types'
import path from 'path'
import {buildCallerPrompt} from './api-caller'


const filePath = path.resolve(__dirname, 'oas', 'fixed-spotify-open-api.yml')

describe('buildCallerPrompt Function', () => {
  let api: OpenAPI.Document | null
  beforeEach(async () => {
    api = await OpenAPIParser.parse(filePath)
    console.log('API name: %s, Version: %s', api.info.title, api.info.version)
  })
  
  test('should throw an error if goal is missing', () => {
    expect(() => buildCallerPrompt('', api))
      .toThrowError('Api Caller prompt missing goal for Call!')
  })
  
  test('should throw an error if apiDocs is missing', () => {
    expect(() => buildCallerPrompt('Goal 1', undefined))
      .toThrowError('Api Caller prompt missing apiDocs for Call!')
  })
})
