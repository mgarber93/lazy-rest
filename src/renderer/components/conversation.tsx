import React from 'react';
import styled from 'styled-components';
import {Message} from './message';
import {SendMessage} from './send-message';
import {useCurrentConversation} from '../hooks/current-conversation';

const StyledDiv = styled.div`
    background-image: linear-gradient(90deg, var(--background-color-0), var(--background-color-1), var(--background-color-0));
    display: flex;
    flex-direction: column;
    width: 100%;
`

const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    padding-bottom: 2.5rem;
    max-height: 92%;
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
      </MessagesContainer>
      <SendMessage/>
    </StyledDiv>
  );
};