import {OpenApiSpec} from '../models/open-api-spec';

function setEndpointDescription(object: Record<string, any>, path: string, key: string, value: any) {
  if (!(path in object)) {
    object[path] = {};
  }
  object[path][key] = value.replace('\n', ' ').trim();
}

export function oasToDescriptions(oasSpec: OpenApiSpec): object {
  const spec = {};
  for (const key in oasSpec.paths) {
    const endpoint = oasSpec.paths[key];
    
    if (endpoint.get?.description) {
      setEndpointDescription(spec, key, 'get', endpoint.get.description);
    }
    if (endpoint.put?.description) {
      setEndpointDescription(spec, key, 'put', endpoint.put.description);
    }
    if (endpoint.patch?.description) {
      setEndpointDescription(spec, key, 'patch', endpoint.patch.description);
    }
    if (endpoint.post?.description) {
      setEndpointDescription(spec, key, 'post', endpoint.post.description);
    }
    if (endpoint.delete?.description) {
      setEndpointDescription(spec, key, 'delete', endpoint.delete.description);
    }
  }
  return spec;
}

export function fuzzyMatch(a: string, b: string): boolean {
  const aSegments = a.split("/");
  const bSegments = b.split("/");
  
  if (aSegments.length !== bSegments.length) {
    return false;
  }
  
  for (let i = 0; i < aSegments.length; i++) {
    const aSegment = aSegments[i];
    const bSegment = bSegments[i];
    // if a segment is surrounded by curly braces, acts like a wild card
    if (aSegment.startsWith("{") && aSegment.endsWith("}")) {
      continue;
    }
    if (bSegment.startsWith("{") && bSegment.endsWith("}")) {
      continue;
    }
    if (aSegments[i] !== bSegments[i]) {
      return false;
    }
  }
  return true;
}

export function treeShake(oasSpec: OpenApiSpec, endpoints: string[]) {
  const spec = {} as Record<string, any>;
  for (const endpointPath in oasSpec.paths) {
    for (const calledEndpoint of endpoints) {
      if (fuzzyMatch(endpointPath, calledEndpoint)) {
        spec[endpointPath] = oasSpec.paths[endpointPath];
      }
    }
  }
  return spec;
}