import React from 'react';
import styled from 'styled-components';
import {Message} from './message';
import {SendMessage} from './send-message';
import {useCurrentConversation} from '../hooks/current-conversation';

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
    gap: 1rem;
    max-height: 95%;
    overflow-y: auto;
`

export const ConversationComponent = () => {
  const activeChat = useCurrentConversation()
  return (
    <StyledDiv>
      <MessagesContainer>
        {
          activeChat?.content.map(content => <Message key={content.id} content={content}/>)
        }
      </MessagesContainer>
      <SendMessage/>
    </StyledDiv>
  );
};