import {OpenAPI} from 'openapi-types'
import {HttpRequestPlan} from '../../models/api-call-plan'

function setEndpointDescription(object: Record<string, any>, path: string, key: string, value: any) {
  if (!(path in object)) {
    object[path] = {}
  }
  object[path][key] = value.replace('\n', ' ').trim()
}

/**
 * gets the description of paths in the specification
 * It does not read the description of the oas overall, which is also available
 * @param oasSpec
 */
export function oasToDescriptions(oasSpec: OpenAPI.Document): object {
  const spec = {}
  for (const key in oasSpec.paths) {
    const endpoint = oasSpec.paths[key]
    if (endpoint?.get?.description) {
      setEndpointDescription(spec, key, 'get', endpoint?.get.description)
    }
    if (endpoint?.put?.description) {
      setEndpointDescription(spec, key, 'put', endpoint?.put.description)
    }
    if (endpoint?.patch?.description) {
      setEndpointDescription(spec, key, 'patch', endpoint?.patch.description)
    }
    if (endpoint?.post?.description) {
      setEndpointDescription(spec, key, 'post', endpoint?.post.description)
    }
    if (endpoint?.delete?.description) {
      setEndpointDescription(spec, key, 'delete', endpoint?.delete.description)
    }
  }
  return spec
}

export function fuzzyMatch(a: string, b: string): boolean {
  const aSegments = a.split("/")
  const bSegments = b.split("/")
  
  if (aSegments.length !== bSegments.length) {
    return false
  }
  
  for (let i = 0; i < aSegments.length; i++) {
    const aSegment = aSegments[i]
    const bSegment = bSegments[i]
    // if a segment is surrounded by curly braces, acts like a wild card
    if (aSegment.startsWith("{") && aSegment.endsWith("}")) {
      continue
    }
    if (bSegment.startsWith("{") && bSegment.endsWith("}")) {
      continue
    }
    if (aSegments[i] !== bSegments[i]) {
      return false
    }
  }
  return true
}

/**
 * Dubious
 * @param oasSpec
 * @param plans
 */
export function treeShake(oasSpec: OpenAPI.Document, plans: HttpRequestPlan[]) {
  const spec = {} as Record<string, any>
  for (const endpointPath in oasSpec.paths) {
    for (const plan of plans) {
      if (fuzzyMatch(endpointPath, plan.url)) {
        const matched = oasSpec.paths[endpointPath]
        const verb = plan.httpVerb.toLowerCase()
        spec[endpointPath] = {}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spec[endpointPath][verb] = matched[verb]
      }
    }
  }
  return spec
}
