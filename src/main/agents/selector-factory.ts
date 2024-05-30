import {singleton} from 'tsyringe'
import {Model} from '../../models/responder'
import {AuthoredContent} from '../../models/content'
import {selector} from '../../prompts/rest-gpt/selector'
import {AgentFactory} from './agent-factory'

@singleton()
export class SelectorFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } as Model
  
  create(goal: AuthoredContent, endpoints: string) {
    return this.createAgent(goal, selector(endpoints))
  }
}