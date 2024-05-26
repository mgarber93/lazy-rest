import {OpenAiConfiguration} from '../../models/provider-config'
import providerManager from '../../main/providers/provider-manager'
import windowSender from '../../main/utils/window-sender'
import {HttpRequestPlan} from '../../models/http-request-plan'
import {approveCallingPlan, get} from '../tools/http'

export async function handleSetOpenAiConfiguration(config: OpenAiConfiguration): Promise<void> {
  providerManager.setOpenAiConfig(config)
}

export async function callback(id: string, arg: any) {
  return windowSender.callback(id, arg)
}

export async function processHttpRequest(call: HttpRequestPlan) {
  const token = await approveCallingPlan(null)
  
  switch (call.method) {
    case "GET": {
      const response = await get(token, call.path)
      console.log(JSON.stringify(response, null, 2))
      return response
    }
  }
  throw new Error(`Not implemented`)
}
