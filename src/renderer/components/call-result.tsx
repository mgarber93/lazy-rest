import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'

const Div = styled.div`
  background-color: var(--background-color-2);
  border-radius: var(--border-radius-comfy);
  padding: 1rem;
`

export function ResultOfCall({result}: { result: object }) {
  const serialized = JSON.stringify(result, (key: string, value: any) => {
    if (Array.isArray(value) && value.length > 3)
      return `[${value.slice(0, 3).join(', ')}, ...]`
    return value
  }, 2)
  
  return <Div>
    <button>Summarize</button>
    <Markdown className="content" remarkPlugins={[remarkGfm]}>{
      `\`\`\`json\n${serialized.trim()}\n\`\`\``
    }</Markdown>
  </Div>
}