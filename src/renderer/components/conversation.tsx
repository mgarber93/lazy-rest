import React from 'react';
import styled from 'styled-components';
import {Message} from './message';
import {SendMessage} from './send-message';
import {useCurrentConversation} from '../hooks/current-conversation';
import MessageSender from './message-sender';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  padding-bottom: 2.5rem;
  overflow-y: auto;

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
        {activeChat?.autoPrompter ? <MessageSender/> : null}
      </MessagesContainer>
      <SendMessage/>
    </StyledDiv>
  );
};