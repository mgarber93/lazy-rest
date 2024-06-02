import {parseCalls} from './utils'
import {OpenAPI} from 'openapi-types'

test('parseCalls', () => {
  const test = 'Background: No background  \n' +
    'User query: What are the most popular songs by the artist altrice?  \n' +
    'API calling 1: GET /search to search for the artist "altrice"  \n' +
    'API response: altrice\'s artist_id is xyz123abc  \n' +
    'API calling 2: GET /artists/xyz123abc/top-tracks to get the most popular songs by altrice  \n' +
    'API response: The most popular songs by altrice are "Song A", "Song B", "Song C"  \n' +
    'Instruction: No further API calls needed.'
  const actual = parseCalls(test, {} as OpenAPI.Document)
  expect(actual).toMatchSnapshot()
})
