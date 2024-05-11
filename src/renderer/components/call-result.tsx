import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'

const Div = styled.div`
`

export function ResultOfCall({result}: { result: object }) {
  const serialized = JSON.stringify(result, null, 2)
  
  return <Div>
    <Markdown className="content" remarkPlugins={[remarkGfm]}>{
      `\`\`\`json\n${serialized.trim()}\n\`\`\``
    }</Markdown>
  </Div>
}