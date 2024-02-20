import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {RootState} from '../store';
import {Message} from './message';
import {SendMessage} from './send-message';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    padding-top: 1rem;
    padding-bottom: 2.5rem;
    gap: 1rem;
`


export const ConversationComponent = () => {
  const messages = useSelector((state: RootState) => state.chats.content);
  return (
    <StyledDiv>
      <MessagesContainer>
        {
          messages.map(message => <Message key={message.id} content={message}/>)
        }
      </MessagesContainer>
      <SendMessage/>
    </StyledDiv>
  );
};