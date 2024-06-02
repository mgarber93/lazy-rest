import OpenAPIParser from '@readme/openapi-parser'
import {OpenAPI} from 'openapi-types'
import fs from 'fs'
import path from 'path'
import {buildCallerPrompt} from './api-caller'


// src/prompts/oas/fixed-spotify-open-api.yml
const filePath = path.resolve(__dirname, 'oas', 'fixed-spotify-open-api.yml')
const spotify = fs.readFileSync(filePath, 'utf8')

const options = {
  continueOnError: true,            // Don't throw on the first error
  parse: {
    json: true,                    // Disable the JSON parser
    yaml: {
      allowEmpty: false,             // Don't allow empty YAML files
    },
    text: {
      canParse: [".txt", ".html"],  // Parse .txt and .html files as plain text (strings)
      encoding: 'utf16',             // Use UTF-16 encoding
    },
  },
  resolve: {
    file: false,                    // Don't resolve local file references
    http: {
      timeout: 2000,                // 2 second timeout
      withCredentials: false,        // Include auth credentials when resolving HTTP references
    },
  },
  dereference: {
    circular: true,                 // Don't allow circular $refs
  },
  validate: {
    spec: false,                     // Don't validate against the Swagger spec
  },
}


async function openApiParse(content: string) {
  return OpenAPIParser.validate(content, {resolve: {file: false, external: true}})
}

// define some tests
describe('buildCallerPrompt Function', () => {
  let api: OpenAPI.Document | null
  beforeEach(async () => {
    try {
      // I'm really sure its an open api doc because I downloaded it from spotify.
      api = await openApiParse(spotify)
      console.log('API name: %s, Version: %s', api.info.title, api.info.version)
    } catch (err) {
      console.error(err)
    }
  })
  test('should return the prompt given a valid goal and apiDocs', () => {
    const goal = 'Goal 1'
    const result = buildCallerPrompt(goal, api)
    expect(result).toMatchSnapshot()
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
