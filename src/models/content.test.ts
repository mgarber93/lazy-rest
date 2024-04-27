import {createContent} from './content'

test('create content', () => {
  const content = createContent('my message', '123', 'me', 'system')
  expect(content.message).toBe('my message')
})