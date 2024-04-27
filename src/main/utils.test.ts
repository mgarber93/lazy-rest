import {parseCalls} from './utils'

test('parseCalls', () => {
  const test = 'Background: No background  \n' +
    'User query: What are the most popular songs by the artist altrice?  \n' +
    'API calling 1: GET /search to search for the artist "altrice"  \n' +
    'API response: altrice\'s artist_id is xyz123abc  \n' +
    'API calling 2: GET /artists/xyz123abc/top-tracks to get the most popular songs by altrice  \n' +
    'API response: The most popular songs by altrice are "Song A", "Song B", "Song C"  \n' +
    'Instruction: No further API calls needed.'
  const actual = parseCalls(test)
  expect(actual).toEqual([
    {method: 'GET', path: '/search', background: 'to search for the artist "altrice"'},
    {method: 'GET', path: '/artists/xyz123abc/top-tracks', background: 'to get the most popular songs by altrice'},
  ])
})