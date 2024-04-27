import {Conversation} from '../../models/conversation'
import {Card} from './card'
import styled from 'styled-components'
import {useAppDispatch, useAppSelector} from '../features/store'
import {useCallback} from 'react'
import {selectChat} from '../features/current-chat'

const TopNavContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.2rem;
  font-size: small;
  background-color: var(--background-color-2);
`

const Button = styled.button`
  border: none;
  overflow: hidden;
  width: 10rem;
  text-align: left;
  text-overflow: clip;
  white-space: nowrap;
  background-color: transparent;
`

function Tab({conversation}: {conversation: Conversation}) {
  const dispatch = useAppDispatch()
  const handleClick = useCallback(() => {
    dispatch(selectChat(conversation.id))
  }, [dispatch])
  return <Button onClick={handleClick}>
    {conversation.content[0]?.message ?? 'New chat'}
  </Button>
}

export function Tabs() {
  const conversations = useAppSelector(state => state.chats)
  return <TopNavContainer>
    {conversations.map(chat => <Card><Tab key={chat.id} conversation={chat}/></Card>)}
  </TopNavContainer>
}