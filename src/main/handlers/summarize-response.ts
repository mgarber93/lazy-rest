import {container, injectable} from 'tsyringe'
import {Handler} from './handler'
import {SummarizationJob} from '../../models/api-call-plan'
import {OllamaProvider} from '../providers/ollama'

@injectable()
export class SummarizeResponse implements Handler<'summarizeResponse'> {
  private ollamaProvider = container.resolve(OllamaProvider)
  
  async handle(job: SummarizationJob): Promise<string> {
    const activity = job.apiCallPlan.steps[job.index]
    const {step} = activity
    if (!step.response?.data) {
      throw new Error('no response data')
    }
    const answer = await this.ollamaProvider.prompt(`Answer <goal>${step.name} </goal> only using <info>${JSON.stringify(step.response?.data)}</info>. Respond in the format: "x" is 1. "y" is 2. (eg artist_id is 1234.) \n`, 'llama3.1:latest')
    console.log('SummarizeResponse:handle', answer.slice(0,80))
    // @todo summarize response and update next step with info
    return answer
  }
}
