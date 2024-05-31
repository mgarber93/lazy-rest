
import {buildCallerPrompt} from './api-caller'
import spotify from './oas/spotify-oas.json'

// define some tests
describe('buildCallerPrompt Function', () => {


  test('should return the prompt given a valid goal and apiDocs', () => {
    const goal = 'Goal 1'
    const result = buildCallerPrompt(goal, spotify)
    
    expect(result).toMatchSnapshot()
  })
  
  test('should throw an error if goal is missing', () => {
    expect(() => buildCallerPrompt('', dummyApiDocs))
      .toThrowError('Api Caller prompt missing goal for Call!')
  })
  
  test('should throw an error if apiDocs is missing', () => {
    expect(() => buildCallerPrompt('Goal 1', undefined))
      .toThrowError('Api Caller prompt missing apiDocs for Call!')
  })
})