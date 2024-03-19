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