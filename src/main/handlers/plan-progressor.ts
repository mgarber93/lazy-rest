import {Conversation} from '../../models/conversation'
import {container, singleton} from 'tsyringe'
import {Handler} from './handler'
import {SwaggerGpt} from '../organizations/swagger-gpt'
import {ApiCallPlan} from '../organizations/api-call-plan'


@singleton()
export class PlanProgressor implements Handler<'continuePlan'> {
  private swaggerGpt = container.resolve(SwaggerGpt)
  
  async handle(conversation: Conversation): Promise<ApiCallPlan> {
    throw new Error('not implemented')
  }
}
