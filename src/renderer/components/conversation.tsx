import React from 'react'
import styled from 'styled-components'
import {Message} from './message'
import {SendMessage} from './send-message'
import {useCurrentConversation, useCurrentTools} from '../hooks/current-conversation'
import {CallingPlanApproval} from './calling-plan-approval'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: clamp(5rem, 100%, 63.25rem);
  padding-top: 1rem;
  padding-bottom: 2.5rem;
  height: fit-content;
`

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
`


export const ConversationComponent = () => {
  const activeChat = useCurrentConversation()
  const tools = useCurrentTools()

  return (
    <StyledDiv>
      <MessagesContainer>
        {
          activeChat?.content.map(content => <Message key={content.id} content={content}/>)
        }
        {
          tools ? <CallingPlanApproval tools={tools}></CallingPlanApproval> : null
        }
      </MessagesContainer>
      <SendMessage/>
    </StyledDiv>
  )
}
