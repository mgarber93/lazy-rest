import {container, injectable} from 'tsyringe'
import {Handler} from './handler'
import {ApiCallPlan, SummarizationJob} from '../../models/api-call-plan'
import {OllamaProvider} from '../providers/ollama'

@injectable()
export class SummarizeResponse implements Handler<'summarizeResponse'> {
  private ollamaProvider = container.resolve(OllamaProvider)
  
  async handle(job: SummarizationJob): Promise<ApiCallPlan> {
    const activity = job.apiCallPlan.steps[job.index]
    const {response, step} = activity
    if (!step.response?.data) {
      throw new Error('no response data')
    }
    const answer = await this.ollamaProvider.prompt(`Answer <goal>${step.name} </goal> only using <info>${JSON.stringify(step.response?.data)}</info>. Respond in the format: The answer is <answer></answer> \n`, 'llama3.1:latest')
    // @todo summarize response and update next step with info
    return job.apiCallPlan
  }
}
