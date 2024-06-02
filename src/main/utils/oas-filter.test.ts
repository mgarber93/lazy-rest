import {fuzzyMatch, oasToDescriptions, treeShake} from './oas-filter'
import spec from '../../prompts/oas/spotify-oas.json'
import {HttpRequestPlan, THttp} from '../../models/conversation'
import {OpenAPI} from 'openapi-types'

const openApiSpec = spec as unknown as OpenAPI.Document

test('oasToDescriptions', () => {
  const actual = oasToDescriptions(openApiSpec)
  expect(actual).toMatchSnapshot()
})

test('fuzzyMatch', () => {
  const actual = fuzzyMatch('/artists/00FQb4jTyendYWaN8pK0wa/albums', '/artists/{artist_id}/albums')
  expect(actual).toBe(true)
})

test('treeShake', () => {
  const endpoints = [
    {
      method: 'GET' as THttp,
      baseUrl: '',
      path: '/artists/00FQb4jTyendYWaN8pK0wa/albums',
    },
  ] as HttpRequestPlan[]
  const actual = treeShake(openApiSpec, endpoints)
  expect(actual).toMatchSnapshot()
})
