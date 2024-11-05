import { fuzzyMatch } from "./oas-filter"
import spec from "../../prompts/oas/spotify-oas.json"
import { OpenAPI } from "openapi-types"

const openApiSpec = spec as unknown as OpenAPI.Document

test("fuzzyMatch", () => {
  const actual = fuzzyMatch(
    "/artists/00FQb4jTyendYWaN8pK0wa/albums",
    "/artists/{artist_id}/albums"
  )
  expect(actual).toBe(true)
})
