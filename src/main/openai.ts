import OpenAI from 'openai';
import {AuthoredContent} from '../models/content';

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


interface ToolParameter {
  type: 'object' | 'string' | 'number';
  enum: string[];
  description: string;
}

interface ObjectParameter extends ToolParameter {
  type: 'object';
  required: string[];
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
}

export async function agentWithHttp(model: string, content: AuthoredContent[]) {
  const messages = content.map(item => ({role: item.role, content: item.message}))
  
  const result = await openai.chat.completions.create({
    messages,
    model,
    tools: [
      {
        type: 'function',
        function: {
          name: "GET",
          description: "Retrieves data from the server without modifying it.",
          parameters: {
            type: "object",
            properties: {
              endpoint: {
                type: 'string',
                description: 'endpoint to call (e.g. /search?customer=123)',
              },
            },
            required: ["endpoint"],
          },
        },
      },
    ],
  });
  return result.choices[0].message;
}