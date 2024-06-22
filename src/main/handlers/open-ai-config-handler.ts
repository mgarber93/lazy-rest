import {container, singleton} from 'tsyringe'
import {Handler} from './handler'
import {ConfigurationManager} from '../providers/configuration-manager'
import {OpenAiConfiguration} from '../../models/provider-config'

@singleton()
export class OpenAiConfigHandler implements Handler<'setOpenAiConfiguration'> {
  private configManager = container.resolve(ConfigurationManager)
  
  async handle(config: OpenAiConfiguration): Promise<void> {
    this.configManager.setOpenAiConfig(config)
  }
}
