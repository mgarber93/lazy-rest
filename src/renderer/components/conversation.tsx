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
    max-height: 90%;
    margin: 4rem;
`

const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 80%;
    overflow-y: scroll;
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