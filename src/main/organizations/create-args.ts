import {loadOas} from '../utils/load-oas'
import {AgentConstructionArgs} from '../agents/agent'
import {OpenApiSpec} from '../../models/open-api-spec'
import {oasToDescriptions} from '../utils/oas-filter'


function specToOas(spec: OpenApiSpec): string {
  return JSON.stringify(oasToDescriptions(spec), null, 2)
}

/**
 * Create arguments for agents of the organization once to dedup calls to load oas and other resources
 * needed for the template creation for the agent
 *
 * note that secrets are requested by the tool and not the agent
 */
export async function createArgs() {
  const oasSpec = await loadOas()
  const endpoints = oasSpec.reduce((acc: string, spec) => acc + specToOas(spec), '')
  return {
    endpoints,
    oasSpec,
  } as AgentConstructionArgs
}