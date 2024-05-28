import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'
import {Icon} from './icon'
import {useCallback} from 'react'
import {useCurrentConversation} from '../hooks/current-conversation'
import {interpretResult} from '../features/chat'
import {useAppDispatch} from '../features/store'

const Div = styled.div`
  background-color: var(--background-color-2);
  border-radius: var(--border-radius-comfy);
  padding: 1rem;
  display: flex;
  flex-direction: row;

  .footer {
    margin-left: auto;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .content {
    max-width: 55rem;
  }
`

export function ResultOfCall({result}: { result: object }) {
  const currentConversation = useCurrentConversation()
  const dispatch = useAppDispatch()
  const serialized = JSON.stringify(result, (key: string, value: any) => {
    if (Array.isArray(value) && value.length > 3)
      return `[${value.slice(0, 6).join(', ')}, ...]`
    return value
  }, 2)

  const handleClick = useCallback(() => {
    dispatch(interpretResult({conversation: currentConversation}))
  }, [currentConversation])
  
  return <Div>
    <Markdown className="content" remarkPlugins={[remarkGfm]}>{
      `\`\`\`json\n${serialized.trim()}\n\`\`\``
    }</Markdown>
    <div className="footer">
      <Icon type={"checkbox"} handleClick={handleClick}/>
    </div>
  </Div>
}
