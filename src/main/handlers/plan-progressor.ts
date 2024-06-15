import {Conversation, Plan} from '../../models/conversation'
import {container, singleton} from 'tsyringe'
import {Handler} from './handler'
import {SwaggerGptPlanProgressor} from '../organizations/swagger-gpt'


@singleton()
export class PlanProgressor implements Handler<'continuePlan'> {
  private swaggerGpt = container.resolve(SwaggerGptPlanProgressor)
  async handle(conversation: Conversation): Promise<Plan> {
    throw new Error('not implemented')
  }
}
