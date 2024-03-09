import OpenAI from 'openai';
import {AuthoredContent} from '../../models/content';

if (!process.env['OPENAI_API_KEY']) {
  throw new Error('No process.env[\'OPENAI_API_KEY\']!');
}
const openai = new OpenAI({});


export async function getModels(): Promise<string> {
  return ['gpt-4', 'gpt-3.5-turbo'].join(',');
  // const models = await openai.models.list();
  // return models.data
  //   .filter(item => item.object === 'model' && item.id.startsWith('gpt'))
  //   .map(item => item.id)
  //   .join(',');
}


export async function chat(model: string, content: AuthoredContent[]): Promise<string> {
  const messages = content.map(item => ({role: item.role, content: item.message}))
  const chatCompletion = await openai.chat.completions.create({
    model,
    messages,
  });
  return JSON.stringify(chatCompletion.choices[0].message);
}

