import OpenAI from 'openai';
import {AuthoredContent} from '../../models/content';

if (!process.env['OPENAI_API_KEY']) {
  throw new Error('No process.env[\'OPENAI_API_KEY\']!');
}
const openai = new OpenAI({});

// https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
export async function getModels(): Promise<string> {
  return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'].join(',');
  // const models = await openai.models.list();
  // return models.data
  //   .filter(item => item.object === 'model' && item.id.startsWith('gpt'))
  //   .map(item => item.id)
  //   .join(',');
}


export async function chat(model: string, content: AuthoredContent[]): Promise<{role: string, content: string}> {
  const messages = content.map(item => ({role: item.role, content: item.message}))
  const chatCompletion = await openai.chat.completions.create({
    model,
    messages,
  });
  return chatCompletion.choices[0].message;
}
