import {container, singleton} from 'tsyringe'
import {CallDetailer} from './call-detailer'
import {Plan} from '../../models/conversation'
import {ResultInterpreter} from './result-interpreter'

@singleton()
export class SwaggerGptPlanProgressor {
  private callDetailer = container.resolve(CallDetailer)
  private resultInterpreter = container.resolve(ResultInterpreter)
  
  async continue(plan: Plan) {
    return plan
  }
}
