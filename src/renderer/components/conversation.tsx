import React from 'react'
import styled from 'styled-components'
import {Message} from './message'
import {SendMessage} from './send-message'
import {useCurrentConversation} from '../hooks/current-conversation'
import {CallingPlanApproval} from './calling-plan-approval'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 2.5rem;
`

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const ConversationComponent = () => {
  const activeChat = useCurrentConversation()

  return (
    <StyledDiv>
      <MessagesContainer>
        {
          activeChat?.content.map(content => <Message key={content.id} content={content}/>)
        }
        <CallingPlanApproval></CallingPlanApproval>
      </MessagesContainer>
      <SendMessage/>
    </StyledDiv>
  )
}