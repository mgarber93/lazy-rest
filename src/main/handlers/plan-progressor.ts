import {Conversation, Plan} from '../../models/conversation'
import {container, singleton} from 'tsyringe'
import {Handler} from './handler'
import {SwaggerGpt} from '../organizations/swagger-gpt'


@singleton()
export class PlanProgressor implements Handler<'continuePlan'> {
  private swaggerGpt = container.resolve(SwaggerGpt)
  async handle(conversation: Conversation): Promise<Plan> {
    throw new Error('not implemented')
  }
}
