import OpenAI from 'openai';

if (!process.env['OPENAI_API_KEY']) {
  throw new Error('No process.env[\'OPENAI_API_KEY\']!');
}
const openai = new OpenAI({});


export async function chat(content: string): Promise<string> {
  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content}],
  });
  return chatCompletion.choices[0].message.content ?? '';
}

